import type {StudyPrompt} from "@thiepn/study-player";
import {p34AcceptedRoleAnswers} from "./alternatives34";
import {p35RoleContinuation} from "./turns35";
import {p35AcceptedRoleAnswers} from "./alternatives35";
export interface P33RoleTurn{partner:string;meaning:string;model:string;gloss:string;}
export interface P33Role{ id:"guest"|"host";label:string;turns:readonly P33RoleTurn[]; }
export interface P33RoleScenario{id:string;unitId:string;title:string;roles:readonly P33Role[];}
/** First-party original A1/A2 role-switch lessons. Each path has two successive turns. */
export const p33RoleScenarios:readonly P33RoleScenario[]=[
  {
    "id": "station-questions",
    "unitId": "p26:station-to-campus",
    "title": "Bahnhof und Universität",
    "roles": [
      {
        "id": "guest",
        "label": "Reisender",
        "turns": [
          {
            "partner": "大学へはどう行きますか。",
            "meaning": "Wie komme ich zur Universität?",
            "model": "バスで大学に行きます。",
            "gloss": "Ich fahre mit dem Bus zur Universität."
          },
          {
            "partner": "何時に出発しますか。",
            "meaning": "Wann fahren Sie los?",
            "model": "九時に出発します。",
            "gloss": "Ich fahre um neun los."
          }
        ]
      },
      {
        "id": "host",
        "label": "Auskunftsperson",
        "turns": [
          {
            "partner": "大学にはどうやって行きますか。",
            "meaning": "Wie kommt man zur Universität?",
            "model": "駅からバスで行きます。",
            "gloss": "Vom Bahnhof mit dem Bus."
          },
          {
            "partner": "乗り場はどこですか。",
            "meaning": "Wo ist der Bussteig?",
            "model": "あちらにあります。",
            "gloss": "Dort drüben."
          }
        ]
      }
    ]
  },
  {
    "id": "library-study",
    "unitId": "p26:library-project",
    "title": "Gruppenarbeit und Bibliothek",
    "roles": [
      {
        "id": "guest",
        "label": "Studierender",
        "turns": [
          {
            "partner": "どんな本を探していますか。",
            "meaning": "Was für ein Buch suchen Sie?",
            "model": "日本語の本を探しています。",
            "gloss": "Ich suche ein Japanischbuch."
          },
          {
            "partner": "この本を借りますか。",
            "meaning": "Leihen Sie dieses Buch aus?",
            "model": "はい、借りたいです。",
            "gloss": "Ja, gerne."
          }
        ]
      },
      {
        "id": "host",
        "label": "Bibliotheksmitarbeiter",
        "turns": [
          {
            "partner": "この本を借りてもいいですか。",
            "meaning": "Darf ich dieses Buch ausleihen?",
            "model": "はい、どうぞ。",
            "gloss": "Ja, bitte."
          },
          {
            "partner": "いつ返せばいいですか。",
            "meaning": "Wann soll ich es zurückgeben?",
            "model": "来週までに返してください。",
            "gloss": "Bis nächste Woche, bitte."
          }
        ]
      }
    ]
  },
  {
    "id": "cafe-fix",
    "unitId": "p26:cafe-conversation",
    "title": "Bestellung und höfliche Korrektur",
    "roles": [
      {
        "id": "guest",
        "label": "Kunde",
        "turns": [
          {
            "partner": "ご注文は何ですか。",
            "meaning": "Was möchten Sie bestellen?",
            "model": "コーヒーを一つお願いします。",
            "gloss": "Einen Kaffee bitte."
          },
          {
            "partner": "ケーキもいかがですか。",
            "meaning": "Möchten Sie Kuchen?",
            "model": "いいえ、結構です。",
            "gloss": "Nein, danke."
          }
        ]
      },
      {
        "id": "host",
        "label": "Servicekraft",
        "turns": [
          {
            "partner": "コーヒーを二つお願いします。",
            "meaning": "Zwei Kaffee bitte.",
            "model": "かしこまりました。二つですね。",
            "gloss": "Sehr gerne, zwei also."
          },
          {
            "partner": "すみません、一つだけです。",
            "meaning": "Entschuldigung, nur einer.",
            "model": "失礼しました。一つですね。",
            "gloss": "Entschuldigung, einer also."
          }
        ]
      }
    ]
  },
  {
    "id": "appointment-shift",
    "unitId": "p25:appointment",
    "title": "Termin und Gegenangebot",
    "roles": [
      {
        "id": "guest",
        "label": "Einladender",
        "turns": [
          {
            "partner": "金曜日はどうですか。",
            "meaning": "Wie wäre Freitag?",
            "model": "金曜日なら大丈夫です。",
            "gloss": "Freitag passt."
          },
          {
            "partner": "何時に会いますか。",
            "meaning": "Um wie viel Uhr treffen wir uns?",
            "model": "三時に会いましょう。",
            "gloss": "Treffen wir uns um drei."
          }
        ]
      },
      {
        "id": "host",
        "label": "Eingeladener",
        "turns": [
          {
            "partner": "土曜日に会いませんか。",
            "meaning": "Wollen wir uns Samstag treffen?",
            "model": "すみません、土曜日は予定があります。",
            "gloss": "Entschuldigung, Samstag habe ich etwas vor."
          },
          {
            "partner": "では、日曜日はどうですか。",
            "meaning": "Wie wäre Sonntag?",
            "model": "日曜日なら大丈夫です。",
            "gloss": "Sonntag passt."
          }
        ]
      }
    ]
  },
  {
    "id": "umbrella-owner",
    "unitId": "p25:lostfound",
    "title": "Verlorener Schirm",
    "roles": [
      {
        "id": "guest",
        "label": "Suchender",
        "turns": [
          {
            "partner": "どんな傘ですか。",
            "meaning": "Was für ein Schirm ist es?",
            "model": "黒い傘です。",
            "gloss": "Ein schwarzer Schirm."
          },
          {
            "partner": "どこでなくしましたか。",
            "meaning": "Wo haben Sie ihn verloren?",
            "model": "駅でなくしました。",
            "gloss": "Am Bahnhof."
          }
        ]
      },
      {
        "id": "host",
        "label": "Fundbüro",
        "turns": [
          {
            "partner": "傘をなくしたんですが。",
            "meaning": "Ich habe einen Schirm verloren.",
            "model": "どんな傘ですか。",
            "gloss": "Was für ein Schirm?"
          },
          {
            "partner": "黒い傘です。",
            "meaning": "Ein schwarzer Schirm.",
            "model": "わかりました。探してみます。",
            "gloss": "Verstanden, ich suche danach."
          }
        ]
      }
    ]
  },
  {
    "id": "shop-colors",
    "unitId": "p25:shopping",
    "title": "Preis und andere Farbe",
    "roles": [
      {
        "id": "guest",
        "label": "Kunde",
        "turns": [
          {
            "partner": "何を探していますか。",
            "meaning": "Was suchen Sie?",
            "model": "赤いかばんを探しています。",
            "gloss": "Ich suche eine rote Tasche."
          },
          {
            "partner": "このかばんはいかがですか。",
            "meaning": "Wie wäre diese Tasche?",
            "model": "ありがとうございます。いくらですか。",
            "gloss": "Danke, wie viel kostet sie?"
          }
        ]
      },
      {
        "id": "host",
        "label": "Verkäufer",
        "turns": [
          {
            "partner": "このかばんはいくらですか。",
            "meaning": "Wie viel kostet diese Tasche?",
            "model": "三千円です。",
            "gloss": "Dreitausend Yen."
          },
          {
            "partner": "ほかの色もありますか。",
            "meaning": "Gibt es noch andere Farben?",
            "model": "はい、青いのもあります。",
            "gloss": "Ja, auch eine blaue."
          }
        ]
      }
    ]
  },
  {
    "id": "campus-greeting",
    "unitId": "p23:introduction",
    "title": "Neues Kursmitglied",
    "roles": [
      {
        "id": "guest",
        "label": "Neuer Student",
        "turns": [
          {
            "partner": "お名前は何ですか。",
            "meaning": "Wie heißen Sie?",
            "model": "私はアキです。",
            "gloss": "Ich heiße Aki."
          },
          {
            "partner": "どこで勉強していますか。",
            "meaning": "Wo studieren Sie?",
            "model": "大学で勉強しています。",
            "gloss": "An der Universität."
          }
        ]
      },
      {
        "id": "host",
        "label": "Tutor",
        "turns": [
          {
            "partner": "初めまして。お名前は何ですか。",
            "meaning": "Freut mich. Wie heißen Sie?",
            "model": "ユキです。よろしくお願いします。",
            "gloss": "Ich heiße Yuki, freut mich."
          },
          {
            "partner": "日本語を勉強していますか。",
            "meaning": "Lernen Sie Japanisch?",
            "model": "はい、毎日勉強しています。",
            "gloss": "Ja, jeden Tag."
          }
        ]
      }
    ]
  },
  {
    "id": "weekend-invite",
    "unitId": "p26:weekend-switch",
    "title": "Einladung und Verschiebung",
    "roles": [
      {
        "id": "guest",
        "label": "Einladender",
        "turns": [
          {
            "partner": "日曜日は空いていますか。",
            "meaning": "Hast du Sonntag Zeit?",
            "model": "はい、大丈夫です。",
            "gloss": "Ja, passt."
          },
          {
            "partner": "何をしたいですか。",
            "meaning": "Was möchtest du unternehmen?",
            "model": "映画を見たいです。",
            "gloss": "Ich möchte einen Film sehen."
          }
        ]
      },
      {
        "id": "host",
        "label": "Freund",
        "turns": [
          {
            "partner": "土曜日に映画を見ませんか。",
            "meaning": "Wollen wir Samstag ins Kino?",
            "model": "土曜日はちょっと難しいです。",
            "gloss": "Samstag ist schwierig."
          },
          {
            "partner": "では、日曜日はどうですか。",
            "meaning": "Wie wäre Sonntag?",
            "model": "いいですね。",
            "gloss": "Klingt gut."
          }
        ]
      }
    ]
  }
];
/**
 * Extend the inherited authored paths without modifying the original role data.
 * Existing turn indices 0–1 and their cue families are unchanged.
 */
