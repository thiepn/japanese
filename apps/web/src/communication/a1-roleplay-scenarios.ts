export type Turn={speaker:string;prompt:string;choices:readonly {japanese:string;german:string;correct:boolean;reply:string;replyGerman:string;next?:number|null}[]};
export type Scenario={id:string;title:string;intro:string;turns:readonly Turn[]};
export const scenarios:readonly Scenario[]=[
 {id:"cafe",title:"Im Café",intro:"Bestelle ein Getränk und entscheide, ob du noch etwas möchtest.",turns:[
 {speaker:"店員",prompt:"いらっしゃいませ。ごちゅうもんは？",choices:[
 {japanese:"おちゃをください。",german:"Einen Tee bitte.",correct:true,reply:"はい、おちゃですね。",replyGerman:"Ja, einen Tee.",next:1},
 {japanese:"コーヒーをください。",german:"Einen Kaffee bitte.",correct:true,reply:"はい、コーヒーですね。",replyGerman:"Ja, einen Kaffee.",next:2},
 {japanese:"えきはどこですか。",german:"Wo ist der Bahnhof?",correct:false,reply:"ここはカフェです。",replyGerman:"Hier ist ein Café."}]},
 {speaker:"店員",prompt:"おちゃです。ほかに何か？",choices:[
 {japanese:"みずをください。",german:"Wasser bitte.",correct:true,reply:"はい、どうぞ。",replyGerman:"Ja, bitte schön.",next:3},
 {japanese:"いいえ、けっこうです。",german:"Nein, danke.",correct:true,reply:"ありがとうございます。",replyGerman:"Vielen Dank.",next:null},
 {japanese:"さんじです。",german:"Es ist drei Uhr.",correct:false,reply:"え？",replyGerman:"Wie bitte?"}]},
 {speaker:"店員",prompt:"コーヒーです。ほかに何か？",choices:[
 {japanese:"みずをください。",german:"Wasser bitte.",correct:true,reply:"はい、どうぞ。",replyGerman:"Ja, bitte schön.",next:3},
 {japanese:"いいえ、けっこうです。",german:"Nein, danke.",correct:true,reply:"ありがとうございます。",replyGerman:"Vielen Dank.",next:null},
 {japanese:"わたしはアンナです。",german:"Ich bin Anna.",correct:false,reply:"え？",replyGerman:"Wie bitte?"}]},
 {speaker:"店員",prompt:"ほかに何か？",choices:[
 {japanese:"いいえ、けっこうです。",german:"Nein, danke.",correct:true,reply:"ありがとうございました。",replyGerman:"Vielen Dank.",next:null},
 {japanese:"おちゃをください。",german:"Noch einen Tee bitte.",correct:true,reply:"はい、どうぞ。",replyGerman:"Ja, bitte schön.",next:null},
 {japanese:"おやすみなさい。",german:"Gute Nacht.",correct:false,reply:"え？",replyGerman:"Wie bitte?"}]}
 ]},
 {id:"station",title:"Am Bahnhof",intro:"Frage nach dem Bahnhof und entscheide, wie du weiterreist.",turns:[
 {speaker:"通行人",prompt:"こんにちは。どうしましたか。",choices:[
 {japanese:"えきはどこですか。",german:"Wo ist der Bahnhof?",correct:true,reply:"えきはみぎです。",replyGerman:"Der Bahnhof ist rechts.",next:1},
 {japanese:"バスはどこですか。",german:"Wo ist der Bus?",correct:true,reply:"バスはひだりです。",replyGerman:"Der Bus ist links.",next:2},
 {japanese:"おちゃをください。",german:"Tee bitte.",correct:false,reply:"ここはカフェではありません。",replyGerman:"Hier ist kein Café."}]},
 {speaker:"駅員",prompt:"どこへいきますか。",choices:[
 {japanese:"とうきょうへいきます。",german:"Ich fahre nach Tokio.",correct:true,reply:"でんしゃですね。",replyGerman:"Also mit dem Zug.",next:3},
 {japanese:"ありがとうございます。",german:"Vielen Dank, das ist alles.",correct:true,reply:"どういたしまして。",replyGerman:"Gern geschehen.",next:null},
 {japanese:"さんじです。",german:"Es ist drei Uhr.",correct:false,reply:"どこへ？",replyGerman:"Wohin?"}]},
 {speaker:"通行人",prompt:"バスでいきますか。",choices:[
 {japanese:"はい、バスでいきます。",german:"Ja, ich fahre mit dem Bus.",correct:true,reply:"わかりました。",replyGerman:"Verstanden.",next:null},
 {japanese:"いいえ、でんしゃでいきます。",german:"Nein, ich fahre mit dem Zug.",correct:true,reply:"えきはみぎです。",replyGerman:"Der Bahnhof ist rechts.",next:1},
 {japanese:"わたしはアンナです。",german:"Ich bin Anna.",correct:false,reply:"え？",replyGerman:"Wie bitte?"}]},
 {speaker:"駅員",prompt:"でんしゃですね。",choices:[
 {japanese:"ありがとうございます。",german:"Vielen Dank.",correct:true,reply:"どういたしまして。",replyGerman:"Gern geschehen.",next:null},
 {japanese:"えきはどこですか。",german:"Wo ist der Bahnhof?",correct:false,reply:"ここはえきです。",replyGerman:"Das hier ist der Bahnhof."}]}
 ]},
 {id:"meeting",title:"Neue Bekanntschaft",intro:"Begrüße eine neue Person und sprich über Namen oder Interessen.",turns:[
 {speaker:"相手",prompt:"はじめまして。",choices:[
 {japanese:"はじめまして。",german:"Schön, Sie kennenzulernen.",correct:true,reply:"おなまえは？",replyGerman:"Wie heißen Sie?",next:1},
 {japanese:"こんにちは。",german:"Guten Tag.",correct:true,reply:"おんがくがすきですか。",replyGerman:"Mögen Sie Musik?",next:2},
 {japanese:"これをください。",german:"Das bitte.",correct:false,reply:"え？",replyGerman:"Wie bitte?"}]},
 {speaker:"相手",prompt:"おなまえは？",choices:[
 {japanese:"わたしはアンナです。",german:"Ich bin Anna.",correct:true,reply:"よろしくおねがいします。",replyGerman:"Freut mich.",next:3},
 {japanese:"わたしはたなかです。",german:"Ich bin Tanaka.",correct:true,reply:"よろしくおねがいします。",replyGerman:"Freut mich.",next:3},
 {japanese:"いくらですか。",german:"Wie viel kostet es?",correct:false,reply:"おなまえは？",replyGerman:"Wie heißen Sie?"}]},
 {speaker:"相手",prompt:"おんがくがすきですか。",choices:[
 {japanese:"はい、おんがくがすきです。",german:"Ja, ich mag Musik.",correct:true,reply:"わたしもです。",replyGerman:"Ich auch.",next:3},
 {japanese:"ほんがすきです。",german:"Ich mag Bücher.",correct:true,reply:"そうですか。",replyGerman:"Ach so.",next:3},
 {japanese:"えきはみぎです。",german:"Der Bahnhof ist rechts.",correct:false,reply:"え？",replyGerman:"Wie bitte?"}]},
 {speaker:"相手",prompt:"よろしくおねがいします。",choices:[
 {japanese:"こちらこそ、よろしくおねがいします。",german:"Ganz meinerseits.",correct:true,reply:"ありがとうございます。",replyGerman:"Vielen Dank.",next:null},
 {japanese:"さようなら。",german:"Auf Wiedersehen.",correct:true,reply:"さようなら。",replyGerman:"Auf Wiedersehen.",next:null},
 {japanese:"おちゃをください。",german:"Tee bitte.",correct:false,reply:"え？",replyGerman:"Wie bitte?"}]}
 ]}

];
