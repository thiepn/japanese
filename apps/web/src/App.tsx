import { useEffect, useState } from "react";
import type { SearchResult } from "@thiepn/search";
import { searchLocalJapanese } from "./content";

type Surface = "Today" | "Learn" | "Immerse" | "Library" | "Progress";

export function App() {
  const [surface, setSurface] = useState<Surface>("Today");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [libraryStatus, setLibraryStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    if (surface !== "Library") return;
    let cancelled = false;
    setLibraryStatus("loading");
    searchLocalJapanese(query)
      .then((next) => { if (!cancelled) { setResults(next); setLibraryStatus("ready"); } })
      .catch(() => { if (!cancelled) { setResults([]); setLibraryStatus("error"); } });
    return () => { cancelled = true; };
  }, [query, surface]);

  return <div className="app-shell">
    <header className="topbar"><div><strong>Japanese</strong><span className="phase">P0 foundation</span></div><button className="quiet-button">Account</button></header>
    <main className="content">
      {surface === "Today" && <section className="hero"><p className="eyebrow">TODAY</p><h1>Continue Japanese</h1><p>The adaptive study plan will live here. P0 is wiring the shared data contracts first.</p><button className="primary" disabled>Continue study</button></section>}
      {surface === "Learn" && <Placeholder title="Learn" body="Course, deliberate practice, vocabulary, grammar and kanji will share one Study Player." />}
      {surface === "Immerse" && <Placeholder title="Immerse" body="Reader, listening and productive practice will arrive here without separate learner states." />}
      {surface === "Progress" && <Placeholder title="Progress" body="Proficiency, mastery and retention will be projections derived from immutable study evidence." />}
      {surface === "Library" && <section className="library"><p className="eyebrow">LIBRARY</p><h1>Search Japanese</h1><input aria-label="Search Japanese" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="食べる, たべる, eat…" />{libraryStatus === "error" && <p role="status">Local content database is unavailable in this browser.</p>}<div className="results">{results.map((item) => <article className="result-card" key={`${item.entity.kind}:${item.entity.id}`}><strong lang="ja">{item.title}</strong><span>{item.subtitle}</span></article>)}</div></section>}
    </main>
    <nav className="nav" aria-label="Primary">{(["Today","Learn","Immerse","Library","Progress"] as Surface[]).map((item) => <button key={item} className={surface === item ? "active" : ""} onClick={() => setSurface(item)}>{item}</button>)}</nav>
  </div>;
}

function Placeholder({ title, body }: { title: string; body: string }) { return <section className="hero"><p className="eyebrow">{title.toUpperCase()}</p><h1>{title}</h1><p>{body}</p></section>; }
