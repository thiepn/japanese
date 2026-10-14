import type {StudyEvent} from "@thiepn/domain";
import type {StudyLesson,StudyPrompt,StudyStep} from "@thiepn/study-player";
import {coreContent} from "../coreContent";
import {e01ReviewPrompts} from "./a1Excellence";
import {e02ReviewPrompts} from "./a1ExcellenceCourse";
import {e03ReviewPrompts} from "./a2ExcellenceCourse";
import {e04ReviewPrompts} from "./a2ExcellenceAdvancedCourse";

/** Original alternative items: a failed cue is not re-used as its own corrective test. */
interface RepairItem {
 cohort:"e01"|"e02"|"e03"|"e04";
 scene:string;title:string;misconception:string;contrast:string;
 question:string;correct:string;foils:readonly [string,string];
 why:string;mode:"reading"|"form_selection"|"comprehension";
}
const REPAIR_ITEMS:readonly RepairItem[]=[
 {cohort:"e01",scene:"",title:"Introduce yourself without confusing names and origins",misconception:"A self-introduction is not a request to give an object.",contrast:"私は〜です identifies a speaker; 〜をください asks for an item.",question:"友達：お名前は何ですか。　ユナ：＿＿＿",correct:"ユナです。",foils:["ユナをください。","ユナから来ました。"],why:"A name is followed by です. から would indicate an origin, and をください requests something.",mode:"form_selection"},
 {cohort:"e02",scene:"greetings",title:"Choose a greeting for the actual time of day",misconception:"Using a morning phrase to answer an evening greeting.",contrast:"おはようございます = polite morning greeting; こんばんは = good evening.",question:"夜八時です。先生：こんばんは。　あなた：＿＿＿",correct:"こんばんは。",foils:["おはようございます。","いただきます。"],why:"This meeting is at 8 p.m. こんばんは fits; おはようございます is a morning greeting.",mode:"form_selection"},
 {cohort:"e02",scene:"personal",title:"Answer a name question instead of an object request",misconception:"Confusing です with をください in a short exchange.",contrast:"お名前は？ asks for identity; 〜です can supply your own name.",question:"初対面です。先生：お名前は？　ケン：＿＿＿",correct:"ケンです。",foils:["ケンをください。","ケンまでです。"],why:"A personal name plus です answers an identity question. をください and まで are unrelated.",mode:"form_selection"},
 {cohort:"e02",scene:"origin",title:"Distinguish origin from destination",misconception:"Using に for where one came from.",contrast:"国から来ました is about origin; 国に行きます is about destination.",question:"昨日、日本から来た人に『どこから来ましたか』と聞きました。答えは？",correct:"日本から来ました。",foils:["日本に行きます。","日本をください。"],why:"The origin is explicitly from Japan; から marks the starting point.",mode:"comprehension"},
 {cohort:"e02",scene:"routine",title:"Identify which time is for getting up",misconception:"Confusing rising time with departure time.",contrast:"起きます = get up; 学校へ行きます = go to school. に marks the exact time.",question:"ミナ：六時に起きます。七時に学校に行きます。　何時に起きますか。",correct:"六時",foils:["七時","八時"],why:"Six is when Mina gets up. Seven is the later departure time.",mode:"comprehension"},
 {cohort:"e02",scene:"family",title:"Express a family relationship using の",misconception:"Confusing possessive relation with を or a movement particle.",contrast:"私の母 is my mother; を marks a direct object, not a family relationship.",question:"写真を見せます。『This is my mother』に合うのは？",correct:"私の母です。",foils:["私を母です。","私に母です。"],why:"私の母 identifies a relationship using の.",mode:"form_selection"},
 {cohort:"e02",scene:"time",title:"Separate a meeting's beginning and ending",misconception:"Swapping から and まで.",contrast:"九時から is from nine; 十時まで is until ten.",question:"勉強会は八時から九時までです。何時までですか。",correct:"九時",foils:["八時","十時"],why:"まで identifies the ending time, not the start.",mode:"comprehension"},
 {cohort:"e02",scene:"food",title:"Use をください to order an item",misconception:"Substituting destination or location particles in a request.",contrast:"お茶をください requests tea; で/に do different jobs.",question:"店員：何になさいますか。　客：＿＿＿",correct:"水をください。",foils:["水に行きます。","水で来ました。"],why:"The staff asks what you want to order. 水をください is the appropriate request.",mode:"form_selection"},
 {cohort:"e02",scene:"shopping",title:"Distinguish a quoted price from asking to buy",misconception:"Treating 五百円です as an order rather than information.",contrast:"〜円です states the price; 〜をください is an order.",question:"客：これはいくらですか。　店員：二千円です。　値段はいくらですか。",correct:"二千円",foils:["二百円","千円"],why:"二千円 is 2,000 yen, not 200 or 1,000.",mode:"comprehension"},
 {cohort:"e02",scene:"preferences",title:"Express 'also' without turning 好き into a verb",misconception:"Treating 好き as a ます-verb or using を.",contrast:"私も expresses shared agreement; カレーが好きです gives a preference.",question:"ユナ：お茶が好きです。　あなたも好きです。何と言いますか。",correct:"私もお茶が好きです。",foils:["私をお茶が好きます。","私にお茶を行きます。"],why:"も marks agreement and が marks the liked item; 好き is not a ます-verb.",mode:"form_selection"},
 {cohort:"e02",scene:"past",title:"Use polite past for yesterday",misconception:"Answering a past-time question with present/future 行きます.",contrast:"昨日 requires a past answer; 駅に marks destination.",question:"友達：昨日、駅に行きましたか。　あなた：＿＿＿（yes）",correct:"はい、行きました。",foils:["はい、行きます。","はい、行きません。"],why:"Yesterday is in the past, so 行きました is the affirmative answer.",mode:"form_selection"},
 {cohort:"e02",scene:"transport",title:"Distinguish a travel method from a destination",misconception:"Using に where バスで is required.",contrast:"バスで is by bus; 駅に is to the station.",question:"ユナ：電車で学校に行きます。　何で行きますか。",correct:"電車",foils:["学校","徒歩"],why:"何で asks for the means. The means is 電車, not the destination 学校.",mode:"comprehension"},
 {cohort:"e02",scene:"help",title:"Ask for repetition rather than unrelated information",misconception:"Responding to unclear speech with a topic question instead of clarification.",contrast:"もう一度お願いします politely requests repetition.",question:"速く話されて聞き取れません。何と言いますか。",correct:"もう一度お願いします。",foils:["千円です。","私は学生でした。"],why:"A repetition request directly repairs the communication breakdown.",mode:"form_selection"},
 {cohort:"e02",scene:"exchange",title:"Distinguish agreement from new-information acknowledgment",misconception:"Answering shared observation with そうですか.",contrast:"そうですね agrees; そうですか acknowledges previously unknown information.",question:"外は寒いです。友達：今日は寒いですね。　あなた：＿＿＿",correct:"そうですね。",foils:["そうですか。","お茶をください。"],why:"Both speakers can feel the cold. そうですね agrees with a shared observation.",mode:"form_selection"},
 {cohort:"e03",scene:"weekend-invitation",title:"Handle a conditional change of plans",misconception:"Confusing the main plan with its rain alternative.",contrast:"雨だったら introduces an alternative, not the original venue.",question:"『晴れなら公園へ。雨ならカフェへ。』明日は雨です。どこへ行きますか。",correct:"カフェ",foils:["公園","駅"],why:"The rain condition selects the café, not the fair-weather park.",mode:"comprehension"},
 {cohort:"e03",scene:"restaurant-adjustment",title:"Distinguish choice from a food characteristic",misconception:"Using a request for preparation as if it selects the menu item.",contrast:"〜にします selects an item; 〜ないでください requests a modification.",question:"店員：カレーとスープがあります。　客：スープにします。　何を注文しましたか。",correct:"スープ",foils:["カレー","水"],why:"〜にします announces the chosen item. It doesn't order both options.",mode:"comprehension"},
 {cohort:"e03",scene:"moving-around-town",title:"Interpret turns in multi-step directions",misconception:"Switching left and right after the specified landmark.",contrast:"一つ目 vs 二つ目 and 左 vs 右 both matter.",question:"道をまっすぐ行って、二つ目の信号を左に曲がります。どこで曲がりますか。",correct:"二つ目の信号",foils:["一つ目の角","駅の入口"],why:"The instruction specifies the second traffic light. 左 supplies the direction there.",mode:"comprehension"},
 {cohort:"e03",scene:"shopping-choice",title:"Separate product price and product preference",misconception:"Assuming the cheapest item must be selected.",contrast:"〜ほうがいい expresses a preference; selection may prioritize size over price.",question:"青いかばんは安いですが、小さいです。大きい赤いかばんにしました。何を買いますか。",correct:"赤いかばん",foils:["青いかばん","両方"],why:"The speaker ultimately chose the large red bag despite the price.",mode:"comprehension"},
 {cohort:"e03",scene:"sharing-experience",title:"Locate the actual reason after ので",misconception:"Interpreting a concessive 〜が as the reason for enjoyment.",contrast:"天気がよかったので gives a reason; 人が多かったですが signals contrast.",question:"混んでいましたが、景色がきれいだったので楽しかったです。なぜ楽しかったですか。",correct:"景色がきれいだったから",foils:["人が多かったから","暑かったから"],why:"The pleasant scenery after ので is the stated reason. Crowds form the contrast.",mode:"comprehension"},
 {cohort:"e03",scene:"health-and-scheduling",title:"Identify the rescheduled meeting day",misconception:"Treating the declined day as the accepted day.",contrast:"〜なら offers a viable alternative, not agreement to the original time.",question:"今日は頭が痛いですが、明日の午後なら行けます。いつ行けますか。",correct:"明日の午後",foils:["今日の午後","来週"],why:"The speaker cannot go today; 明日の午後 is the offered alternative.",mode:"comprehension"},
 {cohort:"e03",scene:"weather-and-plans",title:"Treat かもしれません as uncertainty",misconception:"Converting a possibility into a confirmed forecast.",contrast:"〜かもしれません means might, not certainly will.",question:"明日は雪が降るかもしれません。何が分かりますか。",correct:"雪が降る可能性があります。",foils:["必ず雪が降ります。","絶対に晴れます。"],why:"The modal marks possibility without certainty.",mode:"comprehension"},
 {cohort:"e03",scene:"community-event",title:"Read an unfinished task accurately",misconception:"Treating まだ〜ていません as completed.",contrast:"まだ買っていません = have not bought it yet.",question:"場所は予約しましたが、飲み物はまだ買っていません。何が残っていますか。",correct:"飲み物を買うこと",foils:["場所を予約すること","会場を決め直すこと"],why:"The venue is already reserved. Drinks remain unpurchased.",mode:"comprehension"},
 {cohort:"e04",scene:"train-disruption",title:"Use conditional route information, not assumptions",misconception:"Assuming a possible bus journey guarantees arrival on time.",contrast:"〜かもしれません signals uncertain arrival; 〜ておきます prepares contact.",question:"バスが混んでいて遅れるかもしれません。何を先にしたほうがいいですか。",correct:"予約先に連絡しておきます。",foils:["必ず間に合うと伝えます。","何も確認しません。"],why:"The possible delay calls for proactive contact, not a promise of punctuality.",mode:"form_selection"},
 {cohort:"e04",scene:"hotel-reservation",title:"Resolve a discrepancy with evidence",misconception:"Confusing a polite verification request with accusation or cancellation.",contrast:"予約メールを見ていただけますか asks staff to inspect evidence.",question:"予約メールと受付の記録が違います。最初に何をお願いしますか。",correct:"予約メールを確認していただけますか。",foils:["全部取り消しました。","証拠はいりません。"],why:"A polite verification request grounds the conversation in the booking record.",mode:"form_selection"},
 {cohort:"e04",scene:"store-return",title:"Request a remedy conditionally",misconception:"Presenting a refund as a certain automatic outcome.",contrast:"同じ商品がなければ、返金について相談したいです treats refund as a discussion.",question:"交換品の在庫がありません。次に何をしますか。",correct:"返金について相談します。",foils:["交換品が必ずあると言います。","買ったことを隠します。"],why:"The replacement is unavailable, so asking about another remedy fits the condition.",mode:"form_selection"},
 {cohort:"e04",scene:"home-visit-etiquette",title:"Honor the host's actual request",misconception:"Assuming an unrequested gift or ingredient is universally required.",contrast:"The particular invitation defines time, food constraints and any required preparation.",question:"友達：手土産は必要ありません。飲み物も用意しています。どうしますか。",correct:"お礼を伝えて、時間どおりに行きます。",foils:["必ず高い手土産を買います。","何も伝えずに遅れます。"],why:"Follow the host's stated preferences; politeness is situational rather than a fixed gift rule.",mode:"form_selection"},
 {cohort:"e04",scene:"course-comparison",title:"Prioritize what matters in a comparison",misconception:"Always selecting the lowest fee irrespective of constraints.",contrast:"Choosing a course involves actual schedule, capacity and learning needs.",question:"火曜日は安いですが、仕事で行けません。土曜日なら参加できます。どちらにしますか。",correct:"土曜日のクラス",foils:["火曜日のクラス","両方"],why:"The Tuesday class is unavailable to this learner. Feasibility outweighs price.",mode:"comprehension"},
 {cohort:"e04",scene:"community-noise",title:"Make a bounded and polite neighborhood request",misconception:"Escalating without specifying time or a practical change.",contrast:"〜ていただけませんか softens a request and specifies the desired action.",question:"夜遅い音楽に困っています。どの言い方が適切ですか。",correct:"夜十時以降は音を小さくしていただけませんか。",foils:["音楽をすぐ全部やめろ。","今日は暑いですね。"],why:"A courteous, bounded request addresses the actual concern without a command.",mode:"form_selection"},
 {cohort:"e04",scene:"club-project",title:"Respect prerequisites before publishing",misconception:"Treating an unfinished permission check as approval.",contrast:"許可を確認してから印刷する means printing only after verification.",question:"写真の使用許可がまだありません。いつ公開できますか。",correct:"使用許可を確認してから",foils:["今すぐ","何も確認せずに"],why:"The team must confirm the license before the photo can be used.",mode:"comprehension"}
];

