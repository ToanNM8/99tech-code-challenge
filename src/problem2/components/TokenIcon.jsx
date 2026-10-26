import { useState } from "react";

const ICON_BASE = "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens";

export function TokenIcon({ symbol }) {
  const sources = [...new Set([symbol, symbol.toUpperCase()])].map(
    (name) => `${ICON_BASE}/${name}.svg`,
  );
  const [index, setIndex] = useState(0);

  if (index >= sources.length) {
    return (
      <span className="token-fallback" aria-hidden="true">
        {symbol.slice(0, 1).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={sources[index]}
      alt=""
      width="28"
      height="28"
      onError={() => setIndex((value) => value + 1)}
    />
  );
}
