interface CodeSwitchProps {
  label: string;
  tab: "original" | "refactored";
  originalLabel: string;
  refactoredLabel: string;
  onChange: (tab: "original" | "refactored") => void;
}

export function CodeSwitch({ label, tab, originalLabel, refactoredLabel, onChange }: CodeSwitchProps) {
  const refactored = tab === "refactored";

  return (
    <button
      type="button"
      className={`code-switch${refactored ? " is-refactored" : ""}`}
      role="switch"
      aria-checked={refactored}
      aria-label={label}
      onClick={() => onChange(refactored ? "original" : "refactored")}
    >
      <span>{originalLabel}</span>
      <span>{refactoredLabel}</span>
    </button>
  );
}
