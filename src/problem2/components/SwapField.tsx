import type { ReactNode } from "react";
import { formatUsd } from "../lib/swap";

interface SwapFieldProps {
  label: string;
  inputId?: string;
  amount: string;
  empty?: boolean;
  usd: number | null;
  invalid?: boolean;
  errorId?: string;
  onAmountChange?: (value: string) => void;
  aside?: ReactNode;
  children?: ReactNode;
}

export function SwapField({
  label,
  inputId,
  amount,
  empty,
  usd,
  invalid,
  errorId,
  onAmountChange,
  aside,
  children,
}: SwapFieldProps) {
  return (
    <div className={`field ${invalid ? "invalid" : ""}`}>
      {/* label */}
      <div className="field-label">
        {inputId ? <label htmlFor={inputId}>{label}</label> : <span>{label}</span>}
        {aside}
      </div>
      {/* amount, editable only on the pay side */}
      <div className="swap-amount">
        {onAmountChange ? (
          <input
            id={inputId}
            className="amount"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0"
            value={amount}
            aria-invalid={Boolean(invalid)}
            aria-describedby={errorId}
            onChange={(event) => onAmountChange(event.target.value)}
          />
        ) : (
          <p className={`amount ${empty ? "is-empty" : ""}`}>{amount}</p>
        )}
        {children}
      </div>
      {/* usd value */}
      <p className="swap-usd">{usd == null ? "\u00a0" : `≈ ${formatUsd(usd)}`}</p>
    </div>
  );
}
