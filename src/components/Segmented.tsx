// A pill-shaped single-choice control (scene, metric, layer pickers).
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { key: T; label: string }[];
  value: T;
  onChange: (key: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={label}>
      <span className="text-sm text-zinc-600 dark:text-zinc-400">{label}</span>
      <div className="inline-flex flex-wrap rounded-full bg-zinc-200 p-1 dark:bg-zinc-800">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            aria-pressed={option.key === value}
            onClick={() => onChange(option.key)}
            className={
              "rounded-full px-3 py-1 text-sm transition-colors " +
              (option.key === value
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-600 dark:text-white"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white")
            }
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
