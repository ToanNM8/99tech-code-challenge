import type { FormEvent } from "react";
import { formatTokenAmount, type Receipt, type Token } from "../swap";
import { SwapField } from "./SwapField";
import { TokenSelect } from "./TokenSelect";

interface SwapFormProps {
  tokens: Token[];
  fromToken: Token;
  toToken: Token;
  amount: string;
  balance: number;
  outputValue: number | null;
  payUsd: number | null;
  receiveUsd: number | null;
  error: string;
  phase: "edit" | "submitting" | "done";
  receipt: Receipt | null;
  openSide: "from" | "to" | null;
  onOpenSide: (side: "from" | "to" | null) => void;
  onAmount: (value: string) => void;
  onChoose: (side: "from" | "to", currency: string) => void;
  onFlip: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function SwapForm({
  tokens,
  fromToken,
  toToken,
  amount,
  balance,
  outputValue,
  payUsd,
  receiveUsd,
  error,
  phase,
  receipt,
  openSide,
  onOpenSide,
  onAmount,
  onChoose,
  onFlip,
  onSubmit,
}: SwapFormProps) {
  return (
    <form onSubmit={onSubmit}>
      {/* you pay */}
      <SwapField
        label="You pay"
        inputId="swap-pay"
        amount={amount}
        usd={payUsd}
        invalid={Boolean(error)}
        errorId={error ? "swap-error" : undefined}
        onAmountChange={onAmount}
        aside={
          <span>
            Balance {formatTokenAmount(balance)}
            <button type="button" className="btn-text" onClick={() => onAmount(String(balance))}>
              Max
            </button>
          </span>
        }
      >
        <TokenSelect
          tokens={tokens}
          symbol={fromToken.currency}
          open={openSide === "from"}
          onOpen={() => onOpenSide("from")}
          onClose={() => onOpenSide(null)}
          onSelect={(currency) => onChoose("from", currency)}
        />
      </SwapField>

      {/* flip the pair */}
      <div className="swap-flip-wrap">
        <button type="button" className="swap-flip" aria-label="Switch pay and receive tokens" onClick={onFlip}>
          <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M5.2 1.5 2.3 5h1.9v5.2h2V5h1.9L5.2 1.5zm5.6 13L13.7 11h-1.9V5.8h-2V11H7.9l2.9 3.5z"
            />
          </svg>
        </button>
      </div>

      {/* you receive */}
      <SwapField
        label="You receive"
        amount={outputValue == null ? "0" : formatTokenAmount(outputValue)}
        empty={outputValue == null}
        usd={receiveUsd}
      >
        <TokenSelect
          tokens={tokens}
          symbol={toToken.currency}
          open={openSide === "to"}
          onOpen={() => onOpenSide("to")}
          onClose={() => onOpenSide(null)}
          onSelect={(currency) => onChoose("to", currency)}
        />
      </SwapField>

      {/* validation */}
      {error ? (
        <p id="swap-error" className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      {/* rate */}
      <p className="swap-rate">
        1 {fromToken.currency} = {formatTokenAmount(fromToken.price / toToken.price)} {toToken.currency}
      </p>

      {/* submit */}
      <button type="submit" className="btn-primary" disabled={phase === "submitting"}>
        {phase === "submitting" ? <span className="swap-spinner" aria-hidden="true" /> : null}
        {phase === "submitting" ? "Swapping…" : "Swap"}
      </button>

      {/* receipt */}
      {phase === "done" && receipt ? (
        <p className="swap-success" role="status">
          Swapped {receipt.pay} {receipt.from} for {receipt.receive} {receipt.to}.
        </p>
      ) : null}
    </form>
  );
}
