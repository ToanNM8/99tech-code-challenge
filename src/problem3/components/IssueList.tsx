interface IssueCopy {
  title: string;
  problem: string;
  fix: string;
}

interface IssueListProps {
  issues: IssueCopy[];
  activeIssue: number | null;
  label: string;
  lead: string;
  onSelect: (number: number) => void;
}

export function IssueList({ issues, activeIssue, label, lead, onSelect }: IssueListProps) {
  return (
    <div className="issues-scroll" tabIndex={0} aria-label={label}>
      <p className="lead">{lead}</p>
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
              <h2>{issue.title}</h2>
              <p>{issue.problem}</p>
              <p>{issue.fix}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
