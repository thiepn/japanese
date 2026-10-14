import {describe,expect,it} from "vitest";
import {a1CommunicationLessons,evaluateA1Exercise} from "./index";

describe("original A1 communication",()=>{
  it("has unique lesson and exercise identifiers",()=>{
    expect(new Set(a1CommunicationLessons.map(l=>l.id)).size).toBe(a1CommunicationLessons.length);
    const ids=a1CommunicationLessons.flatMap(l=>l.exercises.map(e=>e.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("accepts correct answers and rejects wrong answers",()=>{
    for(const lesson of a1CommunicationLessons)for(const exercise of lesson.exercises){
      expect(evaluateA1Exercise(exercise,exercise.answer)).toBe(true);
      expect(evaluateA1Exercise(exercise,exercise.kind==="order"?[...exercise.answer].reverse().concat("wrong"):"unrelated")).toBe(false);
    }
  });
  it("normalizes full-width and whitespace on typed answers",()=>{
    const ex=a1CommunicationLessons[1].exercises.find(e=>e.id==="intro-fill");
    expect(ex).toBeDefined();
    if(ex&&ex.kind==="fill")expect(evaluateA1Exercise(ex," です ")).toBe(true);
  });
});
