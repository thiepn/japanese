import { describe,expect,it } from "vitest";
import {
  createJapaneseLanguageReadModel,
  JAPANESE_APP_ROUTE,
  JAPANESE_READ_MODEL_PRODUCER_REVISION
} from "../../apps/web/src/languageReadModel";
import type {
  A1MilestoneProgress,
  B1MilestoneProgress,
  B2MilestoneProgress,
  C1FoundationProgress
} from "../../apps/web/src/study/runtime";

function milestone(
  complete:boolean,
  score:number
):A1MilestoneProgress {
  return {
    complete,
    answered: complete ? 15 : 6,
    total: 15,
    scores: {
      reading:{activity:"reading",correct:2,answered:3,total:3,score},
      listening:{activity:"listening",correct:2,answered:3,total:3,score},
      spoken_interaction:{activity:"spoken_interaction",correct:1,answered:3,total:3,score},
      spoken_production:{activity:"spoken_production",correct:1,answered:3,total:3,score},
      writing:{activity:"writing",correct:2,answered:3,total:3,score}
    }
  };
}

describe("P8 Japanese language read model",()=>{
  it("projects existing Japanese summaries without raw learner stores",()=>{
    const model=createJapaneseLanguageReadModel({
      generatedAt:"2026-10-05T13:00:00.000Z",
      summary:{
        due:12,newKana:3,newVocabulary:2,listening:2,application:1,course:2,
        learnedKana:144,totalKana:217,learnedVocabulary:211,totalVocabulary:626,
        memoryTraces:402
      },
      kana:{
        overall:.63,hiragana:.8,katakana:.5,recognition:.72,readingRecall:.58,
        formSelection:.5,listening:.49,confidence:.62,accuracy:.81,
        matureSkills:120,expectedSkills:217,evidenceCount:340
      },
      vocabulary:{
        overall:.51,meaning:.7,reading:.55,listening:.42,activeUse:.35,
        confidence:.5,accuracy:.76,matureSkills:190,expectedSkills:626,
        evidenceCount:410
      },
      grammar:{
        overall:.47,comprehension:.55,formSelection:.39,confidence:.44,
        accuracy:.7,matureSkills:42,expectedSkills:118,evidenceCount:130
      },
      sentence:{
        overall:.4,comprehension:.5,production:.3,confidence:.38,
        accuracy:.67,matureSkills:80,expectedSkills:375,evidenceCount:160
      },
      lexicalFluency:{
        overall:.33,recognition:.5,activeUse:.28,registerTransfer:.2,
        confidence:.3,accuracy:.62,matureSkills:31,expectedSkills:152,
        evidenceCount:71,totalChunks:152,transferPrompts:18
      },
      course:[
        {
          id:"u1",order:1,title:"Unit 1",canDo:"test",status:"mastered",
          mastery:.8,evidenceCount:20,
          assessment:{complete:true,answered:3,total:3,score:1}
        },
        {
          id:"u2",order:2,title:"Unit 2",canDo:"test",status:"learning",
          mastery:.45,evidenceCount:8,
          assessment:{complete:false,answered:1,total:3,score:.5}
        }
      ],
      milestones:{
        a1:milestone(true,.8),
        b1:milestone(false,.55) as B1MilestoneProgress,
        b2:milestone(false,.35) as B2MilestoneProgress,
        c1:milestone(false,.2) as C1FoundationProgress
      },
      c1Portfolio:{
        activeDays:4,
        readingTexts:2,
        listeningTexts:2,
        speakingTasks:1,
        writingTasks:1,
        synthesisPacks:1,
        nativeSourceSyntheses:1,
        spontaneousCoachTurns:3,
        autonomyMissionsCompleted:0,
        autonomyMissions:[],
        domains:[],
        reliability:{
          activeDays:4,
          gradedAttempts:3,
          successfulAttempts:2,
          reliableArtifacts:0,
          interactionTurns:3,
          reliableInteractions:0,
          delayedRevisions:1,
          artifactEvidence:[],
          interactionEvidence:[]
        },
        recentArtifacts:[]
      },
      activity:{
        todayEvents:17,sevenDayEvents:88,streakDays:6,
        lastStudiedAt:"2026-10-05T12:45:00.000Z",
        stateRevision:"2026-10-05T12:45:00.000Z:event-99"
      }
    });

    expect(JAPANESE_READ_MODEL_PRODUCER_REVISION).toBe("japanese-p8-read-model-v2");
    expect(model.producerRevision).toBe(JAPANESE_READ_MODEL_PRODUCER_REVISION);
    expect(model.workload.dueItems).toBe(12);
    expect(model.workload.totalItems).toBe(22);
    expect(model.progress.metrics.find((metric)=>metric.id==="course-units-mastered")?.current).toBe(1);
    expect(model.progress.metrics.find((metric)=>metric.id==="c1-active-days")?.current).toBe(4);
    expect(model.progress.metrics.some((metric)=>metric.id==="c1-autonomy-missions-completed")).toBe(true);
    expect(model.proficiency.currentBand).toBe("A1");
    expect(model.proficiency.frontierBand).toBe("B1");
    expect(model.nextAction.kind).toBe("review");
    expect(model.nextAction.priority).toBeGreaterThan(90);
    expect(model.nextAction.route).toBe(JAPANESE_APP_ROUTE);
    expect(JSON.stringify(model)).not.toContain("memoryTraces");
    expect(JSON.stringify(model)).not.toContain("studyEvents");
  });

  it("keeps Japanese proficiency scoped as an internal milestone claim",()=>{
    const model=createJapaneseLanguageReadModel({
      generatedAt:"2026-10-05T13:00:00.000Z",
      summary:{
        due:0,newKana:0,newVocabulary:0,listening:0,application:0,course:0,
        learnedKana:217,totalKana:217,learnedVocabulary:626,totalVocabulary:626,
        memoryTraces:900
      },
      kana:{overall:1,hiragana:1,katakana:1,recognition:1,readingRecall:1,formSelection:1,listening:1,confidence:1,accuracy:1,matureSkills:217,expectedSkills:217,evidenceCount:1000},
      vocabulary:{overall:.9,meaning:.95,reading:.9,listening:.85,activeUse:.8,confidence:.9,accuracy:.94,matureSkills:600,expectedSkills:626,evidenceCount:1500},
      grammar:{overall:.85,comprehension:.9,formSelection:.8,confidence:.85,accuracy:.9,matureSkills:105,expectedSkills:118,evidenceCount:700},
      sentence:{overall:.8,comprehension:.85,production:.75,confidence:.8,accuracy:.88,matureSkills:330,expectedSkills:375,evidenceCount:900},
      lexicalFluency:{overall:.75,recognition:.85,activeUse:.7,registerTransfer:.65,confidence:.75,accuracy:.86,matureSkills:120,expectedSkills:152,evidenceCount:500,totalChunks:152,transferPrompts:18},
      course:[],
      milestones:{
        a1:milestone(true,.9),
        b1:milestone(true,.85) as B1MilestoneProgress,
        b2:milestone(true,.8) as B2MilestoneProgress,
        c1:milestone(false,.6) as C1FoundationProgress
      },
      activity:{todayEvents:0,sevenDayEvents:20,streakDays:3,lastStudiedAt:"2026-10-04T17:00:00.000Z"}
    });

    expect(model.proficiency.framework).toContain("internal");
    expect(model.proficiency.claim).toBe("internal");
    expect(model.proficiency.currentBand).toBe("B2");
    expect(model.proficiency.frontierBand).toBe("C1 foundation");
    expect(model.proficiency.dimensions.some((dimension)=>dimension.id==="reading")).toBe(true);
    expect(model.nextAction.kind).toBe("maintain");
  });
});
