"""
Generate upright raster previews for certificate/document PDFs and images.

Does not modify original files. Writes:
  public/{certificates|documents}/previews/{stem}.webp
  public/certificate-previews.json  (href -> preview/view mapping)

Unstop / Media.net exports often bake landscape artwork into a portrait
page with content-stream clip paths (W*) and a MediaBox that chops the
top of the portrait page — which becomes the RIGHT edge after uprighting.
For those PDFs we strip clips, expand MediaBox in-memory, render, rotate,
then trim to ink.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

import fitz
import numpy as np
from PIL import Image, ImageOps

ROOT = Path(r"c:\Users\Vivek Vasani\Desktop\vivek-vasani-portfolio")
PUBLIC = ROOT / "public"
SOURCES = [
    (PUBLIC / "certificates", "/certificates"),
    (PUBLIC / "documents", "/documents"),
]


def upright_score(arr: np.ndarray) -> float:
    ink = arr < 200
    row = ink.sum(axis=1).astype(np.float64)
    if row.std() < 1e-6:
        return 0.0
    d = np.diff(row)
    return float(d.var() / (row.mean() + 1e-6))


def content_bounds(page: fitz.Page) -> fitz.Rect:
    """Union of page rect, image placements, and vector drawing bounds."""
    bounds = fitz.Rect(page.rect)
    for info in page.get_image_info(xrefs=True):
        bounds |= fitz.Rect(info["bbox"])
    try:
        for item in page.get_drawings():
            r = fitz.Rect(item["rect"])
            if r.is_valid and not r.is_empty and abs(r.width) < 5000 and abs(r.height) < 5000:
                bounds |= r
    except Exception:
        pass
    return bounds


def bounds_overflow_page(bounds: fitz.Rect, page_rect: fitz.Rect, eps: float = 1.0) -> bool:
    return (
        bounds.x0 < page_rect.x0 - eps
        or bounds.y0 < page_rect.y0 - eps
        or bounds.x1 > page_rect.x1 + eps
        or bounds.y1 > page_rect.y1 + eps
    )


def strip_content_clips(doc: fitz.Document, page: fitz.Page) -> int:
    """Remove W / W* clip operators from page content streams (in-memory only)."""
    removed = 0
    for cx in page.get_contents():
        raw = doc.xref_stream(cx)
        new = re.sub(br"\bW\*\s+n\b", b"n", raw)
        new = re.sub(br"\bW\s+n\b", b"n", new)
        new = re.sub(br"\bW\*\b", b"", new)
        new = re.sub(br"\bW\b", b"", new)
        if new != raw:
            removed += raw.count(b"W")
            doc.update_stream(cx, new)
    return removed


def expand_mediabox(doc: fitz.Document, page: fitz.Page, bounds: fitz.Rect, pad: float = 72.0) -> None:
    """
    Expand MediaBox/CropBox in PDF coordinates so MuPDF renders overflow.

    page.rect is MuPDF y-down; MediaBox is PDF y-up. For the common identity
    case MediaBox=[0,0,W,H] with page.rect=[0,0,W,H]:
      mu (x, y_top) <-> pdf (x, H - y_top)
    """
    mb0 = fitz.Rect(page.mediabox)
    pad_rect = fitz.Rect(bounds.x0 - pad, bounds.y0 - pad, bounds.x1 + pad, bounds.y1 + pad)
    llx = mb0.x0 + pad_rect.x0
    urx = mb0.x0 + pad_rect.x1
    ury = mb0.y1 - pad_rect.y0
    lly = mb0.y1 - pad_rect.y1
    # Ensure non-degenerate
    if urx - llx < 10 or ury - lly < 10:
        return
    mb_str = f"[{llx} {lly} {urx} {ury}]"
    doc.xref_set_key(page.xref, "MediaBox", mb_str)
    doc.xref_set_key(page.xref, "CropBox", mb_str)


def trim_ink(img: Image.Image, pad: int = 16, threshold: int = 252) -> Image.Image:
    arr = np.array(img.convert("L"))
    ink = arr < threshold
    ys, xs = np.where(ink)
    if len(xs) == 0:
        return img
    x0 = max(0, int(xs.min()) - pad)
    y0 = max(0, int(ys.min()) - pad)
    x1 = min(img.width, int(xs.max()) + 1 + pad)
    y1 = min(img.height, int(ys.max()) + 1 + pad)
    return img.crop((x0, y0, x1, y1))


def choose_content_rotation(img: Image.Image, portrait: bool, text_len: int, pdf_rotate: int) -> int:
    """Detect landscape artwork baked sideways into a portrait page."""
    if not (portrait and text_len < 40 and pdf_rotate == 0):
        return 0
    gray = np.array(img.convert("L"))
    s0 = upright_score(gray)
    s90 = upright_score(np.rot90(gray, k=3))
    s270 = upright_score(np.rot90(gray, k=1))
    # Prefer 90 CW over 270 when scores are close — Unstop/Media.net exports
    # typically need +90, and 90/270 banding scores are often near-ties.
    if s90 >= s270 * 0.95:
        best_side, best_side_score = 90, s90
    else:
        best_side, best_side_score = 270, s270
    if best_side_score > s0 * 1.35 and best_side_score > 2.0:
        return best_side
    return 0


def render_pdf_page(path: Path, max_edge: int = 1600) -> tuple[Image.Image, int, dict]:
    doc = fitz.open(path)
    page = doc[0]
    pw, ph = page.rect.width, page.rect.height
    text_len = len(page.get_text("text").strip())
    pdf_rotate = page.rotation
    portrait = ph > pw
    portrait_image_only = portrait and text_len < 40 and pdf_rotate == 0
    bounds = content_bounds(page)
    overflow = bounds_overflow_page(bounds, page.rect)

    # Decide content rotation from a cheap page-box render FIRST.
    # Unclipping changes whitespace/banding and can break upright scoring.
    probe_scale = min(1.0, 900 / max(pw, ph))
    probe_pix = page.get_pixmap(matrix=fitz.Matrix(probe_scale, probe_scale), alpha=False)
    probe = Image.frombytes("RGB", [probe_pix.width, probe_pix.height], probe_pix.samples)
    rotate_cw = choose_content_rotation(probe, portrait, text_len, pdf_rotate)

    # Content-rotated Unstop/Media.net pages hide the chopped edge behind W*
    # clips — strip clips + expand MediaBox before the final rasterize.
    unclipped = False
    if rotate_cw or overflow or portrait_image_only:
        strip_content_clips(doc, page)
        expand_bounds = fitz.Rect(bounds)
        if rotate_cw or portrait_image_only:
            # Drawings under-report the clipped top; pad generously around page.
            expand_bounds |= fitz.Rect(-96, -96, pw + 96, ph + 96)
        expand_mediabox(doc, page, expand_bounds, pad=48.0)
        unclipped = True

    rw, rh = page.rect.width, page.rect.height
    scale = max_edge / max(rw, rh)
    pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    doc.close()

    if rotate_cw:
        # PIL Image.rotate is counter-clockwise; negate to apply clockwise degrees.
        img = img.rotate(-rotate_cw, expand=True)

    if unclipped:
        img = trim_ink(img, pad=16)

    meta = {
        "page_w": pw,
        "page_h": ph,
        "text_len": text_len,
        "pdf_rotate": pdf_rotate,
        "unclipped": unclipped,
        "content_rotate_cw": rotate_cw,
    }
    return img, rotate_cw, meta


def process_image(path: Path) -> tuple[Image.Image, int]:
    img = Image.open(path)
    img = ImageOps.exif_transpose(img)
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGB")
    elif img.mode == "RGBA":
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[-1])
        img = bg
    # Downscale for card preview if huge
    max_edge = 1600
    w, h = img.size
    if max(w, h) > max_edge:
        scale = max_edge / max(w, h)
        img = img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
    return img, 0


def save_webp(img: Image.Image, dest: Path, quality: int = 82) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "WEBP", quality=quality, method=6)


def main() -> None:
    manifest: dict[str, dict] = {}
    for folder, url_prefix in SOURCES:
        preview_dir = folder / "previews"
        preview_dir.mkdir(parents=True, exist_ok=True)
        for path in sorted(folder.iterdir()):
            if not path.is_file():
                continue
            if path.suffix.lower() not in {".pdf", ".png", ".jpg", ".jpeg", ".webp", ".gif"}:
                continue
            if path.parent.name == "previews":
                continue

            rel_url = f"{url_prefix}/{path.name}"
            stem = path.stem
            preview_name = f"{stem}.webp"
            preview_url = f"{url_prefix}/previews/{preview_name}"
            preview_path = preview_dir / preview_name

            if path.suffix.lower() == ".pdf":
                img, rotate_cw, meta = render_pdf_page(path, max_edge=1400)
                # Higher-res view asset when content was corrected
                view_url = None
                if rotate_cw or meta.get("unclipped"):
                    view_img, _, _ = render_pdf_page(path, max_edge=2200)
                    view_name = f"{stem}-view.webp"
                    save_webp(view_img, preview_dir / view_name, quality=88)
                    view_url = f"{url_prefix}/previews/{view_name}"
                save_webp(img, preview_path)
                entry = {
                    "preview": preview_url,
                    "contentRotateCw": rotate_cw,
                    "page": [round(meta["page_w"], 1), round(meta["page_h"], 1)],
                    "textLen": meta["text_len"],
                    "pdfRotate": meta["pdf_rotate"],
                    "unclipped": bool(meta.get("unclipped")),
                }
                if view_url:
                    entry["view"] = view_url
                manifest[rel_url] = entry
                print(
                    f"{rel_url}: preview ok rotate_cw={rotate_cw} "
                    f"unclipped={meta.get('unclipped')} "
                    f"size={img.size[0]}x{img.size[1]}"
                )
            else:
                img, rotate_cw = process_image(path)
                save_webp(img, preview_path)
                manifest[rel_url] = {
                    "preview": preview_url,
                    "contentRotateCw": rotate_cw,
                }
                print(f"{rel_url}: image preview ok size={img.size[0]}x{img.size[1]}")

    out = PUBLIC / "certificate-previews.json"
    out.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"\nWrote {out} ({len(manifest)} entries)")


if __name__ == "__main__":
    main()
