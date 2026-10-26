import { useEffect, useId, useRef, useState } from "react";
import { formatUsd } from "../swap";
import { TokenIcon } from "./TokenIcon";

export function TokenSelect({ tokens, symbol, open, onOpen, onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const searchRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const listId = useId();
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    setQuery("");
    searchRef.current?.focus();

    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) onCloseRef.current();
    }
    function onKeyDown(event) {
      if (event.key === "Escape") onCloseRef.current();
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const filtered = tokens.filter((token) =>
    token.currency.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="token-select" ref={rootRef}>
      <button
        type="button"
        className="token-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => (open ? onClose() : onOpen())}
      >
        <TokenIcon key={symbol} symbol={symbol} />
        <span>{symbol}</span>
        <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
          <path
            d="M2.2 4.2 6 8l3.8-3.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {open ? (
        <div className="token-menu">
          <input
            ref={searchRef}
            className="token-search"
            value={query}
            placeholder="Search token"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.preventDefault();
            }}
          />
          <ul id={listId} role="listbox" aria-label="Tokens">
            {filtered.length === 0 ? <li className="token-empty">No tokens match.</li> : null}
            {filtered.map((token) => (
              <li key={token.currency}>
                <button
                  type="button"
                  role="option"
                  aria-selected={token.currency === symbol}
                  onClick={() => {
                    onSelect(token.currency);
                    onClose();
                  }}
                >
                  <TokenIcon symbol={token.currency} />
                  <span>{token.currency}</span>
                  <span className="token-price">{formatUsd(token.price)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
