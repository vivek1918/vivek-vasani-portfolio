export function ProjectMark({ slug }: { slug: string }) {
  return (
    <div className="mark" aria-hidden="true">
      <svg viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice">
        {slug === "physioplay" ? <Physio /> : null}
        {slug === "socialpulse" ? <Social /> : null}
        {slug === "graphmind" ? <Graph /> : null}
        {slug === "fintech-analytics" ? <Ledger /> : null}
        {slug === "zomato-analysis" ? <Series /> : null}
        {slug === "document-verification" ? <Docs /> : null}
        {slug === "device-monitoring" ? <Devices /> : null}
        {slug === "seating-arrangement" ? <Seats /> : null}
      </svg>
    </div>
  );
}

function Physio() {
  return (
    <g fill="none" stroke="var(--line-strong)" strokeWidth="1.4">
      <path d="M70 250 C 140 80, 240 80, 300 180 S 470 300, 570 90" stroke="var(--accent-text)" />
      <circle cx="150" cy="150" r="18" />
      <circle cx="310" cy="186" r="28" stroke="var(--cyan)" />
      <circle cx="470" cy="150" r="14" />
      <path d="M120 280 H520" />
      <text x="78" y="54" fill="var(--faint)" stroke="none" fontFamily="ui-monospace, monospace" fontSize="14">
        CASE → RETRIEVE → REPLY
      </text>
    </g>
  );
}

function Social() {
  const bars = [80, 140, 60, 180, 110, 200, 90];
  return (
    <g>
      {bars.map((height, index) => (
        <rect key={height} x={70 + index * 70} y={280 - height} width="36" height={height} fill={index === 5 ? "var(--accent-text)" : "transparent"} stroke="var(--line-strong)" />
      ))}
      <path d="M80 90 H420" stroke="var(--cyan)" fill="none" />
      <text x="78" y="54" fill="var(--faint)" fontFamily="ui-monospace, monospace" fontSize="14">
        POSTS · SENTIMENT · ASK
      </text>
    </g>
  );
}

function Graph() {
  const points = [
    [120, 220],
    [220, 90],
    [340, 160],
    [470, 80],
    [520, 230],
    [300, 260],
  ];
  const links = [
    [0, 1],
    [1, 2],
    [2, 3],
    [2, 5],
    [3, 4],
    [0, 5],
    [5, 4],
  ];
  return (
    <g fill="none" stroke="var(--line-strong)">
      {links.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={points[a][0]} y1={points[a][1]} x2={points[b][0]} y2={points[b][1]} />
      ))}
      {points.map(([x, y], index) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={index === 2 ? 16 : 8} stroke={index === 2 ? "var(--accent-text)" : "var(--cyan)"} />
      ))}
      <text x="78" y="54" fill="var(--faint)" stroke="none" fontFamily="ui-monospace, monospace" fontSize="14">
        ENTITY · RELATION · QUERY
      </text>
    </g>
  );
}

function Ledger() {
  return (
    <g fill="none" stroke="var(--line-strong)">
      {Array.from({ length: 7 }).map((_, index) => (
        <path key={index} d={`M80 ${90 + index * 32} H560`} />
      ))}
      <path d="M180 70 V310" stroke="var(--accent-text)" />
      <path d="M360 70 V310" stroke="var(--cyan)" />
      <text x="78" y="48" fill="var(--faint)" stroke="none" fontFamily="ui-monospace, monospace" fontSize="14">
        CUSTOMERS · LOANS · SQL
      </text>
    </g>
  );
}

function Series() {
  return (
    <g fill="none" strokeWidth="1.6">
      <path d="M60 300 H590 M60 300 V50" stroke="var(--line-strong)" />
      <path d="M70 240 C 140 230, 180 160, 240 170 S 340 250, 400 140 520 90 580 120" stroke="var(--accent-text)" />
      <path d="M70 250 C 160 250, 220 210, 300 200 S 460 160, 580 180" stroke="var(--cyan)" strokeDasharray="4 6" />
      <text x="78" y="48" fill="var(--faint)" stroke="none" fontFamily="ui-monospace, monospace" fontSize="14">
        OPEN · CLOSE · VOLUME
      </text>
    </g>
  );
}

function Docs() {
  return (
    <g fill="none" stroke="var(--line-strong)">
      <rect x="150" y="70" width="220" height="240" />
      <rect x="190" y="50" width="220" height="240" stroke="var(--cyan)" />
      <rect x="230" y="90" width="220" height="240" stroke="var(--accent-text)" />
      <path d="M270 150 H400 M270 180 H380 M270 210 H410" />
      <text x="78" y="40" fill="var(--faint)" stroke="none" fontFamily="ui-monospace, monospace" fontSize="14">
        OCR → JSON
      </text>
    </g>
  );
}

function Devices() {
  return (
    <g fill="none" stroke="var(--line-strong)">
      <rect x="70" y="140" width="90" height="60" />
      <rect x="250" y="80" width="120" height="180" stroke="var(--accent-text)" />
      <rect x="460" y="130" width="110" height="80" stroke="var(--cyan)" />
      <path d="M160 170 H250 M370 170 H460" />
      <circle cx="210" cy="170" r="4" fill="var(--accent-text)" stroke="none" />
      <text x="78" y="54" fill="var(--faint)" stroke="none" fontFamily="ui-monospace, monospace" fontSize="14">
        MQTT · INFLUX · REDIS
      </text>
    </g>
  );
}

function Seats() {
  return (
    <g>
      {Array.from({ length: 48 }).map((_, index) => {
        const col = index % 8;
        const row = Math.floor(index / 8);
        const hot = [3, 12, 20, 27, 35, 44].includes(index);
        return <rect key={index} x={90 + col * 58} y={70 + row * 44} width="36" height="26" fill={hot ? "var(--accent-text)" : "transparent"} stroke="var(--line-strong)" />;
      })}
    </g>
  );
}
