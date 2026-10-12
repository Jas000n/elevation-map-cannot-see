import { CONDITIONS, METHODS, UNEVEN, VISIBILITY, gapClosed, type Method } from "../../data/results.ts";
import { FacetedColumns, Legend, type Facet } from "./FacetedColumns.tsx";

const ORDER: Method[] = ["ours", "elev", "oracle"];

export function HazardContactChart() {
  const facets: Facet[] = CONDITIONS.map((title, c) => ({
    title,
    groups: VISIBILITY.map((label, v) => ({
      label,
      note: `${Math.round(100 * gapClosed(c, v))}% closed`,
      bars: ORDER.map((method) => {
        const [mean, std] = UNEVEN[method][c].hcr[v];
        return { method, mean, std };
      }),
    })),
  }));

  return (
    <div className="viz-root not-prose flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm" style={{ color: "var(--viz-ink-2)" }}>
          Hazard contact rate on uneven ground (%, lower is better)
        </span>
        <Legend methods={ORDER} />
      </div>
      <FacetedColumns
        facets={facets}
        yMax={55}
        ticks={[0, 10, 20, 30, 40, 50]}
        unit="%"
        describe={(facet, group) => `${group.label.toLowerCase()} hazards · ${facet.title}`}
      />
      <details className="text-sm" style={{ color: "var(--viz-ink-2)" }}>
        <summary className="cursor-pointer">Table view (success rate, hazard contact by visibility, fall rate)</summary>
        <div className="overflow-x-auto">
          <table className="mt-2 w-full text-left" style={{ fontVariantNumeric: "tabular-nums" }}>
            <thead>
              <tr>
                <th className="py-1 pr-3">Condition</th>
                <th className="py-1 pr-3">Method</th>
                <th className="py-1 pr-3">SR ↑</th>
                {VISIBILITY.map((v) => (
                  <th key={v} className="py-1 pr-3">
                    HCR {v.toLowerCase()} ↓
                  </th>
                ))}
                <th className="py-1 pr-3">FR ↓</th>
              </tr>
            </thead>
            <tbody>
              {CONDITIONS.map((condition, c) =>
                METHODS.map(({ key, label }, m) => {
                  const row = UNEVEN[key][c];
                  const cell = ([mean, std]: [number, number]) => `${mean.toFixed(1)} ± ${std.toFixed(1)}`;
                  return (
                    <tr key={condition + key} className="border-t" style={{ borderColor: "var(--viz-grid)" }}>
                      <td className="py-1 pr-3">{m === 0 ? condition : ""}</td>
                      <td className="py-1 pr-3">{label}</td>
                      <td className="py-1 pr-3 whitespace-nowrap">{cell(row.sr)}</td>
                      {row.hcr.map((h, i) => (
                        <td key={i} className="py-1 pr-3 whitespace-nowrap">
                          {cell(h)}
                        </td>
                      ))}
                      <td className="py-1 pr-3 whitespace-nowrap">{cell(row.fr)}</td>
                    </tr>
                  );
                }),
              )}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
