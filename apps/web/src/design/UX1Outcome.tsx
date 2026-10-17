import type {E02SceneProgress} from "../study/a1ExcellenceCourse";
/** Read-only result after an actual dashboard refresh; never produces language evidence. */
export function UX1Outcome({scene,pending,failed,returnLabel,onReturn}:{scene:E02SceneProgress|undefined;pending:boolean;failed:boolean;returnLabel:string;onReturn:()=>void}){
 const complete=Boolean(scene&&scene.requiredControlled>0&&scene.completedControlled>=scene.requiredControlled);
 return <section className="ux1-outcome" aria-labelledby="ux1-outcome-title">
  {pending?<p role="status">Checking saved café results…</p>:failed?<div role="alert"><h1 id="ux1-outcome-title">Results unavailable</h1><p>We couldn’t verify the saved café results. Return to your learning path and retry when local study data is available.</p></div>:<><p className="ux1-eyebrow">A1 · ORIGINAL CAFÉ LESSON</p><h1 id="ux1-outcome-title">{complete?"Café mission complete":"Café practice finished"}</h1><p>{complete?"The original controlled activities are complete. A changed café context will become available under the existing delayed-review rules.":"Some original controlled answers still need review. Finishing the study screens does not automatically complete the mission."}</p><div className="ux1-outcome__evidence"><strong>{scene?.completedControlled??0} / {scene?.requiredControlled??4}</strong><span>controlled prompts correct</span></div><p>Optional writing and recognized speech do not certify grammar quality, pronunciation or proficiency.</p></>}
  <button type="button" disabled={pending} onClick={onReturn}>{returnLabel}</button>
 </section>;
}
