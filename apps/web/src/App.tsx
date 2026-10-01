import { useMemo, useState } from "react";
import type { EntityRef } from "@thiepn/domain";

type Surface = "Today" | "Learn" | "Immerse" | "Library" | "Progress";
const seed = [
  { entity: { kind: "lexeme", id: "lex-taberu" } satisfies EntityRef, title: "食べる", subtitle: "たべる · to eat" },
  { entity: { kind: "lexeme", id: "lex-gakkou" } satisfies EntityRef, title: "学校", subtitle: "がっこう · school" },
  { entity: { kind: "grammar", id: "grammar-teiru" } satisfies EntityRef, title: "〜ている", subtitle: "ongoing action / resulting state" }
];

export function App() {
  const [surface, setSurface] = useState<Surface>("Today");
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? seed.filter((item) => `${item.title} ${item.subtitle}`.toLowerCase().includes(q)) : seed;
  }, [query]);
  return <div className="app-shell">
    <header className="topbar"><div><strong>Japanese</strong><span className="phase">P0 foundation</span></div><button className="quiet-button">Account</button></header>
    <main className="content">
      {surface === "Today" && <section className="hero"><p className="eyebrow">TODAY</p><h1>Continue Japanese</h1><p>The adaptive study plan will live here. P0 is wiring the shared data contracts first.</p><button className="primary" disabled>Continue study</button></section>}
      {surface === "Learn" && <Placeholder title="Learn" body="Course, deliberate practice, vocabulary, grammar and kanji will share one Study Player." />}
      {surface === "Immerse" && <Placeholder title="Immerse" body="Reader, listening and productive practice will arrive here without separate learner states." />}
      {surface === "Progress" && <Placeholder title="Progress" body="Proficiency, mastery and retention will be projections derived from immutable study evidence." />}
      {surface === "Library" && <section className="library"><p className="eyebrow">LIBRARY</p><h1>Search Japanese</h1><input aria-label="Search Japanese" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="食べる, たべる, eat…" /><div className="results">{results.map((item) => <article className="result-card" key={`${item.entity.kind}:${item.entity.id}`}><strong lang="ja">{item.title}</strong><span>{item.subtitle}</span></article>)}</div></section>}
    </main>
    <nav className="nav" aria-label="Primary">{(["Today","Learn","Immerse","Library","Progress"] as Surface[]).map((item) => <button key={item} className={surface === item ? "active" : ""} onClick={() => setSurface(item)}>{item}</button>)}</nav>
  </div>;
}

function Placeholder({ title, body }: { title: string; body: string }) { return <section className="hero"><p className="eyebrow">{title.toUpperCase()}</p><h1>{title}</h1><p>{body}</p></section>; }
