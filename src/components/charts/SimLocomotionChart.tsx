import { useState } from "react";
import { CONDITIONS, LEVELS, METHODS, SIM_LOCOMOTION, type Method } from "../../data/results.ts";
import { Segmented } from "../Segmented.tsx";
import { FacetedColumns, Legend, type Facet } from "./FacetedColumns.tsx";

type Metric = "sr" | "progress";
const METRICS = [
  { key: "sr", label: "Success rate" },
  { key: "progress", label: "Progress" },
] as const;

const ORDER: Method[] = ["ours", "elev", "oracle"];

export function SimLocomotionChart() {
  const [metric, setMetric] = useState<Metric>("sr");
  const facets: Facet[] = CONDITIONS.map((title, c) => ({
    title,
    groups: LEVELS.map((level, l) => ({
      label: level,
      bars: ORDER.map((method) => {
        const [mean, std] = SIM_LOCOMOTION[method][c][l][metric];
        return { method, mean, std };
      }),
    })),
  }));
  const metricLabel = METRICS.find((m) => m.key === metric)?.label ?? "";

  return (
    <div className="viz-root not-prose flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented label="Metric" options={METRICS} value={metric} onChange={setMetric} />
        <Legend methods={ORDER} />
      </div>
      <FacetedColumns
        facets={facets}
        yMax={100}
        ticks={[0, 25, 50, 75, 100]}
        unit="%"
        labelMethod="ours"
        describe={(facet, group) => `${group.label} · ${facet.title} · ${metricLabel.toLowerCase()}`}
      />
      <details className="text-sm" style={{ color: "var(--viz-ink-2)" }}>
        <summary className="cursor-pointer">Table view (success rate / progress / velocity-tracking error)</summary>
        <div className="overflow-x-auto">
          <table className="mt-2 w-full text-left" style={{ fontVariantNumeric: "tabular-nums" }}>
            <thead>
              <tr>
                <th className="py-1 pr-3">Method</th>
                <th className="py-1 pr-3">Level</th>
                {CONDITIONS.map((c) => (
                  <th key={c} className="py-1 pr-3">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METHODS.map(({ key, label }) =>
                LEVELS.map((level, l) => (
                  <tr key={key + level} className="border-t" style={{ borderColor: "var(--viz-grid)" }}>
                    <td className="py-1 pr-3">{l === 0 ? label : ""}</td>
                    <td className="py-1 pr-3">{level}</td>
                    {CONDITIONS.map((c, ci) => {
                      const row = SIM_LOCOMOTION[key][ci][l];
                      return (
                        <td key={c} className="py-1 pr-3 whitespace-nowrap">
                          {row.sr[0].toFixed(1)} / {row.progress[0].toFixed(1)} / {row.vte[0].toFixed(3)}
                        </td>
                      );
                    })}
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
