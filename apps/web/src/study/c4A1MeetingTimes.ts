import type {CourseFirstUnit} from "./courseAuthoring";

/** Original time-and-meetings sequence, preserving the existing E02 time capstone. */
export const C4_A1_MEETING_TIMES:CourseFirstUnit={
 id:"a1-unit-12",title:"Meeting times and clear schedules",
 objective:"Ask when an activity starts and ends, interpret a short timetable, and negotiate a meeting without reversing から and まで.",
 lessons:[
 {id:"cf-a1-12-01",title:"When does it start?",
  objective:"Ask for an event start time using 何時から and answer with time + から.",
  teach:"何時からですか asks 'From what time?' or 'When does it start?' in a setting where the event is understood. 九時からです means 'From nine o'clock'. The particle から now marks a starting time, just as it marked a departure point in an earlier travel sentence. The noun preceding から tells you whether the starting point is a place or a time. 勉強会（べんきょうかい）is a study meeting, while 授業（じゅぎょう）is a class. A time alone is not yet the ending time.",
  examples:[["勉強会は何時からですか。","What time does the study meeting start?"],["九時からです。","It starts at nine."],["授業は八時からです。","Class begins at eight."],["今日は十時からです。","Today it starts at ten."]],
  checks:[
   ["ケン：勉強会は何時からですか。 Which information is requested?","The beginning time","The finishing time","The place of origin","何時から means 'from what time' or start time."],
   ["ミナ：九時からです。 What is the beginning time?","Nine o'clock","Ten o'clock","Eight o'clock","九時 means nine o'clock and から marks the start."],
   ["Which answers 何時からですか if the class begins at eight?","八時からです。","八時までです。","八時をください。","から marks the start, while まで marks an endpoint."],
   ["What does から express in 東京から来ました versus 九時からです?","A starting point in each context","An ending point in each context","A request for an item","With a place から marks a source; with a time it marks when something starts."]
  ],
  recall:["Write 'The meeting starts at nine' using 九時 and から.","九時からです。"],
  writing:"Write three original meeting-start messages with different days or start times. Include one explicit question and do not claim an ending time that has not been stated."},
 {id:"cf-a1-12-02",title:"When does it end?",
  objective:"Distinguish an end time marked by まで from a start marked by から.",
  teach:"まで marks an end point or limit. 十時までです means 'Until ten'. When both ends of a schedule are known, 九時から十時までです gives the range from nine to ten. Notice that 九時から and 十時まで refer to different facts. You can ask 勉強会は何時までですか to learn the ending time. Do not use 九時まで when someone specifically asks when the event begins unless nine actually is its ending time.",
  examples:[["勉強会は何時までですか。","Until what time is the study meeting?"],["十時までです。","It runs until ten."],["九時から十時までです。","It is from nine until ten."],["授業は八時から九時までです。","Class runs from eight to nine."]],
  checks:[
   ["ケン：勉強会は何時までですか。 What does Ken ask?","The ending time","The starting place","Which food Mina likes","まで marks the end of the time range."],
   ["九時から十時までです。 What time does the event end?","Ten o'clock","Nine o'clock","Eight o'clock","十時まで is the ending point of the event."],
   ["九時から十時までです。 When does it begin?","Nine o'clock","Ten o'clock","Eleven o'clock","九時から identifies the start."],
   ["Which expression gives only 'until six o'clock'?","六時まで","六時から","六時に来ました","まで marks the final time, whereas から marks the beginning."]
  ],
  recall:["Write 'from nine until ten' using 九時 and 十時.","九時から十時までです。"],
  writing:"Write two possible study-meeting schedules and then write a direct polite question about each schedule's end time. Make both answers consistent with the written range."},
 {id:"cf-a1-12-03",title:"Half hours and time contrast",
  objective:"Read 時半 and separate a half-hour ending from an earlier starting time.",
  teach:"九時半（くじはん）means 9:30; 半 means half past the hour. A class can be 八時から九時半まで: it starts at 8:00 and finishes at 9:30. Saying 九時半から would instead make 9:30 the beginning. This distinction is important when arranging practical appointments. Study the numbers and their particles together, rather than recognizing only familiar words such as 九時 or 半.",
  examples:[["九時半です。","It is half past nine."],["八時から九時半までです。","It runs from eight until half past nine."],["十時半からです。","It starts at half past ten."],["十一時までです。","It runs until eleven."]],
  checks:[
   ["授業は八時から九時半までです。 When does class end?","9:30","8:30","9:00","九時半 is half past nine; まで marks the ending."],
   ["What does 十時半 mean?","10:30","10:00","10:15","半 after an hour means half past, or thirty minutes."],
   ["A meeting begins at 10:30. Which describes that beginning?","十時半からです。","十時半までです。","十時までです。","十時半から is from 10:30, the beginning."],
   ["In 八時から九時半まで, which statement is supported?","The meeting begins at eight","The meeting ends at eight","The meeting starts at half past nine","八時から is the start; 九時半まで is the end."]
  ],
  recall:["Write 'until half past nine' with 九時半.","九時半までです。"],
  writing:"Draft two original class schedules using at least one half-hour time. Under each, write one separate Japanese start-time answer and one end-time answer."},
 {id:"cf-a1-12-04",title:"Read an event board",
  objective:"Compare three short event listings and find start/end times without conflating them.",
  teach:"Read this original community notice. 日本語クラス：月曜日、九時から十時まで。読書会：水曜日、十時半から十一時半まで。勉強会：金曜日、八時から九時まで。 Monday's Japanese class starts at nine; Wednesday's reading group starts at 10:30; Friday's study meeting starts at eight. A reader must keep each day attached to its event, and must distinguish から and まで within each listing. Notice that 何時から and 何時まで are different questions even when they refer to the same activity.",
  examples:[["日本語クラス：月曜日、九時から十時まで。","Japanese class: Monday, 9:00–10:00."],["読書会：水曜日、十時半から十一時半まで。","Reading group: Wednesday, 10:30–11:30."],["勉強会：金曜日、八時から九時まで。","Study meeting: Friday, 8:00–9:00."],["読書会は何時までですか。","Until what time is the reading group?"]],
  checks:[
   ["月曜日の日本語クラスは何時からですか。","九時","十時","八時","Monday's Japanese class starts at 九時; 十時 is the end."],
   ["水曜日の読書会は何時までですか。","十一時半","十時半","九時","The Wednesday group ends at 十一時半."],
   ["金曜日の勉強会は何時からですか。","八時","九時","十時半","The Friday study meeting starts at 八時."],
   ["Which activity begins at 10:30 in the notice?","読書会","日本語クラス","勉強会","The reading group line says 十時半から."]
  ],
  recall:["Write 'The reading group starts at half past ten' using 読書会 and 十時半.","読書会は十時半からです。"],
  writing:"Write an original three-event notice for different days with start and end times. Then write three Japanese comprehension questions whose answers cannot be confused across events."},
 {id:"cf-a1-12-05",title:"Confirm a changed meeting",
  objective:"Answer a revised start-time question and explicitly distinguish a rescheduled beginning from the old ending.",
  teach:"Consider a change message: 勉強会は九時からでしたが、今日は十時からです。 This tells us the original starting time was nine, but today's start is ten. In an A1 conversation you may keep the message simpler: 昨日は九時からでした。今日は十時からです。 A polite question 今日は何時からですか asks for the new beginning. If another speaker only gives a start time, you should ask 何時までですか before asserting the end. This avoids a common communication mistake: treating a remembered schedule as the current schedule.",
  examples:[["昨日は九時からでした。","Yesterday it started at nine."],["今日は十時からです。","Today it starts at ten."],["今日は何時からですか。","What time does it start today?"],["何時までですか。","Until what time does it run?"]],
  checks:[
   ["昨日は九時からでした。今日は十時からです。 When does it start TODAY?","Ten o'clock","Nine o'clock","The end time is ten","今日は identifies today's revised beginning."],
   ["The notice only says 今日は十時からです. What is still unknown?","The ending time","The starting time","Whether today is mentioned","から states the start; no まで endpoint has been supplied."],
   ["Which question asks for the currently scheduled beginning?","今日は何時からですか。","昨日どこに行きましたか。","お茶が好きですか。","今日は何時からですか asks today's start time."],
   ["Which is the appropriate follow-up if you need the event's ending time?","何時までですか。","何時からですか。","どこから来ましたか。","まで asks for the end; から asks for a start or source."]
  ],
  recall:["Write 'Today it starts at ten' using 今日 and 十時.","今日は十時からです。"],
  writing:"Write a five-message original schedule-update exchange: old start, revised start, confirmation question, confirmation answer, and a follow-up asking the end time. Do not invent an end time unless the exchange provides it."},
 {id:"cf-a1-12-06",title:"Independent study-meeting time challenge",
  scene:"time",objective:"Follow the existing Ken–Mina study-meeting exchange, distinguish 九時から from 十時まで, and complete native E02 delayed transfer."}
 ]};
