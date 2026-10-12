import { useState } from "react";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import { Segmented } from "./Segmented.tsx";

export type LayerImages = { rgb: string; gt: string; lidar: string };
export type SceneImages = { key: string; label: string; images: LayerImages; aspect: string };

const RIGHT_LAYERS = [
  { key: "lidar", label: "LiDAR elevation map" },
  { key: "gt", label: "Scan, coloured by height" },
] as const;

type RightKey = (typeof RIGHT_LAYERS)[number]["key"];

// The renders' own height colour ramp (turbo, 0-25 cm), so the legend matches the pixels.
const TURBO =
  "linear-gradient(to right, #30123b 0%, #4559cc 13%, #3d9efc 25%, #1ad9cc 38%, #59fa73 50%, #b8f736 63%, #fac72e 75%, #f56e14 88%, #ba1a05 100%)";

function Corner({ side, children }: { side: "left" | "right"; children: string }) {
  return (
    <span
      className={
        "pointer-events-none absolute top-3 rounded-md bg-black/60 px-2 py-1 text-xs text-white sm:text-sm " +
        (side === "left" ? "left-3" : "right-3")
      }
    >
      {children}
    </span>
  );
}

export function LayerSlider({ scenes }: { scenes: SceneImages[] }) {
  const [sceneKey, setSceneKey] = useState(scenes[0].key);
  const [right, setRight] = useState<RightKey>("lidar");
  const scene = scenes.find((s) => s.key === sceneKey) ?? scenes[0];
  const rightLabel = RIGHT_LAYERS.find((l) => l.key === right)?.label ?? "";

  return (
    <div className="not-prose flex flex-col gap-3">
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Segmented
          label="Scene"
          options={scenes.map((s) => ({ key: s.key, label: s.label }))}
          value={sceneKey}
          onChange={setSceneKey}
        />
        <Segmented label="Right side" options={RIGHT_LAYERS} value={right} onChange={setRight} />
      </div>
      <div className="relative overflow-hidden rounded-lg" style={{ aspectRatio: scene.aspect }}>
        <ReactCompareSlider
          className="h-full w-full"
          position={45}
          itemOne={<ReactCompareSliderImage src={scene.images.rgb} alt={`${scene.label}: RGB texture`} />}
          itemTwo={<ReactCompareSliderImage src={scene.images[right]} alt={`${scene.label}: ${rightLabel}`} />}
        />
        <Corner side="left">RGB — what the camera sees</Corner>
        <Corner side="right">{rightLabel}</Corner>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
        <span className="flex items-center gap-2">
          <span className="hazard-key hazard-visible" /> box — visible
        </span>
        <span className="flex items-center gap-2">
          <span className="hazard-key hazard-ambiguous" /> fallen bottle — ambiguous
        </span>
        <span className="flex items-center gap-2">
          <span className="hazard-key hazard-invisible" /> phone, spill — invisible
        </span>
        <span className="flex items-center gap-2">
          <span>height 0</span>
          <span className="inline-block h-2.5 w-28 rounded-sm" style={{ background: TURBO }} />
          <span>25 cm</span>
        </span>
      </div>
    </div>
  );
}
