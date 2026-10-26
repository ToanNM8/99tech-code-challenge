import { useEffect, useMemo, useState, type FormEvent } from "react";
import fallbackPrices from "./prices.json";
import { SwapForm } from "./components/SwapForm";
import {
  PRICES_URL,
  amountError,
  convert,
  demoBalance,
  formatTokenAmount,
  latestPrices,
  sanitizeAmount,
  type PriceRow,
  type Receipt,
  type Token,
} from "./swap";
import "./swap.scss";

export function Problem2() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("ETH");
  const [to, setTo] = useState("USDC");
  const [amount, setAmount] = useState("1");
  const [openSide, setOpenSide] = useState<"from" | "to" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [phase, setPhase] = useState<"edit" | "submitting" | "done">("edit");
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    document.title = "Problem 2 · Swap";
  }, []);

  // load the live price feed, then fall back to the bundled file
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    async function load() {
      try {
        const response = await fetch(PRICES_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`Price feed returned ${response.status}`);
        const rows = (await response.json()) as PriceRow[];
        const next = latestPrices(rows);
        if (next.length < 2) throw new Error("Price feed did not include enough tokens.");
        setTokens(next);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        setTokens(latestPrices(fallbackPrices));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  const fromToken = tokens.find((token) => token.currency === from) ?? tokens[0];
  const toToken =
    tokens.find((token) => token.currency === to) ?? tokens.find((token) => token.currency !== fromToken?.currency);

  useEffect(() => {
    if (!fromToken || !toToken) return;
    if (!tokens.some((token) => token.currency === from)) setFrom(fromToken.currency);
    if (!tokens.some((token) => token.currency === to) || fromToken.currency === toToken.currency) {
      setTo(toToken.currency);
    }
  }, [tokens, from, to, fromToken, toToken]);

  const balance = fromToken ? demoBalance(fromToken.currency) : 0;
  const outputValue = fromToken && toToken ? convert(amount, fromToken.price, toToken.price) : null;
  const error =
    submitted || (amount.trim() !== "" && amount !== ".") ? amountError(amount, balance, fromToken?.currency ?? "") : "";
  const payUsd = fromToken && Number(amount) > 0 ? Number(amount) * fromToken.price : null;
  const receiveUsd = toToken && outputValue != null ? outputValue * toToken.price : null;
  const quotedAt = useMemo(() => {
    const latest = tokens
      .map((token) => token.date)
      .filter(Boolean)
      .sort()
      .at(-1);
    if (!latest) return "";
    return new Date(latest).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    });
  }, [tokens]);

  // clear the last quote when the inputs change
  function resetQuote() {
    setPhase("edit");
    setReceipt(null);
  }

  // pick a token and move the other side when the pair would match
  function choose(side: "from" | "to", currency: string) {
    if (!fromToken || !toToken) return;
    resetQuote();
    if (side === "from") {
      if (currency === toToken.currency) setTo(fromToken.currency);
      setFrom(currency);
      return;
    }
    if (currency === fromToken.currency) setFrom(toToken.currency);
    setTo(currency);
  }

  // keep a numeric amount and drop the previous quote
  function onAmount(value: string) {
    setAmount(sanitizeAmount(value));
    resetQuote();
  }

  // validate, then pretend the swap takes a moment
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fromToken || !toToken) return;
    setSubmitted(true);
    const message = amountError(amount, balance, fromToken.currency);
    if (message || outputValue == null) return;

    setPhase("submitting");
    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });
    setReceipt({
      pay: formatTokenAmount(Number(amount)),
      receive: formatTokenAmount(outputValue),
      from: fromToken.currency,
      to: toToken.currency,
    });
    setPhase("done");
  }

  return (
    <main className="sheet">
      <section className="card">
        {/* prices */}
        <header className="card-heading">
          <h1>Swap</h1>
          {loading ? <p>Loading token prices…</p> : <p>Exchange one token for another at {quotedAt} UTC.</p>}
          {!loading && tokens.length < 2 ? <p className="form-error">Token prices are unavailable.</p> : null}
        </header>

        {/* swap form */}
        {!loading && fromToken && toToken ? (
          <SwapForm
            tokens={tokens}
            fromToken={fromToken}
            toToken={toToken}
            amount={amount}
            balance={balance}
            outputValue={outputValue}
            payUsd={payUsd}
            receiveUsd={receiveUsd}
            error={error}
            phase={phase}
            receipt={receipt}
            openSide={openSide}
            onOpenSide={setOpenSide}
            onAmount={onAmount}
            onChoose={choose}
            onFlip={() => {
              setFrom(toToken.currency);
              setTo(fromToken.currency);
              resetQuote();
            }}
            onSubmit={onSubmit}
          />
        ) : null}
      </section>
    </main>
  );
}
