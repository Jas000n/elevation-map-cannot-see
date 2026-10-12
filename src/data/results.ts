// Numbers from the paper, mean ± std over five evaluation seeds.

export type Method = "ours" | "elev" | "oracle";
export type Stat = [mean: number, std: number];

export const METHODS: { key: Method; label: string }[] = [
  { key: "ours", label: "Ours" },
  { key: "elev", label: "Elevation-only" },
  { key: "oracle", label: "Oracle (GT maps)" },
];

export const CONDITIONS = ["Clean", "Perturbation 0.5×", "Perturbation 1.0×", "Perturbation 1.5×"] as const;
export const CONDITION_SHORT = ["Clean", "0.5×", "1.0×", "1.5×"] as const;
export const LEVELS = ["L1", "L2", "L3"] as const;

// Table V: simulated locomotion, all four terrain groups. [condition][level].
type LevelRow = { sr: Stat; progress: Stat; vte: Stat };
export const SIM_LOCOMOTION: Record<Method, LevelRow[][]> = {
  oracle: [
    [
      { sr: [99.0, 1.3], progress: [99.7, 0.4], vte: [0.103, 0.001] },
      { sr: [95.6, 4.0], progress: [98.2, 1.6], vte: [0.108, 0.002] },
      { sr: [95.0, 0.8], progress: [98.1, 0.6], vte: [0.113, 0.001] },
    ],
    [
      { sr: [100.0, 0.0], progress: [100.0, 0.0], vte: [0.105, 0.001] },
      { sr: [96.5, 1.1], progress: [98.1, 0.9], vte: [0.111, 0.001] },
      { sr: [91.2, 1.1], progress: [96.7, 0.5], vte: [0.117, 0.002] },
    ],
    [
      { sr: [98.8, 0.8], progress: [99.5, 0.3], vte: [0.116, 0.002] },
      { sr: [93.3, 0.8], progress: [97.3, 0.8], vte: [0.127, 0.003] },
      { sr: [86.2, 2.5], progress: [95.0, 1.6], vte: [0.132, 0.002] },
    ],
    [
      { sr: [91.0, 3.1], progress: [97.3, 1.4], vte: [0.144, 0.004] },
      { sr: [86.2, 2.6], progress: [94.6, 2.0], vte: [0.149, 0.005] },
      { sr: [79.8, 0.5], progress: [93.0, 0.8], vte: [0.156, 0.003] },
    ],
  ],
  elev: [
    [
      { sr: [47.9, 4.0], progress: [77.7, 2.3], vte: [0.137, 0.004] },
      { sr: [32.7, 5.3], progress: [68.7, 3.5], vte: [0.155, 0.006] },
      { sr: [25.2, 4.7], progress: [62.8, 3.2], vte: [0.168, 0.002] },
    ],
    [
      { sr: [49.2, 2.9], progress: [77.4, 2.7], vte: [0.144, 0.003] },
      { sr: [27.5, 3.4], progress: [66.5, 3.1], vte: [0.159, 0.003] },
      { sr: [18.8, 3.2], progress: [60.2, 2.3], vte: [0.174, 0.005] },
    ],
    [
      { sr: [40.6, 3.4], progress: [72.4, 2.8], vte: [0.167, 0.004] },
      { sr: [20.4, 4.1], progress: [59.6, 2.2], vte: [0.182, 0.004] },
      { sr: [16.0, 2.7], progress: [54.8, 1.2], vte: [0.199, 0.004] },
    ],
    [
      { sr: [31.5, 4.3], progress: [65.2, 3.1], vte: [0.203, 0.005] },
      { sr: [17.1, 3.6], progress: [54.9, 2.6], vte: [0.219, 0.006] },
      { sr: [9.0, 3.4], progress: [49.7, 1.6], vte: [0.231, 0.008] },
    ],
  ],
  ours: [
    [
      { sr: [71.5, 0.5], progress: [87.0, 0.6], vte: [0.14, 0.004] },
      { sr: [61.2, 2.6], progress: [79.4, 2.1], vte: [0.145, 0.002] },
      { sr: [51.0, 5.1], progress: [74.7, 3.9], vte: [0.157, 0.005] },
    ],
    [
      { sr: [70.4, 2.8], progress: [85.9, 1.9], vte: [0.145, 0.003] },
      { sr: [54.2, 5.0], progress: [76.5, 3.2], vte: [0.157, 0.002] },
      { sr: [47.1, 8.1], progress: [72.1, 4.7], vte: [0.166, 0.003] },
    ],
    [
      { sr: [61.2, 4.1], progress: [80.2, 2.4], vte: [0.166, 0.002] },
      { sr: [44.6, 4.0], progress: [70.0, 3.1], vte: [0.177, 0.002] },
      { sr: [33.3, 3.9], progress: [64.1, 2.6], vte: [0.185, 0.004] },
    ],
    [
      { sr: [46.9, 5.0], progress: [72.0, 2.2], vte: [0.201, 0.005] },
      { sr: [27.1, 3.7], progress: [60.5, 1.7], vte: [0.214, 0.005] },
      { sr: [22.7, 1.8], progress: [56.7, 1.9], vte: [0.22, 0.002] },
    ],
  ],
};

