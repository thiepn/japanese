import {describe,it,expect} from "vitest";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {coreContent} from "../../apps/web/src/coreContent";
const read=(name:string)=>JSON.parse(readFileSync(new URL("../../docs/furigana/"+name,import.meta.url),"utf8"));
const packet=read("f4-cases.json");
const submission=read("f4-review-submission.template.json");
const witness=read("f4-device-witness.template.json");
describe("F4 independent furigana review snapshot, fail-closed",()=>{
 it("binds original A1/A2 source digest to exact F3 candidate",()=>{
  const raw=readFileSync(new URL("../../content/seed/jp-core.json",import.meta.url));
  const digest=createHash("sha256").update(raw).digest("hex");
  expect(packet.source.sourceSHA256).toBe(digest);
  expect(packet.source.baseF3Commit).toBe("1aca20a88a4b12a4634f1d7dad150362927e597e");
 });
 it("covers every actual A1/A2 source sentence and grammar concept by ID, without inventing readings",()=>{
  const actual=[...coreContent.sentences.filter((s)=>s.level==="A1"||s.level==="A2").map((s)=>"sentence/"+s.id),
    ...coreContent.grammar.filter((g)=>g.level==="A1"||g.level==="A2").map((g)=>"grammar/"+g.id),
    ...coreContent.readingTexts.filter((r)=>r.level==="A2"||r.level==="A2-entry").map((r)=>"reader/"+r.id)];
  const caseMap=new Map(packet.cases.map((c:{id:string})=>[c.id,c]));
  expect(new Set(packet.cases.map((c:{id:string})=>c.id)).size).toBe(packet.cases.length);
  expect(packet.caseCounts).toEqual({sentences:161,grammar:66,readers:9,ambiguousLexemes:4,total:240});
  for(const id of actual)expect(caseMap.has(id)).toBe(true);
  for(const s of coreContent.sentences.filter((x)=>x.level==="A1"||x.level==="A2")){
    const item=caseMap.get("sentence/"+s.id) as {displayText:string;sourceReading:string|null;sourceTokens:{surface:string;reading:string|null}[]};
    expect(item.displayText).toBe(s.text);
    expect(item.sourceReading).toBe(s.reading??null);
    expect(item.sourceTokens).toEqual(s.tokens.map((t)=>({surface:t.surface,reading:t.reading??null,lexemeId:t.entityRef?.kind==="lexeme"?t.entityRef.id:null})));
  }
  for(const item of packet.cases.filter((c:{kind:string})=>c.kind==="sentence"&&c.level==="A2")){
    expect(item.sourceReading).toBeNull();
  }
 });
 it("provides real independent reviewer and physical witness blanks, no fabricated approval",()=>{
  expect(submission.candidateCommit).toBeNull();
  expect(submission.status).toBe("NOT_TESTED");
  expect(submission.reviewer.label).toBeNull();
  expect(submission.caseReviews).toHaveLength(240);
  for(const x of submission.caseReviews){expect(x.verdict).toBe("NOT_TESTED");expect(x.evidenceRefs).toEqual([])}
  expect(submission.reconciliation.releaseAuthorized).toBe(false);
  expect(witness.status).toBe("NOT_TESTED");
  expect(witness.candidateCommit).toBeNull();
  expect(witness.checks).toHaveLength(15);
  for(const x of witness.checks){expect(x.result).toBe("NOT_TESTED");expect(x.actualObservation).toBeNull()}
  expect(witness.summary.releaseAuthorized).toBe(false);
 });
});