export const p35ExtendedRoleScenarios:P33RoleScenario[]=p33RoleScenarios.map(s=>({
  ...s,
  roles:s.roles.map(role=>{
    const extra=p35RoleContinuation(s.id,role.id);
    return {...role,turns:extra?[...role.turns,{
      partner:extra.partner,meaning:extra.meaning,model:extra.model,gloss:extra.gloss
    }]:role.turns};
  })
}));
export const p33RolePrompts:StudyPrompt[]=p35ExtendedRoleScenarios.flatMap(s=>s.roles.flatMap(role=>
  role.turns.map((turn,index)=>({
    id:"p33-role-"+s.id+"-"+role.id+"-"+index,
    primaryTarget:{kind:"can_do" as const,id:"p33:role:"+s.id},
    skill:"production" as const,cueFamily:"p33-role-"+role.id+"-"+index,
    promptType:"typed" as const,
    instruction:"In der eigenen Gesprächsrolle auf Japanisch antworten",
    prompt:turn.partner,
    acceptedAnswers:[...new Set([...p34AcceptedRoleAnswers(s.id,role.id,index,turn.model),
      ...p35AcceptedRoleAnswers(s.id,role.id,index)])],displayAnswer:turn.model,
    explanation:turn.gloss,answerNormalization:"japanese" as const,
    promptLanguage:"ja" as const,contextId:"p33:role:"+s.id,
    sourceId:"thiepn-original",contentVersion:"p33-1",
    eventMetadata:{p33:true,kind:"role-response",unitId:s.unitId,scenarioId:s.id,role:role.id,turnIndex:index}
  }))
));
export function p33RolesForUnit(unitId:string):P33RoleScenario[]{
  return p35ExtendedRoleScenarios.filter(s=>s.unitId===unitId);
}
