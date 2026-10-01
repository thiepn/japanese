import { useRef, useState } from "react";
import type { StudyPrompt, GradeResult } from "@thiepn/study-player";
import { gradeStudyPrompt } from "@thiepn/study-player";

export interface StudyAnswer { prompt: StudyPrompt; response: string; grade: GradeResult; responseTimeMs: number; }

export function StudyPlayer({ prompts, onAnswer, onComplete, onExit }: {
  prompts: StudyPrompt[];
  onAnswer: (answer: StudyAnswer) => Promise<void> | void;
  onComplete: () => void;
  onExit: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState("");
  const [feedback, setFeedback] = useState<GradeResult | null>(null);
  const [saving, setSaving] = useState(false);
  const startedAt = useRef(performance.now());
  const prompt = prompts[index];

  if (!prompt) return null;

  async function submit(value = response) {
    if (!value.trim() || feedback || saving) return;
    const grade = gradeStudyPrompt(prompt, value);
    setSaving(true);
    try {
      await onAnswer({ prompt, response: value, grade, responseTimeMs: Math.max(0, Math.round(performance.now() - startedAt.current)) });
      setResponse(value);
      setFeedback(grade);
    } finally { setSaving(false); }
  }

  function next() {
    if (index + 1 >= prompts.length) { onComplete(); return; }
    setIndex((value) => value + 1);
    setResponse("");
    setFeedback(null);
    startedAt.current = performance.now();
  }

  return <section className="study-player" aria-live="polite">
    <header className="study-head"><button className="quiet-button" type="button" onClick={onExit}>Exit</button><span>{index + 1} / {prompts.length}</span></header>
    <div className="study-progress"><span style={{ width: `${((index + (feedback ? 1 : 0)) / prompts.length) * 100}%` }} /></div>
    <div className="study-card">
      <p className="eyebrow">{prompt.instruction.toUpperCase()}</p>
      <div className="study-prompt" lang={prompt.promptLanguage}>{prompt.prompt}</div>
      {prompt.promptType === "choice" ? <div className="study-choices">{prompt.choices.map((choice) => <button disabled={Boolean(feedback) || saving} type="button" key={choice} onClick={() => void submit(choice)}>{choice}</button>)}</div> : <form onSubmit={(event) => { event.preventDefault(); void submit(); }}><input autoFocus disabled={Boolean(feedback) || saving} value={response} onChange={(event) => setResponse(event.target.value)} placeholder={prompt.placeholder} /><button className="primary" disabled={!response.trim() || Boolean(feedback) || saving} type="submit">Check</button></form>}
      {feedback && <div className={`study-feedback ${feedback.result}`}><strong>{feedback.result === "correct" ? "Correct" : `Answer: ${feedback.expectedAnswer}`}</strong>{prompt.explanation && <p>{prompt.explanation}</p>}<button className="primary" type="button" onClick={next}>{index + 1 >= prompts.length ? "Finish" : "Continue"}</button></div>}
    </div>
  </section>;
}
