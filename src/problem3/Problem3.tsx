import { useEffect, useRef, useState } from "react";
import source from "./lib/refactored.txt?raw";
import originalSource from "./lib/original.txt?raw";
import { LANGUAGE } from "./lib/language";
import { CodeSwitch } from "./components/CodeSwitch";
import { CodeView } from "./components/CodeView";
import { IssueList } from "./components/IssueList";
import { lineIndexesForIssue } from "./lib/highlight";
import "./problem3.scss";

interface Focus {
  issue: number;
  line: number;
  tick: number;
}

// replay the highlight animation on a card or a code line
function flash(element: Element | null) {
  if (!(element instanceof HTMLElement)) return;
  element.classList.remove("is-pulse");
  void element.offsetWidth;
  element.classList.add("is-pulse");
}

// issue list beside the original and refactored source
export function Problem3() {
  const [lang, setLang] = useState<"en" | "vi">("en");
  const [tab, setTab] = useState<"original" | "refactored">("original");
  const [focus, setFocus] = useState<Focus | null>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const text = LANGUAGE[lang];

  // keep the document language in sync with the switch
  useEffect(() => {
    document.title = "Problem 3 · Messy React";
    document.documentElement.lang = lang === "vi" ? "vi" : "en";
    return () => {
      document.documentElement.lang = "en";
    };
  }, [lang]);

  // scroll the selected line into view and flash it
  useEffect(() => {
    if (focus == null) return;
    flash(document.getElementById(`issue-${focus.issue}`));
    if (tab !== "original") return;
    const line = codeRef.current?.querySelector(`[data-line="${focus.line}"]`);
    if (!line) return;
    line.scrollIntoView({ block: "center", behavior: "smooth" });
    flash(line);
  }, [tab, focus]);

  // open an issue, or move to the next line that has the same issue
  function openIssue(number: number, lineIndex?: number) {
    const matches = lineIndexesForIssue(originalSource, number);
    if (!matches.length) return;
    setTab("original");
    setFocus((current) => {
      if (lineIndex != null && matches.includes(lineIndex)) {
        return { issue: number, line: lineIndex, tick: (current?.tick ?? 0) + 1 };
      }
      if (current?.issue === number) {
        const at = matches.indexOf(current.line);
        return { issue: number, line: matches[(at + 1) % matches.length], tick: current.tick + 1 };
      }
      return { issue: number, line: matches[0], tick: (current?.tick ?? 0) + 1 };
    });
    document.getElementById(`issue-${number}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  return (
    <main className="review">
      <div className="review-columns">
        {/* title and language switch */}
        <div className="pane-heading">
          <h1>{text.title}</h1>
          <button
            type="button"
            className={`lang-switch${lang === "vi" ? " is-vn" : ""}`}
            role="switch"
            aria-checked={lang === "vi"}
            aria-label={text.language}
            onClick={() => setLang((current) => (current === "en" ? "vi" : "en"))}
          >
            <span>EN</span>
            <span>VN</span>
          </button>
        </div>
        {/* original / refactored switch */}
        <CodeSwitch
          label={text.codeLabel}
          tab={tab}
          originalLabel={text.originalTab}
          refactoredLabel={text.refactoredTab}
          onChange={setTab}
        />
        {/* issue list */}
        <IssueList
          issues={text.issues}
          counts={text.issues.map((_, index) => lineIndexesForIssue(originalSource, index + 1).length)}
          activeIssue={focus?.issue ?? null}
          label={text.issuesLabel}
          lead={text.lead}
          onSelect={openIssue}
        />
        {/* code panel */}
        <div
          ref={codeRef}
          className="code-scroll"
          tabIndex={0}
          role="tabpanel"
          aria-label={tab === "original" ? text.originalTab : text.refactoredTab}
        >
          {tab === "original" ? (
            <CodeView
              source={originalSource}
              marked
              activeIssue={focus?.issue ?? null}
              focusedLine={focus?.line ?? null}
              onMark={openIssue}
            />
          ) : (
            <CodeView source={source} activeIssue={null} focusedLine={null} />
          )}
        </div>
      </div>
    </main>
  );
}
