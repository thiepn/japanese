import type {CourseFirstUnit} from "./courseAuthoring";

/** Original C7 authored material; the existing E02 capstone retains native IDs. */
export const C7_A1_EXCHANGE:CourseFirstUnit={
  "id": "a1-unit-20",
  "title": "Connected everyday conversations",
  "objective": "Respond appropriately to shared observations and new information, read linked weather-and-plan conversations, and repair communication without inventing missing facts.",
  "lessons": [
    {
      "id": "cf-a1-20-01",
      "title": "Agreeing or learning something new",
      "objective": "Choose そうですね for shared agreement and そうですか for acknowledgment of new information.",
      "teach": "Japanese short responses express different conversational relationships. そうですね means 'That's right, isn't it?' or 'Yes, indeed' and commonly agrees with a shared observation. そうですか means 'I see' when you have just learned something. If someone says 今日は寒いですね and you also feel cold, そうですね agrees. If they tell you 明日は暖かいですよ and you did not know, そうですか acknowledges the news. Selecting one just because both start with そう misses the meaning.",
      "examples": [
        [
          "今日は寒いですね。",
          "It's cold today, isn't it?"
        ],
        [
          "そうですね。",
          "Yes, indeed."
        ],
        [
          "明日は暖かいですよ。",
          "Tomorrow will be warm, you know."
        ],
        [
          "そうですか。",
          "I see."
        ]
      ],
      "checks": [
        [
          "ミナ：今日は寒いですね。 You agree from your own observation. Choose the reply.",
          "そうですね。",
          "そうですか。",
          "水をください。",
          "そうですね signals agreement with something both speakers recognize."
        ],
        [
          "ケン：明日は暖かいですよ。 This is news to you. Choose the reply.",
          "そうですか。",
          "そうですね。",
          "はい、切符をください。",
          "そうですか acknowledges information you did not previously know."
        ],
        [
          "Which response is more like 'Yes, that's right' than 'I see'?",
          "そうですね。",
          "そうですか。",
          "もう一度言ってください。",
          "ね adds shared agreement, unlike か in そうですか."
        ],
        [
          "Which response does NOT itself mean you agree with the information?",
          "そうですか。",
          "そうですね。",
          "はい、そうです。",
          "そうですか primarily acknowledges what you have heard."
        ]
      ],
      "recall": [
        "Write the short response 'I see' to new information.",
        "そうですか。"
      ],
      "writing": "Write two original three-turn dialogues: one where speakers agree about something jointly observed, and another where one speaker learns new information. Use different short responses."
    },
    {
      "id": "cf-a1-20-02",
      "title": "Today, tomorrow, and what changes",
      "objective": "Distinguish 今日 from 明日 and 寒い from 暖かい in connected statements.",
      "teach": "Weather statements become confusing when the day shifts. 今日（きょう）is today and 明日（あした）is tomorrow. 今日は寒いです describes today as cold; 明日は暖かいです describes tomorrow as warm. The ending です keeps the statement polite. A forecast-style claim in these dialogues is fictional practice, not a real weather prediction. Do not apply tomorrow's adjective to today's weather simply because the same person mentions both days.",
      "examples": [
        [
          "今日は寒いです。",
          "It is cold today."
        ],
        [
          "明日は暖かいです。",
          "It will be warm tomorrow."
        ],
        [
          "今日は暑いですね。",
          "It's hot today, isn't it?"
        ],
        [
          "明日は寒いですよ。",
          "Tomorrow will be cold, you know."
        ]
      ],
      "checks": [
        [
          "ミナ：今日は寒いです。明日は暖かいです。 Which day is cold in this story?",
          "Today",
          "Tomorrow",
          "Both days",
          "今日 is today and matches 寒い."
        ],
        [
          "Which phrase means 'tomorrow'?",
          "明日",
          "今日",
          "昨日",
          "明日 means tomorrow; 今日 means today."
        ],
        [
          "Which adjective expresses warmth, not cold?",
          "暖かい",
          "寒い",
          "暑い",
          "暖かい is warm; 寒い means cold."
        ],
        [
          "If someone says 明日は寒いですよ, which statement matches?",
          "Tomorrow is expected to be cold in this fictional exchange",
          "It is cold yesterday",
          "Tomorrow is guaranteed to be hot",
          "明日 refers to tomorrow and 寒い means cold."
        ]
      ],
      "recall": [
        "Write 'It will be warm tomorrow' using 明日.",
        "明日は暖かいです。"
      ],
      "writing": "Write a four-sentence fictional mini-weather report contrasting two days and two temperatures. Make a separate note that the statements are an invented exercise rather than a live forecast."
    },
    {
      "id": "cf-a1-20-03",
      "title": "ね and よ carry different intentions",
      "objective": "Use sentence-final ね for shared confirmation and よ for informing a listener.",
      "teach": "The sentence endings ね and よ do more than add decoration. 今日は寒いですね invites agreement about a shared observation. 明日は暖かいですよ presents the speaker's information to the listener. Neither particle guarantees the speaker's prediction is correct. In a friendly exchange, ね often encourages the other person to join in, whereas よ marks something the speaker wants to convey. そうですね and そうですか may follow, but they express different reactions.",
      "examples": [
        [
          "今日は寒いですね。",
          "It's cold today, isn't it?"
        ],
        [
          "そうですね。",
          "Yes, it is."
        ],
        [
          "明日は暖かいですよ。",
          "Tomorrow will be warm, you know."
        ],
        [
          "そうですか。ありがとうございます。",
          "I see. Thank you."
        ]
      ],
      "checks": [
        [
          "Which ending naturally invites agreement with shared cold weather?",
          "ね",
          "よ",
          "を",
          "ね seeks shared recognition or agreement."
        ],
        [
          "A speaker provides tomorrow's temperature as new information. Which ending often fits?",
          "よ",
          "を",
          "まで",
          "よ can draw the listener's attention to new information."
        ],
        [
          "ミナ：今日は寒いですね。ケン：そうですね。 How does Ken respond?",
          "He agrees with the observation",
          "He says he did not hear it",
          "He requests a ticket",
          "そうですね is a shared agreeing response."
        ],
        [
          "ケン：明日は暖かいですよ。ミナ：そうですか。 What does Mina communicate?",
          "She acknowledges the new information",
          "She orders warm tea",
          "She guarantees tomorrow's forecast",
          "そうですか means 'I see'; it does not certify the forecast."
        ]
      ],
      "recall": [
        "Write 'It's cold today, isn't it?' using ね.",
        "今日は寒いですね。"
      ],
      "writing": "Write two short exchanges around one shared observation and one piece of new information. Deliberately use ね and よ for different communicative purposes; have the listener respond appropriately."
    },
    {
      "id": "cf-a1-20-04",
      "title": "Read two linked conversations",
      "objective": "Retrieve speakers, days and reactions from an original connected weather-and-plan passage.",
      "teach": "Read two original conversations. 『ミナ：今日は寒いですね。ケン：そうですね。明日は暖かいですよ。ミナ：そうですか。』 Then 『ユナ：明日、図書館に行きます。アリ：何時に行きますか。ユナ：十時に行きます。』 The first exchange talks about weather on different days; the second talks about Yuna's planned library visit tomorrow. Nothing in the text states whether the library is warm or who else will accompany her. Combine speaker, day and verb before choosing an answer.",
      "examples": [
        [
          "今日は寒いですね。",
          "It's cold today, isn't it?"
        ],
        [
          "明日は暖かいですよ。",
          "Tomorrow will be warm, you know."
        ],
        [
          "明日、図書館に行きます。",
          "I will go to the library tomorrow."
        ],
        [
          "十時に行きます。",
          "I will go at ten o'clock."
        ]
      ],
      "checks": [
        [
          "Who explicitly says tomorrow will be warm in the first conversation?",
          "Ken",
          "Mina",
          "Yuna",
          "Ken says 明日は暖かいですよ."
        ],
        [
          "When does Yuna say she will go to the library?",
          "Tomorrow at ten",
          "Today at nine",
          "Yesterday at ten",
          "明日 sets the day and 十時に sets the time."
        ],
        [
          "How does Mina respond after Ken's new information?",
          "そうですか。",
          "もう一度言ってください。",
          "水をください。",
          "She acknowledges the information with そうですか."
        ],
        [
          "Which detail is NOT stated in the connected passages?",
          "Whether the library is warm",
          "Yuna's planned destination",
          "The day of Yuna's visit",
          "No sentence describes the library's temperature."
        ]
      ],
      "recall": [
        "Write 'I will go to the library tomorrow' using 明日.",
        "明日、図書館に行きます。"
      ],
      "writing": "Write two original connected mini-conversations about tomorrow: one about a shared observation and a changed expectation, and the other about a meeting destination and time. Include two comprehension questions whose answers are directly supported."
    },
    {
      "id": "cf-a1-20-05",
      "title": "Repair a broken conversation",
      "objective": "Ask for clarification, confirm a changed time and react without pretending to understand.",
      "teach": "Conversation repair connects earlier lessons. Imagine: 『ユナ：明日、十時に図書館に行きます。ケン：すみません。もう一度言ってください。ユナ：明日、十時です。ケン：十時ですね。ユナ：はい。』 Ken does not ask Yuna to buy anything; he needs the time repeated, then checks it. If Ken had heard nine, he should not simply agree. Once the information has been confirmed, 分かりました may close the repair. In a new context, the same sequence can clarify a station platform number or a meeting time.",
      "examples": [
        [
          "もう一度言ってください。",
          "Please say it again."
        ],
        [
          "明日、十時です。",
          "Tomorrow, at ten."
        ],
        [
          "十時ですね。",
          "Ten o'clock, right?"
        ],
        [
          "分かりました。ありがとうございます。",
          "Understood. Thank you."
        ]
      ],
      "checks": [
        [
          "Ken missed the time and needs it repeated. Which is a suitable request?",
          "もう一度言ってください。",
          "図書館をください。",
          "今日は買いません。",
          "The issue is unheard speech, so the action request is appropriate."
        ],
        [
          "Yuna repeats 十時. Which question accurately checks the time?",
          "十時ですね。",
          "九時ですね。",
          "三百円ですね。",
          "A confirmation should repeat ten, not change it."
        ],
        [
          "If Ken is still uncertain after the repeat, which is the safest response?",
          "Ask again or confirm before agreeing",
          "Pretend the time was nine",
          "Buy a ticket",
          "Do not agree to information you did not understand."
        ],
        [
          "Once the repeated time is confirmed, which closing fits?",
          "分かりました。ありがとうございます。",
          "このノートはいくらですか。",
          "明日は寒いですね。",
          "分かりました acknowledges understanding and thanks the speaker."
        ]
      ],
      "recall": [
        "Write 'Ten o'clock, right?' using 十時.",
        "十時ですね。"
      ],
      "writing": "Create a six-turn original dialogue about a changed meeting or travel time: one speaker misses the correction, asks for repetition, confirms the correct new time, and closes politely. Make the final agreed time explicit."
    },
    {
      "id": "cf-a1-20-06",
      "title": "Independent weather conversation",
      "scene": "exchange",
      "objective": "Complete the original E02 weather-and-plans conversation using accurate ね／よ responses, acknowledgment and native delayed review."
    }
  ]
};
