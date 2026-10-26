import { highlightLine, issuesForLine, sourceLines } from "../lib/highlight";

function CodeText({ line }: { line: string }) {
  return highlightLine(line).map((part: { text: string; kind?: string }, index: number) =>
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

export function CodeView({ source, marked, activeIssue, focusedLine, onMark }: CodeViewProps) {
  return sourceLines(source).map((line: string, index: number) => {
    const issues = marked ? [...new Set(issuesForLine(line) as number[])] : [];
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
        <span className="line-no">{index + 1}</span>
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
        <span className="code-text">
          <CodeText line={line} />
        </span>
      </div>
    );
  });
}
