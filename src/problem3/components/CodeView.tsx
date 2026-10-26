import { highlightLine, issuesForLine, sourceLines, type HighlightPart } from "../lib/highlight";

// color one source line: keywords, strings, numbers, and comments
function CodeText({ line }: { line: string }) {
  return highlightLine(line).map((part: HighlightPart, index: number) =>
    part.kind ? (
      <span key={index} className={`tok-${part.kind}`}>
        {part.text}
      </span>
    ) : (
      <span key={index}>{part.text}</span>
    ),
  );
}

interface CodeViewProps {
  source: string;
  marked?: boolean;
  activeIssue: number | null;
  focusedLine: number | null;
  onMark?: (issue: number, lineIndex: number) => void;
}

// one source line: its number, the issue marks, and the colored text
export function CodeView({ source, marked, activeIssue, focusedLine, onMark }: CodeViewProps) {
  return sourceLines(source).map((line: string, index: number) => {
    const issues = marked ? [...new Set(issuesForLine(line))] : [];
    const selected = activeIssue != null && issues.includes(activeIssue);
    const className = [
      "code-line",
      marked ? "" : "is-plain",
      issues.length ? "is-marked" : "",
      selected ? "is-active" : "",
      issues.length && activeIssue != null && !selected ? "is-dim" : "",
      index === focusedLine ? "is-current" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div key={index} className={className} data-line={index} data-issues={issues.join(" ")}>
        {/* line number */}
        <span className="line-no">{index + 1}</span>
        {/* issue numbers on this line */}
        {marked ? (
          <span className="marks">
            {issues.map((issue) => (
              <button
                key={issue}
                type="button"
                className={[
                  "mark",
                  issue === activeIssue && index === focusedLine ? "is-current" : "",
                  activeIssue != null && issue !== activeIssue ? "is-dim" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => onMark?.(issue, index)}
              >
                {issue}
              </button>
            ))}
          </span>
        ) : null}
        {/* colored source */}
        <span className="code-text">
          <CodeText line={line} />
        </span>
      </div>
    );
  });
}
