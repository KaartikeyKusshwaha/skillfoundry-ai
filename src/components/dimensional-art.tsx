/** Decorative, lightweight isometric artwork drawn in SVG; no external image requests. */
export function DimensionalArt({ kind, step = 0 }: { kind: "care" | "workflow"; step?: number }) {
  if (kind === "care") return <svg className="dimensional-art care-art" viewBox="0 0 360 240" fill="none" aria-hidden="true">
    <ellipse cx="188" cy="208" rx="131" ry="15" fill="#10332E" opacity=".08"/>
    <path d="m62 166 128-58 116 55-128 61z" fill="#CADBCF"/>
    <path d="m62 154 128-58 116 55-128 61z" fill="#E4EDE6" stroke="#B8CCBE"/>
    <path d="m95 101 89-42 84 39v78l-89 42-84-40z" fill="#10332E"/>
    <path d="m95 101 84 39 89-42-84-39z" fill="#406A5C"/>
    <path d="m179 140 89-42v78l-89 42z" fill="#21483E"/>
    <path d="m123 105 61-28 55 25-61 28z" fill="#FAF6EE"/>
    <path d="m157 87 14 7-14 7 18 8 15-7 15 7 17-8-15-7 14-7-17-8-15 7-15-7z" fill="#C8472B"/>
    <path d="m120 151 20 9v30l-20-9z" fill="#D3E3D7"/>
    <path d="m213 150 19-9v16l-19 9zM240 137l16-8v16l-16 8z" fill="#D3E3D7"/>
    <path d="M282 47c-23 0-39 16-39 37 0 27 39 57 39 57s39-30 39-57c0-21-16-37-39-37Z" fill="#A53522"/>
    <path d="M275 43c-23 0-39 16-39 37 0 27 39 57 39 57s39-30 39-57c0-21-16-37-39-37Z" fill="#F08A5D"/>
    <circle cx="275" cy="80" r="14" fill="#FAF6EE"/><circle cx="275" cy="80" r="7" fill="#C8472B"/>
    <path d="m62 68 35-16 30 14-35 16z" fill="#FAF6EE" stroke="#B8CCBE"/><path d="m62 68 30 14v22L62 90z" fill="#D8E6DB"/><path d="m92 82 35-16v22l-35 16z" fill="#B7CDBE"/>
    <circle cx="87" cy="62" r="5" fill="#406A5C"/><circle cx="97" cy="58" r="4" fill="#406A5C"/><circle cx="108" cy="64" r="4" fill="#406A5C"/><path d="M87 71q10-15 20-2-9 12-20 2Z" fill="#406A5C"/>
  </svg>;
  return <svg className="dimensional-art workflow-art" viewBox="0 0 360 240" fill="none" aria-hidden="true">
    <ellipse cx="183" cy="209" rx="124" ry="15" fill="#1E1B4B" opacity=".08"/>
    <path d="m46 167 136-59 130 56-136 60z" fill="#CFC9EE"/>
    <path d="m46 156 136-59 130 56-136 60z" fill="#E9E6FB" stroke="#B9B0E4"/>
    <path d="m111 79 101-24 41 119-101 24z" fill="#C6BEE9"/>
    <path d="m105 72 101-24 41 119-101 24z" fill="#F6F3EE" stroke="#D6D0E6"/>
    <path d="m123 88 67-16M129 104l48-12" stroke="#C4BDDD" strokeWidth="5" strokeLinecap="round"/>
    {[0, 1, 2].map((row) => <g key={row} transform={`translate(${row * 6},${row * 22})`}><path d="m135 123 9-2 4 10-9 2z" fill={row <= step % 3 ? "#4B3FD6" : "#D6D0E6"}/><path d="m157 123 41-10" stroke={row <= step % 3 ? "#4B3FD6" : "#D6D0E6"} strokeWidth="4" strokeLinecap="round"/></g>)}
    <path d="m65 134 42-19 38 17-42 19z" fill="#FFCF50"/><path d="m65 134 38 17v31l-38-18z" fill="#E6A400"/><path d="m103 151 42-19v31l-42 19z" fill="#FFB800"/>
    <path d="m244 82 38-17 34 16-38 17z" fill="#8073E9"/><path d="m244 82 34 16v40l-34-16z" fill="#4B3FD6"/><path d="m278 98 38-17v40l-38 17z" fill="#332A9C"/>
    <path d="m258 47 10-15 6 14 17 4-13 10 1 17-13-10-16 5 5-16-10-12z" fill="#FFB800"/>
    <circle cx="67" cy="88" r="13" fill="#4B3FD6"/><path d="M57 81q4 15 21 14" stroke="#8073E9" strokeWidth="4"/>
  </svg>;
}
