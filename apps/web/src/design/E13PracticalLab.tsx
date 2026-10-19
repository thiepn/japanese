import {useEffect,useMemo,useState} from "react";
import type {E06CaseProgress} from "../study/e06IndependentCourse";
import {
  E13_MODE_OPTIONS,
  eligibleE13Progress,
  type E13PracticeMode,
} from "../study/e13PracticalMixer";
import "../study/e13PracticalMixer.css";

interface Props{
  cases:readonly E06CaseProgress[];
  busy:boolean;
  onStart:(caseIds:readonly string[],mode:E13PracticeMode)=>void;
}

/**
 * Multiple real E11 source-qualified situations, one existing StudyPlayer.
 * Selection is local UI state only; original StudyEvents remain sole evidence.
 */
export function E13PracticalLab({cases,busy,onStart}:Props){
  const eligible=useMemo(()=>eligibleE13Progress(cases),[cases]);
  const [selected,setSelected]=useState<string[]>([]);
  const [mode,setMode]=useState<E13PracticeMode>("understand");
  const eligibleIds=eligible.map(c=>c.id).join("|");
  useEffect(()=>{
    const choices=new Set(eligibleIds.split("|").filter(Boolean));
    setSelected(previous=>{
      const kept=previous.filter(id=>choices.has(id)).slice(0,3);
      if(kept.length>=2)return kept;
      for(const c of eligible){
        if(kept.length>=2)break;
        if(!kept.includes(c.id))kept.push(c.id);
      }
      return kept;
    });
    // Source eligibility changes only as original learner evidence changes.
  },[eligibleIds]);

  const selectedCases=selected.filter(id=>eligible.some(c=>c.id===id));
  const ready=selectedCases.length>=2&&selectedCases.length<=3&&!busy;
  const modes=E13_MODE_OPTIONS;
  function toggle(id:string){
    setSelected(current=>current.includes(id)
      ?current.filter(value=>value!==id)
      :current.length<3?[...current,id]:current);
  }

  return <section className="e13-lab" aria-labelledby="e13-lab-title">
    <header className="e13-lab__heading">
      <div>
        
        <h2 id="e13-lab-title">Practice across different situations</h2>
        
      </div>
      <strong>{eligible.length} available</strong>
    </header>
    {eligible.length<2
      ?<p className="e13-lab__notice" role="status">Finish the original listening and reading questions in at least two A1/A2 source-linked situations first. Locked or unlinked Can-do material is not offered as graded practice.</p>
      :<>
        <p className="e13-lab__instruction">Choose 2–3 source-qualified situations. The suggested selection favors cases with fewer recorded optional E11 attempts.</p>
        <div className="e13-lab__cases" role="group" aria-label="Original situations for mixed practice">
          {eligible.map(c=><button key={c.id} type="button"
            className={"e13-lab__case"+(selectedCases.includes(c.id)?" is-selected":"")}
            aria-pressed={selectedCases.includes(c.id)}
            disabled={busy||(!selectedCases.includes(c.id)&&selectedCases.length>=3)}
            onClick={()=>toggle(c.id)}>
            <span className="e13-lab__case-title"><span aria-hidden="true">{selectedCases.includes(c.id)?"✓":"+"}</span><strong>{c.title}</strong></span>
            <span className="e13-lab__case-meta">{c.level} · {c.anchorCohort.toUpperCase()} · original Can-do linked</span>
            <span className="e13-lab__case-evidence">{[
              c.e11ListeningPractised?"listening attempted":"listening new",
              c.e11ReadingPractised?"reading attempted":"reading new",
              c.e11WritingSubmitted?"draft saved":"draft not submitted",
              c.e12RevisedWritingSubmitted?"revision saved":"revision not submitted",
            ].join(" · ")}</span>
          </button>)}
        </div>
        <div className="e13-lab__footer">
          <label htmlFor="e13-practice-mode">Your practice focus
            <select id="e13-practice-mode" value={mode} disabled={busy}
              onChange={e=>setMode(e.currentTarget.value as E13PracticeMode)}>
              {modes.map(item=><option value={item.id} key={item.id}>{item.label}</option>)}
            </select>
          </label>
          <p>{modes.find(item=>item.id===mode)?.description}</p>
          <button type="button" className="e13-lab__start" disabled={!ready}
            onClick={()=>onStart(selectedCases,mode)}>
            Start {selectedCases.length}-situation practice
          </button>
        </div>
        <p className="e13-lab__scope">Uses existing original E11 dialogues, device-synthesized listening, written notices and private E12 drafts. Optional answers do not change the authoritative FSRS schedule or certify speaking, writing or CEFR proficiency. Nothing is uploaded for this exercise.</p>
      </>}
  </section>;
}
