import type {ContinuityScenario} from "./continuity28";

/** Original learner dialogue additions, author-qualified A1/A2 utterances only. */
export const p31ContinuityScenarios:readonly ContinuityScenario[]=[
  {
    "id": "umbrella-borrow",
    "sourceUnitId": "p23:ownership",
    "destinationUnitId": "p25:lostfound",
    "title": "Besitz klären und Schirm wiederfinden",
    "situation": "Nach dem Unterricht liegt ein Regenschirm im Raum. Du musst klären, wem er gehört.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "この傘はあなたのですか。",
        "meaning": "Ist dieser Schirm deiner?",
        "choices": [
          {
            "japanese": "はい、私のです。",
            "meaning": "Ja, meiner.",
            "next": "one",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "いいえ、私のではありません。",
            "meaning": "Nein, nicht meiner.",
            "next": "two",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "映画を見ました。",
            "meaning": "Ich habe einen Film gesehen.",
            "next": "start",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      },
      {
        "id": "one",
        "partner": "どこに置きましたか。",
        "meaning": "Wo hast du ihn hingelegt?",
        "choices": [
          {
            "japanese": "教室に置きました。",
            "meaning": "Im Klassenraum.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "駅に置きました。",
            "meaning": "Am Bahnhof.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "お茶をください。",
            "meaning": "Tee bitte.",
            "next": "one",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      },
      {
        "id": "two",
        "partner": "だれの傘か知っていますか。",
        "meaning": "Weißt du, wessen Schirm das ist?",
        "choices": [
          {
            "japanese": "先生のかもしれません。",
            "meaning": "Vielleicht der Lehrkraft.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "わかりません。",
            "meaning": "Ich weiß es nicht.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "九時に出ます。",
            "meaning": "Ich fahre um neun.",
            "next": "two",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      },
      {
        "id": "end",
        "partner": "届けてくれてありがとうございます。",
        "meaning": "Danke, dass du ihn abgegeben hast.",
        "choices": [
          {
            "japanese": "どういたしまして。",
            "meaning": "Gern geschehen.",
            "next": null,
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "よかったです。",
            "meaning": "Gut so.",
            "next": null,
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "いくらですか。",
            "meaning": "Wie viel kostet es?",
            "next": "end",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      }
    ]
  },
  {
    "id": "routine-study",
    "sourceUnitId": "p23:routine",
    "destinationUnitId": "p26:library-project",
    "title": "Aus einer Lernroutine wird ein Gruppenplan",
    "situation": "Eine andere Kursteilnehmerin möchte wissen, wie und wann du Japanisch lernst.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "いつ日本語を勉強しますか。",
        "meaning": "Wann lernst du Japanisch?",
        "choices": [
          {
            "japanese": "毎朝勉強します。",
            "meaning": "Jeden Morgen.",
            "next": "one",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "夜に勉強します。",
            "meaning": "Am Abend.",
            "next": "two",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "黒い傘です。",
            "meaning": "Ein schwarzer Schirm.",
            "next": "start",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      },
      {
        "id": "one",
        "partner": "図書館でも勉強しますか。",
        "meaning": "Lernst du auch in der Bibliothek?",
        "choices": [
          {
            "japanese": "はい、よく行きます。",
            "meaning": "Ja, oft.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "週末なら行けます。",
            "meaning": "Am Wochenende kann ich kommen.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "カフェで払います。",
            "meaning": "Ich bezahle im Café.",
            "next": "one",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      },
      {
        "id": "two",
        "partner": "何時から勉強しますか。",
        "meaning": "Um wie viel Uhr fängst du an zu lernen?",
        "choices": [
          {
            "japanese": "七時からです。",
            "meaning": "Ab sieben.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "八時から勉強します。",
            "meaning": "Ich lerne ab acht.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "右に曲がります。",
            "meaning": "Ich biege rechts ab.",
            "next": "two",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      },
      {
        "id": "end",
        "partner": "今度、一緒に勉強しませんか。",
        "meaning": "Wollen wir demnächst zusammen lernen?",
        "choices": [
          {
            "japanese": "いいですね。",
            "meaning": "Gute Idee.",
            "next": null,
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "金曜日はどうですか。",
            "meaning": "Wie wäre Freitag?",
            "next": null,
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "これは私のです。",
            "meaning": "Das gehört mir.",
            "next": "end",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      }
    ]
  },
  {
    "id": "cafe-study",
    "sourceUnitId": "p23:cafe",
    "destinationUnitId": "p26:cafe-conversation",
    "title": "Bestellung, Nachfrage und Bezahlung",
    "situation": "Im Café bestellst du und reagierst auf eine Rückfrage zum Getränk.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "何を飲みますか。",
        "meaning": "Was möchtest du trinken?",
        "choices": [
          {
            "japanese": "お茶をください。",
            "meaning": "Tee bitte.",
            "next": "one",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "コーヒーをお願いします。",
            "meaning": "Kaffee bitte.",
            "next": "two",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "図書館はどこですか。",
            "meaning": "Wo ist die Bibliothek?",
            "next": "start",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      },
      {
        "id": "one",
        "partner": "温かいお茶ですか。",
        "meaning": "Warmen Tee?",
        "choices": [
          {
            "japanese": "はい、温かいお茶をお願いします。",
            "meaning": "Ja, warmen Tee bitte.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "冷たいお茶がいいです。",
            "meaning": "Lieber kalten Tee.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "バスで行きます。",
            "meaning": "Ich fahre mit dem Bus.",
            "next": "one",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      },
      {
        "id": "two",
        "partner": "ミルクはいりますか。",
        "meaning": "Möchtest du Milch?",
        "choices": [
          {
            "japanese": "いいえ、大丈夫です。",
            "meaning": "Nein, danke.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "はい、お願いします。",
            "meaning": "Ja, bitte.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "来週返します。",
            "meaning": "Nächste Woche gebe ich es zurück.",
            "next": "two",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      },
      {
        "id": "end",
        "partner": "お会計は千円です。",
        "meaning": "Die Rechnung beträgt tausend Yen.",
        "choices": [
          {
            "japanese": "ありがとうございます。",
            "meaning": "Vielen Dank.",
            "next": null,
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "カードで払ってもいいですか。",
            "meaning": "Kann ich mit Karte bezahlen?",
            "next": null,
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "先生はどこですか。",
            "meaning": "Wo ist die Lehrkraft?",
            "next": "end",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      }
    ]
  },
  {
    "id": "weekend-report",
    "sourceUnitId": "p23:past",
    "destinationUnitId": "p26:weekend-switch",
    "title": "Von gestern zu nächstem Wochenende",
    "situation": "Ihr sprecht über das letzte Wochenende und entwickelt spontan neue Pläne.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "先週末は何をしましたか。",
        "meaning": "Was hast du letztes Wochenende gemacht?",
        "choices": [
          {
            "japanese": "映画を見ました。",
            "meaning": "Ich habe einen Film gesehen.",
            "next": "one",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "図書館で勉強しました。",
            "meaning": "Ich habe in der Bibliothek gelernt.",
            "next": "two",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "明日行きます。",
            "meaning": "Ich gehe morgen.",
            "next": "start",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      },
      {
        "id": "one",
        "partner": "どんな映画を見ましたか。",
        "meaning": "Was für einen Film hast du gesehen?",
        "choices": [
          {
            "japanese": "日本の映画を見ました。",
            "meaning": "Einen japanischen Film.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "友達と映画を見ました。",
            "meaning": "Mit einem Freund einen Film.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "今は九時です。",
            "meaning": "Es ist neun Uhr.",
            "next": "one",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      },
      {
        "id": "two",
        "partner": "大変でしたか。",
        "meaning": "War es anstrengend?",
        "choices": [
          {
            "japanese": "はい、少し大変でした。",
            "meaning": "Ja, etwas.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "いいえ、楽しかったです。",
            "meaning": "Nein, es hat Spaß gemacht.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "お茶をください。",
            "meaning": "Tee bitte.",
            "next": "two",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      },
      {
        "id": "end",
        "partner": "今週末、一緒に出かけませんか。",
        "meaning": "Wollen wir am Wochenende etwas unternehmen?",
        "choices": [
          {
            "japanese": "土曜日なら大丈夫です。",
            "meaning": "Samstag passt.",
            "next": null,
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "日曜日はどうですか。",
            "meaning": "Wie wäre Sonntag?",
            "next": null,
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "学生です。",
            "meaning": "Ich bin Student.",
            "next": "end",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      }
    ]
  },
  {
    "id": "shopping-choice",
    "sourceUnitId": "p25:shopping",
    "destinationUnitId": "p26:cafe-conversation",
    "title": "Einkauf ändern und anschließend ins Café",
    "situation": "Im Laden findest du die gesuchte Größe nicht; danach schlägst du eine Pause vor.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "どの色がいいですか。",
        "meaning": "Welche Farbe möchtest du?",
        "choices": [
          {
            "japanese": "青いのがいいです。",
            "meaning": "Ich möchte das Blaue.",
            "next": "one",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "赤いのがいいです。",
            "meaning": "Ich möchte das Rote.",
            "next": "two",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "学校に行きます。",
            "meaning": "Ich gehe zur Schule.",
            "next": "start",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      },
      {
        "id": "one",
        "partner": "青いのは少し高いです。",
        "meaning": "Das Blaue ist etwas teuer.",
        "choices": [
          {
            "japanese": "では、赤いのはありますか。",
            "meaning": "Gibt es dann das Rote?",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "もう少し安いのはありますか。",
            "meaning": "Gibt es etwas Günstigeres?",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "九時に勉強します。",
            "meaning": "Ich lerne um neun.",
            "next": "one",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      },
      {
        "id": "two",
        "partner": "赤いのは売り切れです。",
        "meaning": "Das Rote ist ausverkauft.",
        "choices": [
          {
            "japanese": "では、青いのを見せてください。",
            "meaning": "Zeigen Sie mir das Blaue.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "ほかの色はありますか。",
            "meaning": "Gibt es andere Farben?",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "駅は遠いです。",
            "meaning": "Der Bahnhof ist weit.",
            "next": "two",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      },
      {
        "id": "end",
        "partner": "あとでカフェに行きませんか。",
        "meaning": "Wollen wir später ins Café gehen?",
        "choices": [
          {
            "japanese": "いいですね、行きましょう。",
            "meaning": "Gute Idee, gehen wir.",
            "next": null,
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "すみません、今日はちょっと。",
            "meaning": "Heute passt es leider nicht.",
            "next": null,
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "本を返しました。",
            "meaning": "Ich gab das Buch zurück.",
            "next": "end",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      }
    ]
  },
  {
    "id": "cafe-polite-fix",
    "sourceUnitId": "p26:cafe-conversation",
    "destinationUnitId": "p25:appointment",
    "title": "Bestellung berichtigen und Wartezeit klären",
    "situation": "Der Service hat deine Bestellung missverstanden und die Pause dauert länger als geplant.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "コーヒーは二つですね。",
        "meaning": "Zwei Kaffee, richtig?",
        "choices": [
          {
            "japanese": "はい、二つです。",
            "meaning": "Ja, zwei.",
            "next": "one",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "いいえ、一つだけです。",
            "meaning": "Nein, nur einer.",
            "next": "two",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "明日図書館です。",
            "meaning": "Morgen Bibliothek.",
            "next": "start",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      },
      {
        "id": "one",
        "partner": "二つでよろしいですか。",
        "meaning": "Sind zwei in Ordnung?",
        "choices": [
          {
            "japanese": "はい、お願いします。",
            "meaning": "Ja, bitte.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "一つは友達のです。",
            "meaning": "Einer ist für meinen Freund.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "金曜日です。",
            "meaning": "Es ist Freitag.",
            "next": "one",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      },
      {
        "id": "two",
        "partner": "すみません。一つですね。",
        "meaning": "Entschuldigung, einer also.",
        "choices": [
          {
            "japanese": "はい、ありがとうございます。",
            "meaning": "Ja, vielen Dank.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "そうです。一つだけです。",
            "meaning": "Genau, nur einer.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "電車で行きます。",
            "meaning": "Ich fahre mit dem Zug.",
            "next": "one",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      },
      {
        "id": "end",
        "partner": "少しお待ちください。",
        "meaning": "Warten Sie bitte kurz.",
        "choices": [
          {
            "japanese": "はい、大丈夫です。",
            "meaning": "Ja, kein Problem.",
            "next": null,
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "どれぐらいかかりますか。",
            "meaning": "Wie lange wird es dauern?",
            "next": null,
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "赤いのをください。",
            "meaning": "Das Rote bitte.",
            "next": "end",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      }
    ]
  },
  {
    "id": "weather-reschedule",
    "sourceUnitId": "p26:weekend-switch",
    "destinationUnitId": "p25:appointment",
    "title": "Wetterwechsel und Terminabstimmung",
    "situation": "Wegen Regen muss ein Wochenendausflug verschoben werden.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "土曜日は雨が降りそうです。",
        "meaning": "Am Samstag wird es vermutlich regnen.",
        "choices": [
          {
            "japanese": "じゃあ、日曜日はどうですか。",
            "meaning": "Wie wäre Sonntag?",
            "next": "one",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "では、映画を見ませんか。",
            "meaning": "Sehen wir einen Film?",
            "next": "two",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "これは私の傘です。",
            "meaning": "Das ist mein Schirm.",
            "next": "start",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      },
      {
        "id": "one",
        "partner": "日曜日は何時に会いますか。",
        "meaning": "Um wie viel Uhr treffen wir uns Sonntag?",
        "choices": [
          {
            "japanese": "三時に会いましょう。",
            "meaning": "Treffen wir uns um drei.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "四時はどうですか。",
            "meaning": "Wie wäre vier?",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "お茶は冷たいです。",
            "meaning": "Der Tee ist kalt.",
            "next": "one",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      },
      {
        "id": "two",
        "partner": "どこで映画を見ますか。",
        "meaning": "Wo sehen wir den Film?",
        "choices": [
          {
            "japanese": "駅の近くの映画館はどうですか。",
            "meaning": "Wie wäre das Kino am Bahnhof?",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "家で見ましょう。",
            "meaning": "Sehen wir ihn zu Hause.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "大学にいます。",
            "meaning": "Ich bin an der Uni.",
            "next": "one",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      },
      {
        "id": "end",
        "partner": "では、その予定にしましょう。",
        "meaning": "Dann machen wir das so.",
        "choices": [
          {
            "japanese": "楽しみにしています。",
            "meaning": "Ich freue mich darauf.",
            "next": null,
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "はい、また週末に。",
            "meaning": "Ja, bis zum Wochenende.",
            "next": null,
            "appropriate": true,
            "note": "Eine passende Antwort; der Gesprächspartner greift diese Entscheidung im nächsten Schritt auf."
          },
          {
            "japanese": "これを借りてもいいですか。",
            "meaning": "Darf ich das ausleihen?",
            "next": "end",
            "appropriate": false,
            "note": "Diese Aussage passt nicht zur aktuellen Frage; du kannst erneut reagieren."
          }
        ]
      }
    ]
  }
];
