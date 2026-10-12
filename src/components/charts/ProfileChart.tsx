import { useState, type PointerEvent } from "react";
import profiles from "../../data/real_profiles.json";

// Height across one object of each kind in the real scene: the handheld scan
// (ground truth, context in neutral ink) against the LiDAR elevation map the
// robot would get (the series the story is about, in the accent hue). The band
// is the map's own floor noise, ±2σ. Each panel has its own y-range, because a
// 15 cm box and a 1 cm phone do not fit one scale.

type Profile = (typeof profiles.objects)[number];

const W = 300;
const H = 200;
const M = { left: 30, right: 8, top: 12, bottom: 30 };
const PLOT_W = W - M.left - M.right;
const PLOT_H = H - M.top - M.bottom;
const Y_RANGE: Record<string, [number, number, number[]]> = {
  box: [-2, 17, [0, 5, 10, 15]],
  bottle: [-2, 8, [0, 2, 4, 6, 8]],
  phone: [-2, 3, [-2, -1, 0, 1, 2, 3]],
  spill: [-2, 3, [-2, -1, 0, 1, 2, 3]],
};

function Panel({ p, band }: { p: Profile; band: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const [y0, y1, ticks] = Y_RANGE[p.cls] ?? [-2, 17, [0, 5, 10, 15]];
  const xMin = p.s_cm[0];
  const xMax = p.s_cm[p.s_cm.length - 1];
  const x = (s: number) => M.left + ((s - xMin) / (xMax - xMin)) * PLOT_W;
  const y = (h: number) => M.top + PLOT_H * (1 - (Math.max(y0, Math.min(y1, h)) - y0) / (y1 - y0));
  const line = (values: number[]) => values.map((v, i) => `${i ? "L" : "M"}${x(p.s_cm[i]).toFixed(1)},${y(v).toFixed(1)}`).join("");

  const onMove = (event: PointerEvent<SVGRectElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const s = xMin + ((event.clientX - box.left) / box.width) * (xMax - xMin);
    let best = 0;
    p.s_cm.forEach((v, i) => {
      if (Math.abs(v - s) < Math.abs(p.s_cm[best] - s)) best = i;
    });
    setHover(best);
  };

  return (
    <figure className="my-0">
      <figcaption className="mb-1 flex items-baseline justify-between gap-2 text-sm">
        <span className="font-medium" style={{ color: "var(--viz-ink)" }}>
          {p.title}
        </span>
        <span style={{ color: "var(--viz-ink-2)", fontVariantNumeric: "tabular-nums" }}>
          peak {p.peak_scan_cm.toFixed(1)} / {p.peak_lidar_cm.toFixed(1)} cm
        </span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" role="img"
        aria-label={`${p.title}: peak over the object ${p.peak_scan_cm.toFixed(1)} cm in the scan, ${p.peak_lidar_cm.toFixed(1)} cm in the LiDAR map`}>
        {/* the object's footprint, along the x-axis */}
        <rect x={x(p.extent_cm[0])} y={M.top} width={x(p.extent_cm[1]) - x(p.extent_cm[0])} height={PLOT_H} fill="var(--viz-grid)" opacity={0.6} />
        <rect x={M.left} y={y(band)} width={PLOT_W} height={y(-band) - y(band)} fill="var(--viz-band)" />
        {ticks.map((t) => (
          <g key={t}>
            <line x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} stroke={t === 0 ? "var(--viz-axis)" : "var(--viz-grid)"} strokeWidth={1} />
            <text x={M.left - 5} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill="var(--viz-muted)" style={{ fontVariantNumeric: "tabular-nums" }}>
              {t}
            </text>
          </g>
        ))}
        {[-30, -15, 0, 15, 30].map((t) => (
          <text key={t} x={x(t)} y={H - M.bottom + 16} textAnchor="middle" fontSize={11} fill="var(--viz-muted)">
            {t}
          </text>
        ))}
        <text x={W - M.right} y={H - 2} textAnchor="end" fontSize={10.5} fill="var(--viz-muted)">
          across the object (cm)
        </text>
        <path d={line(p.scan_cm)} fill="none" stroke="var(--viz-ink-2)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        <path d={line(p.lidar_cm)} fill="none" stroke="var(--series-accent)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {hover !== null && (
          <g>
            <line x1={x(p.s_cm[hover])} x2={x(p.s_cm[hover])} y1={M.top} y2={M.top + PLOT_H} stroke="var(--viz-axis)" strokeWidth={1} />
            <circle cx={x(p.s_cm[hover])} cy={y(p.scan_cm[hover])} r={4} fill="var(--viz-ink-2)" stroke="var(--viz-surface)" strokeWidth={2} />
            <circle cx={x(p.s_cm[hover])} cy={y(p.lidar_cm[hover])} r={4} fill="var(--series-accent)" stroke="var(--viz-surface)" strokeWidth={2} />
          </g>
        )}
        <rect x={M.left} y={M.top} width={PLOT_W} height={PLOT_H} fill="transparent" onPointerMove={onMove} onPointerLeave={() => setHover(null)} />
      </svg>
      <div className="h-5 text-xs" style={{ color: "var(--viz-ink-2)", fontVariantNumeric: "tabular-nums" }} aria-live="polite">
        {hover !== null && (
          <>
            at {p.s_cm[hover].toFixed(0)} cm: scan <strong style={{ color: "var(--viz-ink)" }}>{p.scan_cm[hover].toFixed(1)}</strong> cm · map{" "}
            <strong style={{ color: "var(--viz-ink)" }}>{p.lidar_cm[hover].toFixed(1)}</strong> cm
          </>
        )}
      </div>
    </figure>
  );
}

export function ProfileChart() {
  return (
    <div className="viz-root not-prose flex flex-col gap-3">
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm" style={{ color: "var(--viz-ink-2)" }}>
        <span className="flex items-center gap-2">
          <span className="inline-block h-0.5 w-5 rounded" style={{ background: "var(--viz-ink-2)" }} /> Handheld scan (ground truth)
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-0.5 w-5 rounded" style={{ background: "var(--series-accent)" }} /> LiDAR elevation map
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-5 rounded-sm" style={{ background: "var(--viz-band)" }} /> map floor noise (±{profiles.floor_band_cm} cm, 2σ)
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-5 rounded-sm" style={{ background: "var(--viz-grid)" }} /> object footprint
        </span>
      </div>
      <div className="grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2 xl:grid-cols-4">
        {profiles.objects.map((p) => (
          <Panel key={p.cls} p={p} band={profiles.floor_band_cm} />
        ))}
      </div>
    </div>
  );
}
