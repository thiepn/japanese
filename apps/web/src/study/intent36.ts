/** Source-owned original next-topic transitions for existing P33/P35 roles.
 * Choosing a German intent provides scaffolding: both free replies are
 * ungraded, and no new StudyPrompt or FSRS cue is manufactured. */
export interface P36IntentPath{
  id:string;goal:string;firstModel:string;partner:string;partnerMeaning:string;
  secondModel:string;explanation:string;
}
export interface P36IntentScenario{
  scenarioId:string;role:"guest"|"host";paths:readonly P36IntentPath[];
}
export const p36IntentScenarios:readonly P36IntentScenario[]=[
  {
    "scenarioId": "station-questions",
    "role": "guest",
    "paths": [
      {
        "id": "intent-1",
        "goal": "Nach einer alternativen Busverbindung fragen",
        "firstModel": "ほかのバスもありますか。",
        "partner": "はい、十時のバスもあります。",
        "partnerMeaning": "Wann fährt der andere Bus?",
        "secondModel": "十時に出ます。",
        "explanation": "Der Ausdruck ほかの fragt nach einer Alternative."
      },
      {
        "id": "intent-2",
        "goal": "Den Treffpunkt nach der Ankunft klären",
        "firstModel": "大学の前で会えますか。",
        "partner": "はい、正門の前で会いましょう。",
        "partnerMeaning": "Wo genau treffen wir uns?",
        "secondModel": "正門の前ですね。",
        "explanation": "で markiert den Treffpunkt."
      }
    ]
  },
  {
    "scenarioId": "station-questions",
    "role": "host",
    "paths": [
      {
        "id": "intent-1",
        "goal": "Einen Weg detaillierter erklären",
        "firstModel": "駅の前からバスに乗ってください。",
        "partner": "何番のバスですか。",
        "partnerMeaning": "Welche Buslinie ist es?",
        "secondModel": "二番のバスです。",
        "explanation": "から markiert den Ausgangspunkt, に den Bus beim Einsteigen."
      },
      {
        "id": "intent-2",
        "goal": "Nachfragen, ob die Erklärung klar ist",
        "firstModel": "道はわかりましたか。",
        "partner": "まだ少しわかりません。",
        "partnerMeaning": "Wie hilfst du weiter?",
        "secondModel": "一緒に地図を見ましょう。",
        "explanation": "ましょう schlägt gemeinsames Handeln vor."
      }
    ]
  },
  {
    "scenarioId": "library-study",
    "role": "guest",
    "paths": [
      {
        "id": "intent-1",
        "goal": "Nach der Rückgabe fragen",
        "firstModel": "返す日はいつですか。",
        "partner": "来週の火曜日です。",
        "partnerMeaning": "Du bestätigst das Datum.",
        "secondModel": "火曜日ですね。わかりました。",
        "explanation": "Die Rückfrage präzisiert den Abgabetermin."
      },
      {
        "id": "intent-2",
        "goal": "Eine Verlängerung erfragen",
        "firstModel": "もう一週間借りてもいいですか。",
        "partner": "すみません、できません。",
        "partnerMeaning": "Du reagierst höflich auf die Absage.",
        "secondModel": "わかりました。ありがとうございます。",
        "explanation": "てもいいですか fragt nach Erlaubnis."
      }
    ]
  },
  {
    "scenarioId": "library-study",
    "role": "host",
    "paths": [
      {
        "id": "intent-1",
        "goal": "Rückgabeweg erläutern",
        "firstModel": "こちらの箱に返してください。",
        "partner": "ここでいいですか。",
        "partnerMeaning": "Du bestätigst den Rückgabeort.",
        "secondModel": "はい、そこで大丈夫です。",
        "explanation": "に markiert das Ziel des Zurückgebens."
      },
      {
        "id": "intent-2",
        "goal": "Alternative Bücher anbieten",
        "firstModel": "こちらの本もあります。",
        "partner": "これは借りられますか。",
        "partnerMeaning": "Du erlaubst die Ausleihe.",
        "secondModel": "はい、借りられます。",
        "explanation": "Die höfliche Auskunft beantwortet die Erlaubnisfrage."
      }
    ]
  },
  {
    "scenarioId": "cafe-fix",
    "role": "guest",
    "paths": [
      {
        "id": "intent-1",
        "goal": "Eine Bestellung richtigstellen",
        "firstModel": "すみません、コーヒーは一つだけです。",
        "partner": "一つですね。申し訳ありません。",
        "partnerMeaning": "Du bestätigst die Korrektur.",
        "secondModel": "はい、一つです。",
        "explanation": "だけ begrenzt die gewünschte Menge."
      },
      {
        "id": "intent-2",
        "goal": "Nach dem Bezahlen fragen",
        "firstModel": "カードで払ってもいいですか。",
        "partner": "はい、使えます。",
        "partnerMeaning": "Du reagierst auf die Zusage.",
        "secondModel": "ありがとうございます。",
        "explanation": "で markiert das Zahlungsmittel, てもいい die Erlaubnis."
      }
    ]
  },
  {
    "scenarioId": "cafe-fix",
    "role": "host",
    "paths": [
      {
        "id": "intent-1",
        "goal": "Eine Mengenangabe rückbestätigen",
        "firstModel": "コーヒーは一つですね。",
        "partner": "はい、一つだけです。",
        "partnerMeaning": "Du korrigierst die ursprüngliche Verwechslung höflich.",
        "secondModel": "失礼しました。一つで承ります。",
        "explanation": "Serviceorientierte Entschuldigung und Bestätigung."
      },
      {
        "id": "intent-2",
        "goal": "Eine zusätzliche Bitte verstehen",
        "firstModel": "ほかにご注文はありますか。",
        "partner": "水もお願いします。",
        "partnerMeaning": "Du bestätigst die zusätzliche Bestellung.",
        "secondModel": "お水ですね。かしこまりました。",
        "explanation": "ほかに fragt nach weiteren Bestellungen."
      }
    ]
  },
  {
    "scenarioId": "appointment-shift",
    "role": "guest",
    "paths": [
      {
        "id": "intent-1",
        "goal": "Einen Treffpunkt vorschlagen",
        "firstModel": "図書館で会いませんか。",
        "partner": "いいですね。何時にしますか。",
        "partnerMeaning": "Du machst einen Uhrzeitvorschlag.",
        "secondModel": "三時はどうですか。",
        "explanation": "で benennt den Ort des Treffens."
      },
      {
        "id": "intent-2",
        "goal": "Verspätung höflich ankündigen",
        "firstModel": "すみません、少し遅れます。",
        "partner": "何分ぐらいですか。",
        "partnerMeaning": "Du nennst eine ungefähre Dauer.",
        "secondModel": "十分ぐらいです。",
        "explanation": "ぐらい bezeichnet hier eine ungefähre Menge."
      }
    ]
  },
  {
    "scenarioId": "appointment-shift",
    "role": "host",
    "paths": [
      {
        "id": "intent-1",
        "goal": "Einen anderen Tag anbieten",
        "firstModel": "では、金曜日はどうですか。",
        "partner": "金曜日なら大丈夫です。",
        "partnerMeaning": "Du bestätigst das neue Datum.",
        "secondModel": "ありがとうございます。金曜日に会いましょう。",
        "explanation": "はどうですか bietet eine Alternative an."
      },
      {
        "id": "intent-2",
        "goal": "Den Treffpunkt überprüfen",
        "firstModel": "駅の前で会いましょうか。",
        "partner": "駅のどちら側ですか。",
        "partnerMeaning": "Du konkretisierst den Ort.",
        "secondModel": "東口でお願いします。",
        "explanation": "で markiert den Treffpunkt."
      }
    ]
  },
  {
    "scenarioId": "umbrella-owner",
    "role": "guest",
    "paths": [
      {
        "id": "intent-1",
        "goal": "Den Fundort nachfragen",
        "firstModel": "傘はもう見つかりましたか。",
        "partner": "まだ見つかっていません。",
        "partnerMeaning": "Du bittest um spätere Nachricht.",
        "secondModel": "見つかったら連絡してください。",
        "explanation": "たら kennzeichnet eine Bedingung in der Bitte."
      },
      {
        "id": "intent-2",
        "goal": "Den Schirm genauer beschreiben",
        "firstModel": "黒くて小さい傘です。",
        "partner": "名前は書いてありますか。",
        "partnerMeaning": "Du antwortest zum Namensschild.",
        "secondModel": "いいえ、書いていません。",
        "explanation": "くて verbindet Adjektivbeschreibungen."
      }
    ]
  },
  {
    "scenarioId": "umbrella-owner",
    "role": "host",
    "paths": [
      {
        "id": "intent-1",
        "goal": "Eine Beschreibung bestätigen",
        "firstModel": "黒い傘ですね。",
        "partner": "はい、黒い傘です。",
        "partnerMeaning": "Du erklärst das weitere Vorgehen.",
        "secondModel": "探してみます。少しお待ちください。",
        "explanation": "てみます beschreibt einen Versuch."
      },
      {
        "id": "intent-2",
        "goal": "Fundbenachrichtigung anbieten",
        "firstModel": "見つかったら連絡します。",
        "partner": "ありがとうございます。",
        "partnerMeaning": "Du verabschiedest dich höflich.",
        "secondModel": "どういたしまして。",
        "explanation": "Die Antwort schließt eine höfliche Hilfeleistung ab."
      }
    ]
  },
  {
    "scenarioId": "shop-colors",
    "role": "guest",
    "paths": [
      {
        "id": "intent-1",
        "goal": "Eine andere Größe erfragen",
        "firstModel": "もう少し小さいのはありますか。",
        "partner": "はい、こちらです。",
        "partnerMeaning": "Du möchtest die Größe ansehen.",
        "secondModel": "見せてください。",
        "explanation": "の ersetzt hier das bekannte Nomen."
      },
      {
        "id": "intent-2",
        "goal": "Nach dem Preisnachlass fragen",
        "firstModel": "少し安くなりますか。",
        "partner": "すみません、同じ値段です。",
        "partnerMeaning": "Du akzeptierst den festen Preis.",
        "secondModel": "わかりました。ありがとうございます。",
        "explanation": "なりますか fragt nach einer Preisänderung."
      }
    ]
  },
  {
    "scenarioId": "shop-colors",
    "role": "host",
    "paths": [
      {
        "id": "intent-1",
        "goal": "Eine ähnliche Tasche anbieten",
        "firstModel": "こちらも人気があります。",
        "partner": "もう少し小さいのはありますか。",
        "partnerMeaning": "Du zeigst eine Alternative.",
        "secondModel": "はい、こちらのサイズです。",
        "explanation": "この／こちら hängen vom Sprecherstandort ab."
      },
      {
        "id": "intent-2",
        "goal": "Den Preis genau angeben",
        "firstModel": "税込みで三千円です。",
        "partner": "カードで払えますか。",
        "partnerMeaning": "Du gibst Zahlungsmittel-Auskunft.",
        "secondModel": "はい、カードも使えます。",
        "explanation": "で kennzeichnet die gewählte Bezahlweise."
      }
    ]
  },
  {
    "scenarioId": "campus-greeting",
    "role": "guest",
    "paths": [
      {
        "id": "intent-1",
        "goal": "Zusammen lernen vorschlagen",
        "firstModel": "今度、一緒に勉強しませんか。",
        "partner": "いいですね。いつにしますか。",
        "partnerMeaning": "Du schlägst einen Tag vor.",
        "secondModel": "金曜日はどうですか。",
        "explanation": "ませんか ist eine höfliche Einladung."
      },
      {
        "id": "intent-2",
        "goal": "Die eigene Sprache nennen",
        "firstModel": "日本語を勉強しています。",
        "partner": "どのくらい勉強していますか。",
        "partnerMeaning": "Du beschreibst eine Dauer.",
        "secondModel": "半年ぐらいです。",
        "explanation": "ぐらい macht die Zeitdauer ungefähr."
      }
    ]
  },
  {
    "scenarioId": "campus-greeting",
    "role": "host",
    "paths": [
      {
        "id": "intent-1",
        "goal": "Nach Lernzielen fragen",
        "firstModel": "日本語で何をしたいですか。",
        "partner": "日本へ旅行したいです。",
        "partnerMeaning": "Du reagierst auf das Ziel.",
        "secondModel": "いいですね。応援しています。",
        "explanation": "たい drückt einen Wunsch aus."
      },
      {
        "id": "intent-2",
        "goal": "Weitere Zusammenarbeit anbieten",
        "firstModel": "次の授業も一緒に勉強しましょう。",
        "partner": "はい、お願いします。",
        "partnerMeaning": "Du bestätigst die Verabredung.",
        "secondModel": "では、また来週。",
        "explanation": "ましょう dient als gemeinsamer Vorschlag."
      }
    ]
  },
  {
    "scenarioId": "weekend-invite",
    "role": "guest",
    "paths": [
      {
        "id": "intent-1",
        "goal": "Einen alternativen Tag vorschlagen",
        "firstModel": "土曜日は難しいです。日曜日はどうですか。",
        "partner": "日曜日なら大丈夫です。",
        "partnerMeaning": "Du bestätigst den Plan.",
        "secondModel": "ありがとうございます。日曜日に会いましょう。",
        "explanation": "Absage mit Alternative ist höflicher als eine bloße Absage."
      },
      {
        "id": "intent-2",
        "goal": "Den Film genauer erfragen",
        "firstModel": "どんな映画を見ますか。",
        "partner": "日本の映画はどうですか。",
        "partnerMeaning": "Du stimmst dem Vorschlag zu.",
        "secondModel": "いいですね。それを見ましょう。",
        "explanation": "はどうですか bittet um eine Bewertung des Vorschlags."
      }
    ]
  },
  {
    "scenarioId": "weekend-invite",
    "role": "host",
    "paths": [
      {
        "id": "intent-1",
        "goal": "Zeitpunkt absprechen",
        "firstModel": "何時に会いましょうか。",
        "partner": "午後三時はどうですか。",
        "partnerMeaning": "Du bestätigst die Uhrzeit.",
        "secondModel": "はい、三時で大丈夫です。",
        "explanation": "Die Alternative wird als konkreter Termin bestätigt."
      },
      {
        "id": "intent-2",
        "goal": "Einen neuen Treffpunkt nennen",
        "firstModel": "駅ではなく、カフェで会いませんか。",
        "partner": "いいですね。どこのカフェですか。",
        "partnerMeaning": "Du erklärst den Ort.",
        "secondModel": "駅の近くのカフェです。",
        "explanation": "ではなく korrigiert einen bisherigen Vorschlag."
      }
    ]
  }
];
export function p36IntentsForRole(scenarioId:string,role:"guest"|"host"):readonly P36IntentPath[]{
  return p36IntentScenarios.find(s=>s.scenarioId===scenarioId&&s.role===role)?.paths??[];
}
