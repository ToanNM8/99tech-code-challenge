import type { IssueCopy } from "../lib/language";

interface IssueListProps {
  issues: IssueCopy[];
  counts: number[];
  activeIssue: number | null;
  label: string;
  lead: string;
  onSelect: (number: number) => void;
}

// issues in source order, with how many lines share each one
export function IssueList({ issues, counts, activeIssue, label, lead, onSelect }: IssueListProps) {
  return (
    <div className="issues-scroll" tabIndex={0} aria-label={label}>
      {/* intro */}
      <p className="lead">{lead}</p>
      {/* issue cards */}
      <ul className="issues">
        {issues.map((issue, index) => {
          const number = index + 1;
          return (
            <li
              key={issue.title}
              id={`issue-${number}`}
              className={activeIssue === number ? "is-active" : undefined}
              data-issue={number}
              onClick={() => onSelect(number)}
            >
              <h2>
                {issue.title} <span className="issue-count">({counts[index]})</span>
              </h2>
              <p>{issue.problem}</p>
              <p>{issue.fix}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
