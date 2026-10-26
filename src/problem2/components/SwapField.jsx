import { formatUsd } from "../swap";

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
}) {
  return (
    <div className={`field ${invalid ? "invalid" : ""}`}>
      <div className="field-label">
        {inputId ? <label htmlFor={inputId}>{label}</label> : <span>{label}</span>}
        {aside}
      </div>
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
      <p className="swap-usd">{usd == null ? "\u00a0" : `≈ ${formatUsd(usd)}`}</p>
    </div>
  );
}