// Table VI: uneven ground, hazard contact rate by elevation visibility. [condition].
export const VISIBILITY = ["Visible", "Ambiguous", "Invisible"] as const;
type UnevenRow = { sr: Stat; hcr: [Stat, Stat, Stat]; fr: Stat };
export const UNEVEN: Record<Method, UnevenRow[]> = {
  oracle: [
    { sr: [93.6, 3.0], hcr: [[2.2, 3.1], [1.7, 2.7], [1.9, 2.1]], fr: [0.6, 0.7] },
    { sr: [92.2, 3.4], hcr: [[2.5, 3.1], [0.8, 0.7], [4.4, 2.0]], fr: [0.0, 0.0] },
    { sr: [86.9, 3.0], hcr: [[3.6, 4.0], [2.2, 1.1], [5.8, 2.2]], fr: [0.8, 1.1] },
    { sr: [72.8, 6.1], hcr: [[8.6, 4.8], [4.4, 2.4], [6.7, 3.7]], fr: [5.8, 2.7] },
  ],
  elev: [
    { sr: [9.4, 2.4], hcr: [[27.8, 7.7], [41.4, 13.2], [21.1, 11.6]], fr: [0.3, 0.6] },
    { sr: [12.5, 2.9], hcr: [[29.4, 9.6], [37.2, 7.6], [20.3, 5.5]], fr: [0.6, 0.7] },
    { sr: [9.7, 2.8], hcr: [[33.3, 7.6], [38.9, 8.0], [17.5, 4.7]], fr: [0.6, 0.7] },
    { sr: [6.7, 2.2], hcr: [[38.6, 9.2], [36.4, 9.4], [15.0, 3.4]], fr: [3.1, 1.4] },
  ],
  ours: [
    { sr: [50.6, 5.6], hcr: [[24.7, 6.5], [17.2, 5.8], [6.1, 4.7]], fr: [1.4, 1.2] },
    { sr: [52.8, 6.0], hcr: [[23.1, 3.4], [16.4, 5.9], [7.2, 1.8]], fr: [0.6, 0.7] },
    { sr: [44.2, 4.4], hcr: [[26.1, 2.7], [16.7, 4.1], [8.9, 3.1]], fr: [3.6, 2.3] },
    { sr: [28.1, 5.7], hcr: [[31.9, 5.6], [20.0, 5.9], [6.7, 1.6]], fr: [11.9, 2.7] },
  ],
};

/** Share of the Elevation-only -> Oracle hazard-contact gap that Ours closes (the paper's measure). */
export function gapClosed(condition: number, visibility: number): number {
  const elev = UNEVEN.elev[condition].hcr[visibility][0];
  const ours = UNEVEN.ours[condition].hcr[visibility][0];
  const oracle = UNEVEN.oracle[condition].hcr[visibility][0];
  return (elev - ours) / (elev - oracle);
}
