import {describe,it,expect} from "vitest";
import {auditVisualReview,visualCaseNames,BASELINE,renderGallery} from "../../scripts/j16c-build-visual-review.mjs";
const SHA="a".repeat(40);
const fake=()=>({schema:"thiepn-japanese-j15d-d4-visual-comparison",schemaVersion:1,baselineCommit:BASELINE,candidateCommit:SHA,passed:true,cases:visualCaseNames().map(name=>({name,viewport:name.split("_")[0],theme:name.split("_")[1],surface:name.split("_").slice(2).join("_"),passed:true,changedPixelRatio:0}))});
const check=report=>auditVisualReview({report,expectedCommit:SHA,imageExists:()=>true});
describe("J16C 42-case visual artifact integrity",()=>{
 it("validates exact case matrix and 126 nonempty image references",()=>{
  const r=check(fake());expect(r.passed).toBe(true);expect(r.caseCount).toBe(42);expect(r.expectedImageCount).toBe(126);
 });
 it("rejects missing/duplicated cases and excess pixel drift",()=>{
  const x=fake();x.cases.pop();expect(check(x).passed).toBe(false);
  const y=fake();y.cases[0]=y.cases[1];expect(check(y).failures).toContain("DUPLICATE_CASE");
  const z=fake();z.cases[0].changedPixelRatio=.03;expect(check(z).failures.some(x=>x.startsWith("FAILED_CASE"))).toBe(true);
 });
 it("rejects missing PNG or wrong candidate identity",()=>{
  const x=fake(),a=auditVisualReview({report:x,expectedCommit:SHA,imageExists:n=>!n.endsWith("_diff.png")});expect(a.failures.filter(x=>x.startsWith("MISSING_IMAGE"))).toHaveLength(42);
  expect(auditVisualReview({report:x,expectedCommit:"b".repeat(40),imageExists:()=>true}).passed).toBe(false);
 });
 it("renders offline local reviewer UI and never auto-approves",()=>{
  const x=fake(),h=renderGallery({report:x,audit:check(x)});expect(h).toContain("J16C Visual Review");expect(h).toContain("draft_not_approved");expect(h).toContain('id="panels"');expect(h).not.toContain("https://cdn");
 });
});