export interface RepairTarget {
 promptId:string;scene:string;cohort:RepairItem["cohort"];title:string;
 occurredAt:string;skill:string;canonicalId:string;
}
export interface E05Evidence{
  controlled:{attempts:number;correct:number;distinctCorrect:number;listening:number;reading:number;formSelection:number;typedProduction:number};
  unscored:{writing:number;speech:number};delayed:{correct:number;attempts:number};
  repair:{pending:number;repaired:number;available:number};targets:RepairTarget[];
  canonical:{a1:number;a2:number;explicitA21:number;explicitA22:number;unsplitA2:number};
}
const allReviewPrompts=[...e01ReviewPrompts,...e02ReviewPrompts,...e03ReviewPrompts,...e04ReviewPrompts];
const byPromptId=new Map(allReviewPrompts.map(p=>[p.id,p]));
const units=new Map(coreContent.courseUnits.map(unit=>[unit.id,unit]));
const canDos=new Set(coreContent.canDos.map(canDo=>canDo.id));
function originalCohort(event:StudyEvent):RepairItem["cohort"]|null{
  if(event.metadata?.e04===true)return "e04";
  if(event.metadata?.e03===true)return "e03";
  if(event.metadata?.e02===true)return "e02";
  if(event.metadata?.e01===true)return "e01";
  return null;
}
function sceneId(event:StudyEvent):string{
  for(const key of ["e04SceneId","e03SceneId","e02SceneId"]){const value=event.metadata?.[key];if(typeof value==="string")return value;}
  return "";
}
function isCanonical(event:StudyEvent):boolean{
 if(event.primaryTarget?.kind!=="can_do"||!canDos.has(event.primaryTarget.id))return false;
 const unitId=event.metadata?.e04UnitId??event.metadata?.e03UnitId??event.metadata?.e02UnitId??event.metadata?.e01UnitId;
 if(typeof unitId!=="string")return false;
 return units.get(unitId)?.canDoId===event.primaryTarget.id;
}
function later(a:string,b:string):boolean{return Date.parse(a)>Date.parse(b);}
function relevant(events:readonly StudyEvent[]):StudyEvent[]{
 return events.filter(e=>originalCohort(e)!==null&&isCanonical(e));
}
function repairItem(cohort:RepairItem["cohort"],scene:string):RepairItem|undefined{
 return REPAIR_ITEMS.find(i=>i.cohort===cohort&&i.scene===scene);
}
function controlled(e:StudyEvent):boolean{
 return e.metadata?.nonAuthoritative!==true&&e.metadata?.e05Repair!==true
  &&typeof e.metadata?.promptId==="string"&&Boolean(byPromptId.has(e.metadata.promptId as string));
}
export function getE05Evidence(events:readonly StudyEvent[]):E05Evidence{
 const seen=relevant(events),controlledEvents=seen.filter(controlled);
 const latest=new Map<string,StudyEvent>();
 for(const event of controlledEvents){
  const promptId=event.metadata?.promptId as string;
  const prior=latest.get(promptId);
  if(!prior||later(event.occurredAt,prior.occurredAt))latest.set(promptId,event);
 }
 const repairEvents=seen.filter(e=>e.metadata?.e05Repair===true);
 const targets:RepairTarget[]=[];
 let repaired=0;
 for(const [id,event] of latest){
  if(event.result!=="incorrect")continue;
  const cohort=originalCohort(event)!;
  const scene=sceneId(event);
  if(!repairItem(cohort,scene))continue;
  const resolution=repairEvents.some(e=>e.result==="correct"&&e.metadata?.e05RepairFor===id&&later(e.occurredAt,event.occurredAt));
  if(resolution){repaired++;continue;}
  targets.push({promptId:id,scene,cohort,title:repairItem(cohort,scene)!.title,
   occurredAt:event.occurredAt,skill:event.skillDimension??"comprehension",canonicalId:event.primaryTarget!.id});
 }
 targets.sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt));
 const controlledCorrect=controlledEvents.filter(e=>e.result==="correct");
 const staged=seen.filter(e=>e.metadata?.e02Stage==="delayed"||e.metadata?.e03Stage==="delayed"||e.metadata?.e04Stage==="delayed"||e.metadata?.e01Stage==="delayed");
 const free=seen.filter(e=>e.metadata?.nonAuthoritative===true);
 const levels=coreContent.courseUnits;
 return {
  controlled:{attempts:controlledEvents.length,correct:controlledCorrect.length,
   distinctCorrect:new Set(controlledCorrect.map(e=>e.metadata?.promptId)).size,
   listening:controlledCorrect.filter(e=>e.skillDimension==="listening"||e.skillDimension==="audio_recognition").length,
   reading:controlledCorrect.filter(e=>e.skillDimension==="comprehension"||e.skillDimension==="reading").length,
   formSelection:controlledCorrect.filter(e=>e.skillDimension==="form_selection").length,
   typedProduction:controlledCorrect.filter(e=>e.skillDimension==="production"&&e.responseMode==="typed").length},
  unscored:{writing:free.filter(e=>e.responseMode==="textarea").length,speech:free.filter(e=>e.responseMode==="speech").length},
  delayed:{correct:staged.filter(e=>e.result==="correct").length,attempts:staged.length},
  repair:{pending:targets.length,repaired,available:REPAIR_ITEMS.length},
  targets,
  canonical:{a1:levels.filter(u=>u.level==="A1").length,a2:levels.filter(u=>u.level==="A2").length,
   explicitA21:levels.filter(u=>u.level==="A2.1").length,explicitA22:levels.filter(u=>u.level==="A2.2").length,
   unsplitA2:levels.filter(u=>u.level==="A2").length}
 };
}
function lesson(id:string,title:string,body:string,examples:StudyLesson["examples"]):StudyLesson{
 return {kind:"lesson",id:"e05-repair-"+id,title,body,
   contextId:"e05-repair-"+id,examples,sourceLabel:"THIEPN original correction · source-linked review"};
}
function newQuestion(item:RepairItem,target:RepairTarget):StudyPrompt{
 const old=byPromptId.get(target.promptId)!;
 const key="e05-repair-"+target.cohort+"-"+target.scene+"-"+target.promptId;
 return {id:key,primaryTarget:old.primaryTarget,skill:item.mode,cueFamily:key,
 promptType:"choice",instruction:"Apply the distinction to a different situation. No answer is shown.",
 prompt:item.question,promptLanguage:"ja",
 choices:[item.foils[0],item.correct,item.foils[1]],
 acceptedAnswers:[item.correct],displayAnswer:item.correct,explanation:item.why,
 sourceId:"thiepn-original",contentVersion:coreContent.version,
 contextId:"e05-repair-"+target.cohort+"-"+target.scene,
 activity:"review",languageActivity:"reading",
 eventMetadata:{e05Repair:true,e05RepairFor:target.promptId,e05Cohort:target.cohort,
   e05SceneId:target.scene,e05SourcePromptId:old.id,
   ...(target.cohort==="e02"?{e02:true,e02SceneId:target.scene,e02UnitId:old.eventMetadata?.e02UnitId}:
   target.cohort==="e03"?{e03:true,e03SceneId:target.scene,e03UnitId:old.eventMetadata?.e03UnitId}:
   target.cohort==="e04"?{e04:true,e04SceneId:target.scene,e04UnitId:old.eventMetadata?.e04UnitId}:
   {e01:true,e01UnitId:old.eventMetadata?.e01UnitId}),
   schedulerExcluded:true,nonAuthoritative:false,assessmentKind:"targeted-repair-only",
   accreditedCefrVerdict:false}};
}
export function buildE05RepairJourney(events:readonly StudyEvent[],limit=4):StudyStep[]{
 const current=getE05Evidence(events).targets.slice(0,limit);
 if(!current.length)return [];
 const steps:StudyStep[]=[];
 for(const target of current){
  const item=repairItem(target.cohort,target.scene);
  const original=byPromptId.get(target.promptId);
  if(!item||!original)continue;
  steps.push(lesson(target.promptId,"Correct the specific misunderstanding · "+item.title,
   "Your latest controlled answer on this cue was incorrect. Review the distinction, then answer a different item without the original choices. A correct repair is evidence of correction practice, not mastery. The original prompt must still be retrieved through its normal FSRS schedule.",
   [{expression:item.contrast,note:"Key distinction"},{expression:original.displayAnswer,note:"Original accepted model · "+(original.explanation??"Read its context carefully.")}]));
  steps.push(newQuestion(item,target));
 }
 return steps;
}
