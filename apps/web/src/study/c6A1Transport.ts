import type {CourseFirstUnit} from "./courseAuthoring";

/** Original transport teaching linked to the native E02 station scene. */
export const C6_A1_TRANSPORT:CourseFirstUnit={
 id:"a1-unit-18",title:"Transport and getting to the station",
 objective:"Ask how to get somewhere, distinguish the method from the destination, read a simple travel notice and interpret approximate journey times.",
 lessons:[
 {id:"cf-a1-18-01",title:"How do you get to the station?",
  objective:"Ask どうやって and reply with a means of travel marked by で.",
  teach:"駅までどうやって行きますか asks 'How do you get to the station?' In the answer バスで行きます, バス is the vehicle and で marks the means or method. This is not the same as バスに行きます, which is not the usual way to say you travel by bus. まで marks the endpoint of the journey. A destination and a travel method are separate pieces of information.",
  examples:[["駅までどうやって行きますか。","How do you get to the station?"],["バスで行きます。","I go by bus."],["電車で行きます。","I go by train."],["学校までバスで行きます。","I go to school by bus."]],
  checks:[
   ["ケン：駅までどうやって行きますか。 What does Ken ask?","How to travel to the station","When the café opens","How much the notebook costs","どうやって asks how one travels."],
   ["Which is the usual statement 'I travel by bus'?","バスで行きます。","バスに行きます。","バスをください。","で marks the means of transport."],
   ["In 駅までバスで行きます, what does 駅まで indicate?","The destination or endpoint","The transport used","The fare","まで expresses the endpoint at the station."],
   ["In 駅までバスで行きます, what indicates the mode?","バスで","駅まで","行きます","Vehicle + で states the transport means."]
  ],
  recall:["Write 'I go by bus' using バス.","バスで行きます。"],
  writing:"Create a four-turn original conversation asking how to reach a familiar destination, naming a mode of transport and clarifying the endpoint. Change the transport in a second version."},
 {id:"cf-a1-18-02",title:"Train, bus, bicycle, or on foot",
  objective:"Distinguish vehicle + で from walking expressed with 歩いて.",
  teach:"Japanese can describe transport as 電車で行きます (by train), バスで行きます (by bus), or 自転車で行きます (by bicycle). For walking, 歩いて行きます is a natural statement meaning 'I go on foot'. Avoid translating English 'by foot' as 足で行きます in ordinary beginner travel conversation. The destination can stay the same even if the travel method changes: 駅まで電車で行きます versus 駅まで歩いて行きます.",
  examples:[["学校まで電車で行きます。","I go to school by train."],["駅まで自転車で行きます。","I go to the station by bicycle."],["駅まで歩いて行きます。","I walk to the station."],["家までバスで行きます。","I go home by bus."]],
  checks:[
   ["Which expresses going to the station on foot?","駅まで歩いて行きます。","駅まで電車で行きます。","駅までバスで行きます。","歩いて行きます describes going on foot."],
   ["What vehicle is named in 自転車で行きます?","Bicycle","Train","Bus","自転車 means bicycle."],
   ["What do the two statements 駅まで電車で行きます and 駅まで歩いて行きます share?","The same destination","The same travel method","The same exact travel time","Both end at 駅まで; the methods differ."],
   ["Which states travel by train?","電車で行きます。","電車を行きます。","電車からです。","で after 電車 marks transport means."]
  ],
  recall:["Write 'I walk to the station' using 駅.","駅まで歩いて行きます。"],
  writing:"Describe two routes to the same fictional destination, one using a vehicle and one on foot. Write one line explaining the choice in English; do not invent travel times."},
 {id:"cf-a1-18-03",title:"About ten minutes",
  objective:"Interpret 分 and ぐらい as duration and distinguish duration from a clock time.",
  teach:"十分（じゅっぷん）means ten minutes; 十分ぐらいです means 'about ten minutes'. Here ぐらい signals an approximation, not an exact promise. In the station conversation, バスで行きます。十分ぐらいです means the bus journey is roughly ten minutes. This is a duration, different from 十時 (ten o'clock). Compare 五分（ごふん, five minutes）with 十五分（じゅうごふん, fifteen minutes）and read each number carefully.",
  examples:[["十分ぐらいです。","It is about ten minutes."],["五分ぐらいです。","It is about five minutes."],["バスで行きます。十分ぐらいです。","I go by bus; it is roughly ten minutes."],["十五分ぐらいです。","It is about fifteen minutes."]],
  checks:[
   ["ケン：バスで行きます。十分ぐらいです。 What is the approximate duration?","Ten minutes","Ten o'clock","One hour","十分 here means ten minutes, and ぐらい approximates it."],
   ["Which expression means about fifteen minutes?","十五分ぐらい","五分ぐらい","十五時から","十五分 is fifteen minutes; ぐらい means about."],
   ["What does ぐらい signal in 十分ぐらいです?","An approximate amount","An exact scheduled minute","The destination station","ぐらい indicates approximation."],
   ["Which is a CLOCK time, not a duration?","十時","十分","五分","時 expresses an hour of the day; 分 alone is minutes."]
  ],
  recall:["Write 'about ten minutes' using 十分.","十分ぐらいです。"],
  writing:"Write three fictional transport-duration statements with different routes and approximate minutes. Mark which are estimates and avoid asserting exact arrival times from them."},
 {id:"cf-a1-18-04",title:"Read a three-route travel note",
  objective:"Compare routes, means of travel and approximate duration in an original notice.",
  teach:"Read this fictional note carefully: 『駅まで：バスで十分ぐらい。学校まで：自転車で十五分ぐらい。図書館まで：歩いて五分ぐらい。』 The station is reached by bus in roughly ten minutes; school by bicycle in roughly fifteen minutes; the library on foot in roughly five. These are illustrative times, not actual local directions. The three destinations each have their own method and estimate. A reader must not swap the station's time with the school's or mistake walking for taking a train.",
  examples:[["駅まで：バスで十分ぐらい。","To the station: about ten minutes by bus."],["学校まで：自転車で十五分ぐらい。","To school: about fifteen minutes by bicycle."],["図書館まで：歩いて五分ぐらい。","To the library: about five minutes walking."],["駅までどうやって行きますか。","How do you get to the station?"]],
  checks:[
   ["According to the fictional note, how does the writer reach the library?","On foot","By bicycle","By bus","図書館まで：歩いて五分ぐらい describes walking."],
   ["How long is the estimated bicycle route to school?","About fifteen minutes","About five minutes","About ten minutes","学校まで pairs 自転車 with 十五分ぐらい."],
   ["Which destination is paired with the ten-minute bus trip?","Station","Library","School","The 駅まで entry uses バスで十分ぐらい."],
   ["Which assertion is NOT supported by this note?","These are actual verified local travel times","It lists three destinations","Its estimates are approximate","The note is an illustrative exercise, not real navigation data."]
  ],
  recall:["Write 'To the library, about five minutes on foot' using 図書館.","図書館まで歩いて五分ぐらいです。"],
  writing:"Create an original fictional three-route notice with a destination, method and approximate duration for each route. Write two questions that require comparing the routes rather than repeating one isolated line."},
 {id:"cf-a1-18-05",title:"Ask again when the plan changes",
  objective:"Distinguish a changed travel mode from an unchanged endpoint and ask for an estimate.",
  teach:"Suppose a classmate usually takes the bus to the station: バスで行きます. Today the bus is not used, and they say 今日は歩いて行きます. The destination 駅まで can remain the same even though the mode changes. Ask 何分ぐらいですか ('About how many minutes?') to clarify the expected duration. If the speaker replies 十五分ぐらいです, treat that as an estimate rather than an exact arrival guarantee. A useful confirmation repeats the right route and mode rather than silently relying on yesterday's answer.",
  examples:[["今日は駅まで歩いて行きます。","Today I walk to the station."],["いつもはバスで行きます。","I usually go by bus."],["何分ぐらいですか。","About how many minutes?"],["十五分ぐらいです。","About fifteen minutes."]],
  checks:[
   ["いつもはバスで行きます。今日は歩いて行きます。 What changed?","Travel method","The speaker's name","The price of tea","The method changes from bus to walking."],
   ["Which asks for approximate travel duration?","何分ぐらいですか。","これはいくらですか。","この人はだれですか。","何分ぐらい asks roughly how many minutes."],
   ["Friend: 今日は駅まで歩いて行きます. Which response matches the new plan?","They walk to the station today","They take a bus today","They travel to the library today","歩いて is on foot, and 駅まで marks the station endpoint."],
   ["Friend: 十五分ぐらいです. What must you avoid claiming?","An exact guaranteed arrival time","An approximate fifteen-minute duration","The speaker is estimating","ぐらい means about, not a schedule guarantee."]
  ],
  recall:["Write 'How many minutes approximately?' using 何分.","何分ぐらいですか。"],
  writing:"Write a five-turn conversation in which a familiar route changes from bus to walking, someone asks for the new travel time, and the traveller gives a clearly approximate answer. End by checking the new mode and destination."},
 {id:"cf-a1-18-06",title:"Original station travel conversation",
  scene:"transport",objective:"Understand the original Mina–Ken station journey, distinguish バスで from 駅まで and complete native E02 transfer and review."}
 ]};
