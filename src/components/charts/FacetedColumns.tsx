import { useRef, useState, type FocusEvent, type PointerEvent } from "react";
import type { Method } from "../../data/results.ts";

// Small multiples of grouped columns with ± std whiskers. One y-scale shared by
// every facet; marks follow the dataviz spec (<=24 px columns, 4 px rounded
// data-end, 2 px surface gap, hairline grid, recessive axes).

export type Bar = { method: Method; mean: number; std: number };
export type Group = { label: string; bars: Bar[]; note?: string };
export type Facet = { title: string; groups: Group[] };

const W = 300;
const H = 236;
const M = { left: 34, right: 6, top: 24, bottom: 48 };
const PLOT_W = W - M.left - M.right;
const PLOT_H = H - M.top - M.bottom;

export const METHOD_LABEL: Record<Method, string> = {
  ours: "Ours",
  elev: "Elevation-only",
  oracle: "Oracle (GT maps)",
};

export function Legend({ methods }: { methods: Method[] }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm" style={{ color: "var(--viz-ink-2)" }}>
      {methods.map((m) => (
        <span key={m} className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-[3px]" style={{ background: `var(--series-${m})` }} />
          {METHOD_LABEL[m]}
        </span>
      ))}
    </div>
  );
}

function columnPath(x: number, y: number, w: number, h: number) {
  const r = Math.min(4, w / 2, h);
  const base = y + h;
  return `M${x},${base} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${base} Z`;
}

type Hover = { left: number; top: number; title: string; value: string };

export function FacetedColumns({
  facets,
  yMax,
  ticks,
  unit,
  labelMethod,
  describe,
}: {
  facets: Facet[];
  yMax: number;
  ticks: number[];
  unit: string;
  labelMethod?: Method; // the one series whose values are printed on the marks
  describe: (facet: Facet, group: Group, bar: Bar) => string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<Hover | null>(null);
  const y = (v: number) => M.top + PLOT_H * (1 - Math.min(v, yMax) / yMax);
  const fmt = (v: number) => v.toFixed(1);

  const show = (event: PointerEvent<SVGGElement> | FocusEvent<SVGGElement>, title: string, value: string) => {
    const box = root.current?.getBoundingClientRect();
    const mark = event.currentTarget.getBoundingClientRect();
    if (!box) return;
    // keep the tooltip (about 200 px wide, centred on the mark) inside the chart at the edges
    const centre = mark.left + mark.width / 2 - box.left;
    const left = Math.min(Math.max(centre, 110), Math.max(110, box.width - 110));
    setHover({ left, top: mark.top - box.top, title, value });
  };

  return (
    <div ref={root} className="relative grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 xl:grid-cols-4">
      {facets.map((facet) => {
        const band = PLOT_W / facet.groups.length;
        return (
          <figure key={facet.title} className="my-0">
            <figcaption className="mb-1 text-center text-sm font-medium" style={{ color: "var(--viz-ink)" }}>
              {facet.title}
            </figcaption>
            <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" role="img" aria-label={facet.title}>
              {ticks.map((t) => (
                <g key={t}>
                  <line x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} stroke={t === 0 ? "var(--viz-axis)" : "var(--viz-grid)"} strokeWidth={1} />
                  <text x={M.left - 6} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill="var(--viz-muted)" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {t}
                  </text>
                </g>
              ))}
              {facet.groups.map((group, gi) => {
                const n = group.bars.length;
                const barW = Math.min(22, (band - 18) / n - 2);
                const x0 = M.left + gi * band + (band - (n * barW + (n - 1) * 2)) / 2;
                return (
                  <g key={group.label}>
                    {group.bars.map((bar, bi) => {
                      const x = x0 + bi * (barW + 2);
                      const top = y(bar.mean);
                      const cx = x + barW / 2;
                      const title = `${METHOD_LABEL[bar.method]} · ${describe(facet, group, bar)}`;
                      const value = `${fmt(bar.mean)} ± ${fmt(bar.std)}${unit}`;
                      return (
                        <g
                          key={bar.method}
                          tabIndex={0}
                          role="img"
                          aria-label={`${title}: ${value}`}
                          className="cursor-default outline-none [&:focus-visible>path]:opacity-80 [&:hover>path]:opacity-80"
                          onPointerEnter={(e) => show(e, title, value)}
                          onPointerLeave={() => setHover(null)}
                          onFocus={(e) => show(e, title, value)}
                          onBlur={() => setHover(null)}
                        >
                          {/* hit target: the full column slot, wider than the mark */}
                          <rect x={x - 1} y={M.top} width={barW + 2} height={PLOT_H} fill="transparent" />
                          <path d={columnPath(x, top, barW, y(0) - top)} fill={`var(--series-${bar.method})`} />
                          {bar.std > 0 && (
                            <g stroke="var(--viz-ink-2)" strokeWidth={1}>
                              <line x1={cx} x2={cx} y1={y(bar.mean - bar.std)} y2={y(bar.mean + bar.std)} />
                              <line x1={cx - 3} x2={cx + 3} y1={y(bar.mean + bar.std)} y2={y(bar.mean + bar.std)} />
                            </g>
                          )}
                          {labelMethod === bar.method && (
                            <text x={cx} y={y(bar.mean + bar.std) - 5} textAnchor="middle" fontSize={10.5} fontWeight={600} fill="var(--viz-ink)">
                              {fmt(bar.mean)}
                            </text>
                          )}
                        </g>
                      );
                    })}
                    <text x={M.left + gi * band + band / 2} y={y(0) + 16} textAnchor="middle" fontSize={12} fill="var(--viz-ink-2)">
                      {group.label}
                    </text>
                    {group.note && (
                      <text x={M.left + gi * band + band / 2} y={y(0) + 33} textAnchor="middle" fontSize={10.5} fill="var(--viz-muted)">
                        {group.note}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </figure>
        );
      })}
      {hover && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md px-2.5 py-1.5 text-sm shadow-md"
          style={{ left: hover.left, top: hover.top - 6, background: "var(--viz-tooltip)", border: "1px solid var(--viz-ring)" }}
        >
          <div className="font-semibold whitespace-nowrap" style={{ color: "var(--viz-ink)", fontVariantNumeric: "tabular-nums" }}>
            {hover.value}
          </div>
          <div className="whitespace-nowrap" style={{ color: "var(--viz-ink-2)" }}>
            {hover.title}
          </div>
        </div>
      )}
    </div>
  );
}
