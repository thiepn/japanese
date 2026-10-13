import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";

/** Twelve first-party A1/A2 conversation arcs. Each following turn refers to
 * the same context rather than silently switching to another exercise. */
export interface P40DialogueTurn {
  id:string;number:number;partner:string;intention:string;model:string;
  alternative:string;misstep:string;why:string;focus:string;
}
export interface P40ReturnCue {
  intention:string;model:string;alternative:string;misstep:string;why:string;
}
export interface P40DialogueArc {
  id:string;units:readonly string[];title:string;setting:string;
  turns:readonly P40DialogueTurn[];returnCue:P40ReturnCue;
}
export const p40DialogueArcs:readonly P40DialogueArc[]=[
  {
    "id": "library-borrow",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "title": "Buch ausleihen",
    "setting": "Du sprichst zum ersten Mal mit einer Mitarbeiterin in der Bibliothek. Bleibe höflich.",
    "turns": [
      {
        "id": "library-borrow-t1",
        "partner": "何をお探しですか。",
        "intention": "Erkläre, dass du dieses Buch ausleihen möchtest.",
        "model": "この本を借りたいです。",
        "alternative": "すみません、この本を借りたいです。",
        "misstep": "この本を買いました。",
        "why": "買いました bedeutet, dass du das Buch gekauft hast; du willst es ausleihen.",
        "focus": "Absicht",
        "number": 1
      },
      {
        "id": "library-borrow-t2",
        "partner": "貸し出しは一週間です。",
        "intention": "Du willst zusätzlich ausdrücklich um Erlaubnis fragen, das Buch mit nach Hause zu nehmen.",
        "model": "この本を持って帰ってもいいですか。",
        "alternative": "すみません、この本を持って帰ってもいいですか。",
        "misstep": "この本を持って帰りたいです。",
        "why": "たい drückt deinen Wunsch aus; てもいいですか erfragt hier die Erlaubnis.",
        "focus": "Erlaubnis",
        "number": 2
      },
      {
        "id": "library-borrow-t3",
        "partner": "はい、いいですよ。",
        "intention": "Bedanke dich höflich, ohne die Erlaubnis wieder zurückzunehmen.",
        "model": "ありがとうございます。",
        "alternative": "どうもありがとうございます。",
        "misstep": "いいえ、結構です。",
        "why": "結構です wirkt hier wie eine Ablehnung nach erteilter Erlaubnis.",
        "focus": "Antwort",
        "number": 3
      }
    ],
    "returnCue": {
      "intention": "Eine andere Bibliothekarin zeigt dir ein Buch. Frage selbstständig, ob du es ausleihen darfst.",
      "model": "この本を借りてもいいですか。",
      "alternative": "すみません、この本を借りてもいいですか。",
      "misstep": "この本を借りたいです。",
      "why": "たい sagt nur, dass du es ausleihen möchtest; die Erlaubnis erfragst du mit てもいいですか。"
    }
  },
  {
    "id": "campus-transit",
    "units": [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "title": "Vom Bahnhof zur Universität",
    "setting": "Ein Fahrgast hilft dir bei der Anfahrt zu deiner Universität.",
    "turns": [
      {
        "id": "campus-transit-t1",
        "partner": "どちらへ行きますか。",
        "intention": "Sage, dass dein Ziel die Universität ist.",
        "model": "大学に行きます。",
        "alternative": "大学へ行きます。",
        "misstep": "大学で行きます。",
        "why": "で bezeichnet hier nicht das Bewegungsziel; に oder へ passen.",
        "focus": "Ziel",
        "number": 1
      },
      {
        "id": "campus-transit-t2",
        "partner": "何で行きますか。",
        "intention": "Du willst den Bus als Verkehrsmittel benennen.",
        "model": "バスで行きます。",
        "alternative": "バスで大学に行きます。",
        "misstep": "バスに行きます。",
        "why": "バスに行きます bedeutet eher, dass du zum Bus gehst; das Verkehrsmittel steht mit で.",
        "focus": "Verkehrsmittel",
        "number": 2
      },
      {
        "id": "campus-transit-t3",
        "partner": "どのぐらいかかりますか。",
        "intention": "Frage zurück, ob die Busfahrt ungefähr zehn Minuten dauert.",
        "model": "バスで十分ぐらいかかりますか。",
        "alternative": "バスで十分くらいですか。",
        "misstep": "バスで十分でした。",
        "why": "でした ist eine Vergangenheitsaussage und keine Frage nach der Fahrtdauer.",
        "focus": "Rückfrage",
        "number": 3
      }
    ],
    "returnCue": {
      "intention": "Neuer Weg: Sage, dass du mit dem Zug zum Museum fährst.",
      "model": "電車で美術館に行きます。",
      "alternative": "美術館へ電車で行きます。",
      "misstep": "電車に美術館で行きます。",
      "why": "に/で sind hier vertauscht: で für das Mittel, に/へ für das Ziel."
    }
  },
  {
    "id": "cafe-clarification",
    "units": [
      "p23:cafe",
      "p26:cafe-conversation"
    ],
    "title": "Bestellung präzisieren",
    "setting": "Du bestellst in einem Café, bleibst bei einem Kaffee und möchtest keine Milch.",
    "turns": [
      {
        "id": "cafe-clarification-t1",
        "partner": "ご注文は？",
        "intention": "Bestelle höflich genau einen Kaffee.",
        "model": "コーヒーを一つお願いします。",
        "alternative": "コーヒーを一つください。",
        "misstep": "コーヒーが一つお願いします。",
        "why": "Bei dieser Bestellung steht der gewünschte Gegenstand mit を.",
        "focus": "Bestellung",
        "number": 1
      },
      {
        "id": "cafe-clarification-t2",
        "partner": "ミルクを入れますか。",
        "intention": "Lehne Milch höflich ab und halte an deiner Bestellung fest.",
        "model": "いいえ、ミルクなしでお願いします。",
        "alternative": "ミルクは入れないでください。",
        "misstep": "はい、ミルクをお願いします。",
        "why": "はい und ミルクをお願いします würden Milch bestellen, nicht ausschließen.",
        "focus": "Präzisierung",
        "number": 2
      },
      {
        "id": "cafe-clarification-t3",
        "partner": "ほかに何か？",
        "intention": "Du möchtest nichts hinzufügen. Schließe die Bestellung höflich ab.",
        "model": "いいえ、それだけです。",
        "alternative": "いいえ、大丈夫です。",
        "misstep": "はい、ケーキもお願いします。",
        "why": "も fügt einen Kuchen hinzu, obwohl du sonst nichts möchtest.",
        "focus": "Abschluss",
        "number": 3
      }
    ],
    "returnCue": {
      "intention": "Anderer Cafébesuch: Bestelle einen schwarzen Tee ohne Zucker.",
      "model": "砂糖なしの紅茶を一つお願いします。",
      "alternative": "紅茶を一つ、砂糖なしでお願いします。",
      "misstep": "砂糖の紅茶を一つお願いします。",
      "why": "砂糖の bezeichnet nicht eindeutig Tee ohne Zucker; 砂糖なし ist die gewünschte Einschränkung."
    }
  },
  {
    "id": "appointment-reschedule",
    "units": [
      "p25:appointment",
      "p26:weekend-switch"
    ],
    "title": "Termin absagen und ersetzen",
    "setting": "Du planst mit einer neuen Bekanntschaft ein Treffen; Samstag geht nicht.",
    "turns": [
      {
        "id": "appointment-reschedule-t1",
        "partner": "土曜日はどうですか。",
        "intention": "Sage höflich ab, weil du am Samstag schon Pläne hast.",
        "model": "すみません、土曜日は予定があります。",
        "alternative": "土曜日はちょっと難しいです。",
        "misstep": "はい、土曜日で大丈夫です。",
        "why": "Damit bestätigst du Samstag, obwohl er nicht möglich ist.",
        "focus": "Absage",
        "number": 1
      },
      {
        "id": "appointment-reschedule-t2",
        "partner": "では、いつがいいですか。",
        "intention": "Schlage ausdrücklich Sonntag vor und bitte um Rückmeldung.",
        "model": "日曜日はどうですか。",
        "alternative": "では、日曜日はいかがですか。",
        "misstep": "日曜日に行きました。",
        "why": "Vergangenheitsform 行きました enthält keinen Terminvorschlag.",
        "focus": "Gegenvorschlag",
        "number": 2
      },
      {
        "id": "appointment-reschedule-t3",
        "partner": "日曜日なら大丈夫です。",
        "intention": "Bestätige das Treffen am Sonntag um 15 Uhr als gemeinsamen Vorschlag.",
        "model": "では、午後三時に会いましょう。",
        "alternative": "日曜日の午後三時に会いましょう。",
        "misstep": "午後三時に会いました。",
        "why": "会いました ist vergangen; ましょう legt den gemeinsamen Plan nahe.",
        "focus": "Bestätigung",
        "number": 3
      }
    ],
    "returnCue": {
      "intention": "Ein anderer Termin geht nicht; schlage stattdessen Freitag höflich vor.",
      "model": "金曜日はどうですか。",
      "alternative": "では、金曜日はどうですか。",
      "misstep": "金曜日に会いました。",
      "why": "会いました beschreibt ein früheres Treffen; はどうですか bietet einen neuen Termin an."
    }
  },
  {
    "id": "lost-property",
    "units": [
      "p25:lostfound",
      "p23:ownership"
    ],
    "title": "Schirm im Fundbüro suchen",
    "setting": "Du hast deinen Schirm verloren und meldest den Verlust am Schalter.",
    "turns": [
      {
        "id": "lost-property-t1",
        "partner": "どうしましたか。",
        "intention": "Erkläre, dass du deinen Schirm verloren hast.",
        "model": "傘をなくしました。",
        "alternative": "私の傘をなくしました。",
        "misstep": "傘を買いました。",
        "why": "買いました bedeutet gekauft, nicht verloren.",
        "focus": "Verlust",
        "number": 1
      },
      {
        "id": "lost-property-t2",
        "partner": "どこでなくしましたか。",
        "intention": "Nenne den Bahnhof als Ort des Verlusts.",
        "model": "駅でなくしました。",
        "alternative": "駅で傘をなくしました。",
        "misstep": "駅になくしました。",
        "why": "なくしました bezeichnet eine Handlung am Ort: 駅で.",
        "focus": "Ort",
        "number": 2
      },
      {
        "id": "lost-property-t3",
        "partner": "どんな傘ですか。",
        "intention": "Beschreibe ihn als schwarzen Schirm und bleibe beim selben Gegenstand.",
        "model": "黒い傘です。",
        "alternative": "黒い傘をなくしました。",
        "misstep": "黒いかばんです。",
        "why": "かばん ist eine Tasche, nicht der gesuchte Schirm.",
        "focus": "Beschreibung",
        "number": 3
      }
    ],
    "returnCue": {
      "intention": "Eine andere Situation: Du hast gestern in der Bibliothek deine Brille verloren.",
      "model": "昨日、図書館で眼鏡をなくしました。",
      "alternative": "昨日、図書館で私の眼鏡をなくしました。",
      "misstep": "昨日、図書館に眼鏡をなくします。",
      "why": "Der Verlust liegt in der Vergangenheit und fand dort statt: 図書館で…なくしました."
    }
  },
  {
    "id": "bag-shopping",
    "units": [
      "p25:shopping",
      "p23:ownership"
    ],
    "title": "Tasche im Geschäft kaufen",
    "setting": "Eine Verkäuferin zeigt dir Taschen; du suchst eine blaue Tasche und erkundigst dich nach dem Preis.",
    "turns": [
      {
        "id": "bag-shopping-t1",
        "partner": "何をお探しですか。",
        "intention": "Beschreibe die gesuchte blaue Tasche.",
        "model": "青いかばんを探しています。",
        "alternative": "青いかばんが欲しいです。",
        "misstep": "青いかばんをなくしました。",
        "why": "なくしました berichtet, dass du eine Tasche verloren hast.",
        "focus": "Suche",
        "number": 1
      },
      {
        "id": "bag-shopping-t2",
        "partner": "こちらはいかがですか。",
        "intention": "Erfrage höflich den Preis der gezeigten Tasche.",
        "model": "このかばんはいくらですか。",
        "alternative": "すみません、このかばんはいくらですか。",
        "misstep": "このかばんをいくらですか。",
        "why": "Eine Preisfrage verwendet gewöhnlich das Thema このかばんは.",
        "focus": "Preis",
        "number": 2
      },
      {
        "id": "bag-shopping-t3",
        "partner": "三千円です。",
        "intention": "Du entscheidest dich, die Tasche zu nehmen.",
        "model": "これをください。",
        "alternative": "これをお願いします。",
        "misstep": "これはどこですか。",
        "why": "どこですか fragt nach dem Ort, nicht nach dem Kauf.",
        "focus": "Kauf",
        "number": 3
      }
    ],
    "returnCue": {
      "intention": "Anderer Laden: Frage nach dem Preis einer roten Tasche in deiner Nähe.",
      "model": "この赤いかばんはいくらですか。",
      "alternative": "すみません、この赤いかばんはいくらですか。",
      "misstep": "これ赤いかばんはいくらですか。",
      "why": "これ steht alleine; vor dem Nomen 赤いかばん brauchst du この."
    }
  },
  {
    "id": "first-lesson",
    "units": [
      "p23:greetings",
      "p23:introduction"
    ],
    "title": "Erste Unterrichtsstunde",
    "setting": "Du begegnest zum ersten Mal deiner Japanischlehrkraft.",
    "turns": [
      {
        "id": "first-lesson-t1",
        "partner": "お名前は？",
        "intention": "Stelle dich als Maria vor.",
        "model": "私はマリアです。",
        "alternative": "マリアです。",
        "misstep": "あなたはマリアです。",
        "why": "あなたは würde der Lehrkraft zuschreiben, dass sie Maria heißt.",
        "focus": "Vorstellung",
        "number": 1
      },
      {
        "id": "first-lesson-t2",
        "partner": "何を勉強していますか。",
        "intention": "Erkläre, dass du Japanisch lernst.",
        "model": "日本語を勉強しています。",
        "alternative": "今、日本語を勉強しています。",
        "misstep": "日本語に勉強しています。",
        "why": "日本語 ist bei 勉強する hier das Lernobjekt mit を.",
        "focus": "Tätigkeit",
        "number": 2
      },
      {
        "id": "first-lesson-t3",
        "partner": "よろしくお願いします。",
        "intention": "Antworte höflich auf die Begrüßung der Lehrkraft.",
        "model": "こちらこそ、よろしくお願いします。",
        "alternative": "よろしくお願いします。",
        "misstep": "さようなら。",
        "why": "さようなら beendet den Kontakt, statt die Begrüßung zu erwidern.",
        "focus": "Antwort",
        "number": 3
      }
    ],
    "returnCue": {
      "intention": "Du triffst am nächsten Morgen eine andere Lehrkraft. Begrüße sie höflich.",
      "model": "先生、おはようございます。",
      "alternative": "おはようございます、先生。",
      "misstep": "先生、おはよう。",
      "why": "おはよう ohne ございます ist informell; die Situation erwartet die höfliche Form."
    }
  },
  {
    "id": "museum-invitation",
    "units": [
      "p23:plans",
      "p25:appointment"
    ],
    "title": "Museumstreffen vereinbaren",
    "setting": "Du möchtest eine neue Bekanntschaft für Sonntag ins Museum einladen.",
    "turns": [
      {
        "id": "museum-invitation-t1",
        "partner": "週末は何をしますか。",
        "intention": "Lade die Person für Sonntag höflich ins Museum ein.",
        "model": "日曜日に美術館へ行きませんか。",
        "alternative": "日曜日、美術館に行きませんか。",
        "misstep": "日曜日に美術館に行きました。",
        "why": "行きました ist eine Erzählung über Vergangenes und keine Einladung.",
        "focus": "Einladung",
        "number": 1
      },
      {
        "id": "museum-invitation-t2",
        "partner": "日曜日はいいですね。何時ですか。",
        "intention": "Schlage 14 Uhr vor und warte auf die Antwort.",
        "model": "午後二時はどうですか。",
        "alternative": "午後二時にしましょうか。",
        "misstep": "午後二時でした。",
        "why": "でした beantwortet die Bitte um einen Vorschlag nicht.",
        "focus": "Uhrzeit",
        "number": 2
      },
      {
        "id": "museum-invitation-t3",
        "partner": "いいですよ。どこで会いますか。",
        "intention": "Schlage vor, sich am Bahnhof zu treffen.",
        "model": "駅で会いましょう。",
        "alternative": "駅で会いませんか。",
        "misstep": "駅に会いましょう。",
        "why": "会う ist eine Handlung am Treffpunkt: 駅で.",
        "focus": "Treffpunkt",
        "number": 3
      }
    ],
    "returnCue": {
      "intention": "Lade eine andere Person für Samstag zu einem gemeinsamen Film ein.",
      "model": "土曜日に一緒に映画を見ませんか。",
      "alternative": "土曜日、一緒に映画を見ませんか。",
      "misstep": "土曜日に一緒に映画を見ました。",
      "why": "見ました beschreibt eine abgeschlossene Handlung statt einer Einladung."
    }
  },
  {
    "id": "library-directions",
    "units": [
      "p25:directions",
      "p25:library"
    ],
    "title": "Weg zur Bibliothek finden",
    "setting": "Du bist neu in der Stadt und sprichst eine unbekannte Person höflich an.",
    "turns": [
      {
        "id": "library-directions-t1",
        "partner": "何かお困りですか。",
        "intention": "Frage nach dem Ort der Bibliothek.",
        "model": "図書館はどこですか。",
        "alternative": "すみません、図書館はどこですか。",
        "misstep": "図書館でどこですか。",
        "why": "で ist nicht die Themenmarkierung für die Frage nach dem Standort.",
        "focus": "Ortsfrage",
        "number": 1
      },
      {
        "id": "library-directions-t2",
        "partner": "駅の近くです。",
        "intention": "Frage nach, ob du vom Bahnhof zu Fuß dorthin gelangen kannst.",
        "model": "駅から歩いて行けますか。",
        "alternative": "歩いて行けますか。",
        "misstep": "駅から歩いて行きましたか。",
        "why": "行きましたか fragt nach einer vergangenen Handlung statt nach der Möglichkeit.",
        "focus": "Nachfrage",
        "number": 2
      },
      {
        "id": "library-directions-t3",
        "partner": "はい、歩いて五分です。",
        "intention": "Bedanke dich für die Auskunft, bevor du gehst.",
        "model": "ありがとうございます。行ってみます。",
        "alternative": "ありがとうございます。",
        "misstep": "じゃ、行きません。",
        "why": "行きません widerspricht der Absicht, zur Bibliothek zu gelangen.",
        "focus": "Abschluss",
        "number": 3
      }
    ],
    "returnCue": {
      "intention": "Anderer Stadtteil: Frage höflich, wo sich die Post befindet.",
      "model": "郵便局はどこですか。",
      "alternative": "すみません、郵便局はどこですか。",
      "misstep": "郵便局でどこですか。",
      "why": "はどこですか erfragt den Standort; で ist hier unpassend."
    }
  },
  {
    "id": "daily-routine-shift",
    "units": [
      "p23:routine",
      "p23:past"
    ],
    "title": "Routine und gestern unterscheiden",
    "setting": "Ein Mitschüler fragt zuerst nach deiner Gewohnheit und dann nach dem gestrigen Tag.",
    "turns": [
      {
        "id": "daily-routine-shift-t1",
        "partner": "毎朝何時に起きますか。",
        "intention": "Antworte, dass du jeden Morgen um sieben Uhr aufstehst.",
        "model": "毎朝七時に起きます。",
        "alternative": "七時に起きます。",
        "misstep": "昨日七時に起きました。",
        "why": "Der Satz beschreibt nur gestern; gefragt ist die Gewohnheit.",
        "focus": "Routine",
        "number": 1
      },
      {
        "id": "daily-routine-shift-t2",
        "partner": "昨日は何時に起きましたか。",
        "intention": "Antworte, dass du gestern um acht Uhr aufgestanden bist.",
        "model": "昨日は八時に起きました。",
        "alternative": "昨日、八時に起きました。",
        "misstep": "昨日は八時に起きます。",
        "why": "起きます ist nicht die gefragte Vergangenheitsform für gestern.",
        "focus": "Vergangenheit",
        "number": 2
      },
      {
        "id": "daily-routine-shift-t3",
        "partner": "今日は学校へ行きますか。",
        "intention": "Bestätige, dass du heute zur Schule gehst.",
        "model": "はい、今日は学校へ行きます。",
        "alternative": "はい、学校へ行きます。",
        "misstep": "はい、昨日学校へ行きました。",
        "why": "Du antwortest über gestern statt auf die Frage nach heute.",
        "focus": "Gegenwart",
        "number": 3
      }
    ],
    "returnCue": {
      "intention": "Erzähle, dass du gestern Abend Japanisch gelernt hast.",
      "model": "昨日の夜、日本語を勉強しました。",
      "alternative": "昨日の夜は日本語を勉強しました。",
      "misstep": "昨日の夜、日本語を勉強します。",
      "why": "Vergangenes Lernen wird mit 勉強しました ausgedrückt."
    }
  },
  {
    "id": "study-group",
    "units": [
      "p23:introduction",
      "p26:library-project"
    ],
    "title": "Neue Lerngruppe organisieren",
    "setting": "Eine neue Person aus dem Sprachkurs sucht jemanden zum gemeinsamen Lernen.",
    "turns": [
      {
        "id": "study-group-t1",
        "partner": "はじめまして。お名前は？",
        "intention": "Stelle dich höflich als Ken vor.",
        "model": "はじめまして。私はケンです。",
        "alternative": "ケンです。よろしくお願いします。",
        "misstep": "あなたはケンです。",
        "why": "あなたは würde den Namen dem Gegenüber zuschreiben.",
        "focus": "Vorstellung",
        "number": 1
      },
      {
        "id": "study-group-t2",
        "partner": "どこで勉強しましょうか。",
        "intention": "Schlage vor, gemeinsam in der Bibliothek zu lernen.",
        "model": "図書館で勉強しましょう。",
        "alternative": "図書館で一緒に勉強しませんか。",
        "misstep": "図書館に勉強しましょう。",
        "why": "Bei der Lerntätigkeit ist 図書館で der Handlungsort.",
        "focus": "Lernort",
        "number": 2
      },
      {
        "id": "study-group-t3",
        "partner": "明日の午後はどうですか。",
        "intention": "Stimme zu und bestätige den morgigen Nachmittag als Termin.",
        "model": "はい、明日の午後に会いましょう。",
        "alternative": "はい、明日の午後は大丈夫です。",
        "misstep": "はい、昨日の午後に会いました。",
        "why": "昨日の午後 wechselt fälschlich in die Vergangenheit.",
        "focus": "Termin",
        "number": 3
      }
    ],
    "returnCue": {
      "intention": "Eine andere Lerngruppe: Lade jemanden ein, morgen in der Bibliothek gemeinsam zu lernen.",
      "model": "明日、図書館で一緒に勉強しませんか。",
      "alternative": "明日、一緒に図書館で勉強しませんか。",
      "misstep": "明日、図書館に一緒に勉強しませんか。",
      "why": "で bezeichnet den Ort der Lerntätigkeit."
    }
  },
  {
    "id": "rain-change",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "title": "Plan bei Regen ändern",
    "setting": "Ein Freund schlägt zunächst den Park vor; aufgrund von Regen vereinbart ihr einen alternativen Treffpunkt.",
    "turns": [
      {
        "id": "rain-change-t1",
        "partner": "明日は公園へ行きませんか。",
        "intention": "Stimme dem Parkbesuch zunächst freundlich zu.",
        "model": "はい、行きましょう。",
        "alternative": "はい、ぜひ行きましょう。",
        "misstep": "昨日、公園に行きました。",
        "why": "Du erzählst von gestern statt dem Vorschlag für morgen zuzustimmen.",
        "focus": "Zustimmung",
        "number": 1
      },
      {
        "id": "rain-change-t2",
        "partner": "でも、明日は雨ですよ。",
        "intention": "Schlage deshalb aktiv ein Café statt des Parks vor.",
        "model": "では、カフェに行きませんか。",
        "alternative": "それなら、カフェはどうですか。",
        "misstep": "では、公園に行きました。",
        "why": "行きました erzählt Vergangenes und greift den neuen Plan nicht auf.",
        "focus": "Planänderung",
        "number": 2
      },
      {
        "id": "rain-change-t3",
        "partner": "いいですね。何時に会いますか。",
        "intention": "Schlage vor, euch um 13 Uhr zu treffen.",
        "model": "午後一時に会いましょう。",
        "alternative": "午後一時はどうですか。",
        "misstep": "午後一時に会いました。",
        "why": "会いました ist eine Vergangenheitsform, kein Terminvorschlag.",
        "focus": "Termin",
        "number": 3
      }
    ],
    "returnCue": {
      "intention": "Anderer Regentag: Lade jemanden ein, bei Regen ins Museum zu gehen.",
      "model": "雨なら美術館に行きませんか。",
      "alternative": "雨なら美術館はどうですか。",
      "misstep": "雨なら美術館に行きました。",
      "why": "行きました beschreibt Vergangenes, nicht den geplanten Vorschlag."
    }
  }
];

export function p40ArcsForUnit(unitId:string):P40DialogueArc[]{
  return p40DialogueArcs.filter(arc=>arc.units.includes(unitId));
}
export function p40DialogueById(id:string):P40DialogueArc|undefined{
  return p40DialogueArcs.find(arc=>arc.id===id);
}
export function p40TurnFeedback(
  turn:P40DialogueTurn,value:string
):{kind:"authored"|"misconception"|"unknown";message:string}{
  const normalized=normalizeP26(value);
  if([turn.model,turn.alternative].some(s=>normalizeP26(s)===normalized))
    return {kind:"authored",message:"Diese Form passt zur gefragten Gesprächsabsicht. "+turn.focus+" ist hier entscheidend."};
  if(normalizeP26(turn.misstep)===normalized)
    return {kind:"misconception",message:turn.why};
  return {kind:"unknown",message:"Nicht automatisch beurteilt: Eine andere freie Formulierung kann sinnvoll sein. Prüfe Bedeutung, Adressat und bisherigen Gesprächsverlauf."};
}
function p40Base(arc:P40DialogueArc,turn:P40DialogueTurn):Pick<StudyPrompt,
  "primaryTarget"|"skill"|"cueFamily"|"instruction"|"prompt"|"displayAnswer"|"explanation"|
  "answerNormalization"|"contextId"|"sourceId"|"contentVersion"|"eventMetadata">{
  return {
    primaryTarget:{kind:"can_do",id:"p40:dialogue:"+turn.id},
    skill:turn.number===1?"form_selection":"production",
    cueFamily:"p40-dialogue-turn-"+turn.id,
    instruction:turn.number===2?"Korrigiere die Aussage im fortlaufenden Dialog":
      "Reagiere in einem zusammenhängenden Alltagsgespräch.",
    prompt:arc.setting+"\nGespräch "+turn.number+"/3 — "+turn.intention+
      "\nGesprächspartner: "+turn.partner+
      (turn.number===2?"\nMissverständliche Antwort: "+turn.misstep:""),
    displayAnswer:turn.model,
    explanation:turn.why+" Kontext und Absicht: "+turn.focus+". "+
      "Eine frühere Aussage wird nicht automatisch als tatsächliche eigene Antwort gespeichert.",
    answerNormalization:"japanese",contextId:"p40:dialogue:"+arc.id,
    sourceId:"thiepn-original",contentVersion:"p40-1",
    eventMetadata:{p40:true,kind:turn.number===2?"cross-context-reformulation":"dialogue-continuity",
      unitIds:[...arc.units],arcId:arc.id,turnId:turn.id,turnNumber:turn.number,
      focus:turn.focus,independentCue:true}
  };
}
export const p40DialoguePrompts:StudyPrompt[]=p40DialogueArcs.flatMap(arc=>
  arc.turns.map(turn=>({
    ...p40Base(arc,turn),
    promptType:turn.number===1?"choice":"typed",
    ...(turn.number===1?{choices:[turn.misstep,turn.model,turn.alternative]}:{}),
    acceptedAnswers:turn.number===1?[turn.model,turn.alternative]:
      [normalizeP26(turn.model),normalizeP26(turn.alternative)]
  } as StudyPrompt))
);
export const p40ReturnPrompts:StudyPrompt[]=p40DialogueArcs.map(arc=>({
  id:"p40-return-"+arc.id,
  primaryTarget:{kind:"can_do",id:"p40:return:"+arc.id},
  skill:"production",cueFamily:"p40-delayed-transfer-"+arc.id,promptType:"typed",
  instruction:"Ohne Gesprächsvorlage in eine neue Situation übertragen",
  prompt:"Neuer Kontext nach dem Dialog "+arc.title+": "+arc.returnCue.intention,
  acceptedAnswers:[normalizeP26(arc.returnCue.model),normalizeP26(arc.returnCue.alternative)],
  displayAnswer:arc.returnCue.model,
  explanation:arc.returnCue.why+" FSRS terminiert eine spätere Wiederholung nur aus einer tatsächlichen unabhängigen Bewertung.",
  answerNormalization:"japanese",contextId:"p40:return:"+arc.id,
  sourceId:"thiepn-original",contentVersion:"p40-1",
  eventMetadata:{p40:true,kind:"cross-context-transfer",unitIds:[...arc.units],
    arcId:arc.id,focus:"delayed-independent-return",independentCue:true}
}));
export const p40Prompts:StudyPrompt[]=[...p40DialoguePrompts,...p40ReturnPrompts];

/** A contextual entry point, never a second scheduler or scoring engine.
 * The three StudyPlayer steps carry fixed scene context and distinct cue IDs;
 * subsequent responses do not pretend to branch on semantically unverified text. */
export function p40PromptsForArc(arcId:string):StudyPrompt[]{
  return p40DialoguePrompts.filter(p=>p.eventMetadata?.arcId===arcId)
    .sort((a,b)=>Number(a.eventMetadata?.turnNumber)-Number(b.eventMetadata?.turnNumber));
}
