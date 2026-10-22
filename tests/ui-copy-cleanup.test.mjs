import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";

const design=(name)=>readFileSync(new URL("../apps/web/src/design/"+name,import.meta.url),"utf8");
const main=()=>readFileSync(new URL("../apps/web/src/main.tsx",import.meta.url),"utf8");
const study=(name)=>readFileSync(new URL("../apps/web/src/study/"+name,import.meta.url),"utf8");
const immerse=(name)=>readFileSync(new URL("../apps/web/src/immerse/"+name,import.meta.url),"utf8");

describe("Japanese functional UI copy",()=>{
  it("removes decorative section kickers and repeated commentary from main learner surfaces",()=>{
    for(const name of ["J3Today.tsx","J4Learn.tsx","J6Immersion.tsx","J7Library.tsx","J8Progress.tsx"]){
      const source=design(name);
      expect(source).not.toContain("Move through one continuous path from script foundations");
      expect(source).not.toContain("The landscape stays readable by default");
      expect(source).not.toContain("Enter Japanese,<br/><em>not another lesson.");
    }
    expect(design("UX1Today.tsx")).not.toContain("One useful step at a time.");
    expect(design("J2AppShell.tsx")).not.toContain("study · immerse · grow");
    expect(design("J11Diagnostics.tsx")).not.toContain("Technical concerns stay technical</h2><p>");
  });
  it("keeps actionable states, recovery cautions, learner evidence and labels",()=>{
    const account=design("J2AppShell.tsx");
    expect(account).toContain("Backups include private study content and audio.");
    expect(account).toContain("Close Account panel");
    expect(account).toContain("Sign in with THIEPN Account");
    const today=design("UX1Today.tsx");
    expect(today).toContain("No study items are scheduled.");
    expect(today).toContain("The activity could not be opened.");
    const learn=design("J4Learn.tsx");
    expect(learn).toContain("No steps are available for that activity yet.");
    const reader=design("J6Immersion.tsx");
    expect(reader).toContain("device Japanese speech synthesis");
    expect(reader).toContain("{feedback.explanation}");
    expect(design("E20SourceOnlyA2.tsx")).toContain("saves <strong>nothing inside the app</strong>");
  });
  it("removes repeated advanced introductions without removing grading, rights or recovery disclosures",()=>{
    const source=immerse("C1EnvironmentLab.tsx");
    expect(source).not.toContain("This workspace uses external Japanese sources in their original context");
    expect(source).toContain("Every mapped source must appear at least once");
    const bibliography=immerse("C1ResearchQualityLab.tsx");
    expect(bibliography).toContain("External pages are not scraped or republished.");
    const portfolios=study("C1Portfolio.tsx");
    expect(portfolios).not.toContain("This portfolio consolidates advanced autonomy");
    expect(portfolios).toContain("Human review is external qualitative evidence only.");
    expect(study("C2ReadinessPanel.tsx")).toContain("It is not an accredited CEFR C2 certificate.");
    expect(study("ReleaseOperationsPanel.tsx")).toContain("physical-device gate.");
    expect(study("StudyPlayer.tsx")).toContain("Optional. Stored locally, unencrypted");
    expect(design("E20SourceOnlyA2.tsx")).toContain("Step {phaseIndex+1} of {E20_STAGES.length} · Unscored");
  });
  it("preserves readable supporting typography without hiding content",()=>{
    const css=readFileSync(new URL("../apps/web/src/design/ui-copy.css",import.meta.url),"utf8");
    expect(css).toContain("font-size: 14px !important");
    expect(css).not.toMatch(/display:\s*none/);
    expect(main()).toContain('import "./design/ui-copy.css";');
  });
});
