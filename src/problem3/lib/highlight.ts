const KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "return",
  "function",
  "if",
  "else",
  "interface",
  "type",
  "export",
  "import",
  "from",
  "switch",
  "case",
  "default",
  "declare",
  "extends",
  "new",
  "async",
  "await",
  "of",
  "in",
  "any",
  "readonly",
]);

const TOKEN =
  /\/\/.*$|\/\*[\s\S]*?\*\/|`(?:\\.|[^`])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|<\/?[A-Za-z][\w.]*|\b[A-Za-z_][\w]*\b/g;

export type TokenKind = "comment" | "string" | "number" | "tag" | "keyword" | "type";

export interface HighlightPart {
  text: string;
  kind?: TokenKind;
}

export interface Mark {
  issue: number;
  includes: string;
}

// drop a trailing blank line from a raw file
export function sourceLines(source: string): string[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  if (lines.at(-1) === "") lines.pop();
  return lines;
}

// split a line into keywords, strings, numbers, and comments
export function highlightLine(line: string): HighlightPart[] {
  const parts: HighlightPart[] = [];
  let last = 0;

  for (const match of line.matchAll(TOKEN)) {
    const start = match.index;
    if (start == null) continue;
    if (start > last) parts.push({ text: line.slice(last, start) });
    const text = match[0];
    let kind: TokenKind | "" = "";
    if (text.startsWith("//") || text.startsWith("/*")) kind = "comment";
    else if (text.startsWith('"') || text.startsWith("'") || text.startsWith("`")) kind = "string";
    else if (/^\d/.test(text)) kind = "number";
    else if (text.startsWith("<")) kind = "tag";
    else if (KEYWORDS.has(text)) kind = "keyword";
    else if (/^[A-Z]/.test(text)) kind = "type";
    parts.push(kind ? { text, kind } : { text });
    last = start + text.length;
  }

  if (last < line.length) parts.push({ text: line.slice(last) });
  return parts;
}

export const ORIGINAL_MARKS: Mark[] = [
  { issue: 1, includes: "interface WalletBalance" },
  { issue: 1, includes: "interface FormattedWalletBalance" },
  { issue: 1, includes: "balance.blockchain" },
  { issue: 2, includes: "extends BoxProps" },
  { issue: 2, includes: "children, ...rest" },
  { issue: 2, includes: "<div {...rest}>" },
  { issue: 3, includes: "React.FC" },
  { issue: 3, includes: "blockchain: any" },
  { issue: 4, includes: "useWalletBalances()" },
  { issue: 4, includes: "usePrices()" },
  { issue: 5, includes: "const getPriority" },
  { issue: 5, includes: "[balances, prices]" },
  { issue: 6, includes: "getPriority(balance.blockchain)" },
  { issue: 6, includes: "getPriority(lhs.blockchain)" },
  { issue: 6, includes: "getPriority(rhs.blockchain)" },
  { issue: 6, includes: "leftPriority > rightPriority" },
  { issue: 6, includes: "rightPriority > leftPriority" },
  { issue: 7, includes: "lhsPriority" },
  { issue: 8, includes: "balance.amount <= 0" },
  { issue: 9, includes: "formattedBalances" },
  { issue: 9, includes: "const rows = sortedBalances.map" },
  { issue: 9, includes: "formattedAmount" },
  { issue: 10, includes: "toFixed()" },
  { issue: 10, includes: "prices[balance.currency]" },
  { issue: 11, includes: "classes.row" },
  { issue: 12, includes: "key={index}" },
];

// issue numbers that match this source line
export function issuesForLine(line: string): number[] {
  return ORIGINAL_MARKS.filter((mark) => line.includes(mark.includes)).map((mark) => mark.issue);
}

// every line index where this issue appears
export function lineIndexesForIssue(source: string, issue: number): number[] {
  return sourceLines(source).flatMap((line, index) => (issuesForLine(line).includes(issue) ? [index] : []));
}
