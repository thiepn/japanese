import type {CourseFirstUnit} from "./courseAuthoring";

/** Original Unit 16 café teaching; original E02 food journey remains unchanged. */
export const C5_A1_CAFE:CourseFirstUnit={
 id:"a1-unit-16",title:"Polite café orders and simple menus",
 objective:"Get staff attention politely, request a drink, read a short menu, confirm an order and distinguish ordering from expressing a preference.",
 lessons:[
 {id:"cf-a1-16-01",title:"Excuse me — tea, please",
  objective:"Make a simple, polite request with item + をください after gaining attention.",
  teach:"In a shop or café, すみません can politely attract a staff member's attention. To request an item, say お茶をください ('Tea, please') or 水をください ('Water, please'). The particle を marks the requested item. This is a different construction from お茶が好きです ('I like tea'): liking something does not itself order it. After receiving your item, say ありがとうございます. Staff may say いらっしゃいませ when welcoming customers; you do not need to repeat it to them.",
  examples:[["すみません。お茶をください。","Excuse me. Tea, please."],["水をください。","Water, please."],["店員：はい、どうぞ。","Staff: Certainly, here you are."],["ありがとうございます。","Thank you very much."]],
  checks:[
   ["客：すみません。お茶をください。 What is the customer requesting?","Tea","Water","A train ticket","お茶 is tea; をください is a request for an item."],
   ["Which sentence politely orders water?","水をください。","水が好きですか。","水に行きました。","水をください directly requests water."],
   ["Which sentence reports a preference without ordering?","お茶が好きです。","お茶をください。","これをください。","が好きです expresses liking; をください requests an item."],
   ["When staff hands you a drink, which response fits?","ありがとうございます。","何時からですか。","どこから来ましたか。","A thank-you is appropriate after the item is handed over."]
  ],
  recall:["Write 'Excuse me. Tea, please' using すみません and お茶.","すみません。お茶をください。"],
  writing:"Write an original four-turn café scene: customer attracts attention, requests a drink, staff hands it over, customer thanks them. Use a drink other than tea in one changed-context version."},
 {id:"cf-a1-16-02",title:"Choose the drink, not a grammar mistake",
  objective:"Transfer N をください across different drinks while using simple polite alternatives accurately.",
  teach:"A request may use N をください, as in コーヒーをください ('Coffee, please'). N をお願いします ('N, please') is another polite and common ordering form in context. The requested item belongs immediately before を. Compare コーヒーが好きです (I like coffee) with コーヒーをください (Coffee, please). Mixing these two patterns can confuse staff about whether you are ordering. すみません is for politely approaching them, not a required word in every response.",
  examples:[["コーヒーをください。","Coffee, please."],["紅茶をお願いします。","Black tea, please."],["コーヒーが好きです。","I like coffee."],["すみません。水をお願いします。","Excuse me. Water, please."]],
  checks:[
   ["A server asks ご注文は？ Which statement clearly orders coffee?","コーヒーをください。","コーヒーが好きです。","コーヒーに来ました。","をください is the direct request pattern."],
   ["Which is a polite alternative to 水をください?","水をお願いします。","水にお願いします。","水が行きます。","N をお願いします can be used as a polite request."],
   ["What does ご注文は？ ask in a café?","What would you like to order?","When does class start?","Where did you travel from?","注文 refers to an order; this question invites the customer to order."],
   ["Which indicates a preference rather than a request?","紅茶が好きです。","紅茶をください。","紅茶をお願いします。","が好きです expresses liking tea."]
  ],
  recall:["Write 'Coffee, please' with コーヒー and お願いします.","コーヒーをお願いします。"],
  writing:"Create two mini-dialogues set in the same café: one character says what they like, then later actually orders something. Show the difference in grammar by using が好きです and をください or をお願いします."},
 {id:"cf-a1-16-03",title:"One or two?",
  objective:"Use 一つ and 二つ to request a simple quantity of the same item.",
  teach:"A beginner can request a quantity with the native counter つ: 一つ（ひとつ）means one item, 二つ（ふたつ）means two. In a café, お茶を二つください may be understood as two servings of tea, though specialised counters can also be used depending on the service and item. Compare コーヒーを一つください and コーヒーを二つください carefully: changing one character changes the quantity. Do not interpret 二つ as a price or a time.",
  examples:[["コーヒーを一つください。","One coffee, please."],["お茶を二つください。","Two teas, please."],["水を一つお願いします。","One water, please."],["二つです。","There are two items."]],
  checks:[
   ["客：お茶を二つください。 How many servings are requested?","Two","One","Three","二つ means two items."],
   ["Which requests ONE coffee?","コーヒーを一つください。","コーヒーを二つください。","コーヒーが好きです。","一つ means one; 二つ means two."],
   ["店員：二つですか。 The staff is checking what?","The quantity of two","The start time","The destination","二つ counts items rather than time or destination."],
   ["Choose the request for TWO waters.","水を二つください。","水を一つください。","水は二時からです。","二つ is the requested quantity."]
  ],
  recall:["Write 'Two coffees, please' using コーヒー and 二つ.","コーヒーを二つください。"],
  writing:"Write a café request for one drink and then a revised request for two of the same drink. Add a natural staff confirmation question about the quantity."},
 {id:"cf-a1-16-04",title:"Read a three-item café menu",
  objective:"Retrieve exact items and prices from a short Japanese menu without mixing quantities and yen amounts.",
  teach:"Study the original mock menu: お茶 200円 / 水 100円 / コーヒー 350円. 円（えん）means yen; it gives a price, not a quantity of drinks. A customer asks これはいくらですか ('How much is this?'), while お茶をください orders the tea. The list tells you the price of one listed menu item but it does not state opening hours or anything about ingredients. A careful reader avoids inferring unsupported information. Imagine the server points to コーヒー: the shown price is 350円, not 200円.",
  examples:[["お茶：二百円","Tea: ¥200"],["水：百円","Water: ¥100"],["コーヒー：三百五十円","Coffee: ¥350"],["これはいくらですか。","How much is this?"]],
  checks:[
   ["Menu: お茶 200円 / 水 100円 / コーヒー 350円. Which item costs 100円?","水","お茶","コーヒー","水 (water) is the 100-yen entry."],
   ["How much is コーヒー on this menu?","350円","200円","100円","The coffee line lists 三百五十円, 350 yen."],
   ["Which is the appropriate question about the price of a pointed-to item?","これはいくらですか。","この人はだれですか。","何時からですか。","いくら asks how much."],
   ["Which fact is NOT given by this menu?","What ingredients the coffee contains","The price of tea","The price of water","The menu only lists named items and prices."]
  ],
  recall:["Write 'This is 200 yen' using 二百円.","これは二百円です。"],
  writing:"Make an original small Japanese menu with three drinks and three different clearly written prices. Write two Japanese customer questions, one price response and an order. Do not invent allergen or ingredient claims without sources."},
 {id:"cf-a1-16-05",title:"Check the order before thanking",
  objective:"Follow an order confirmation and correct an incorrect item or quantity without silently accepting it.",
  teach:"When an order is repeated back, pay attention to both item and count. If you asked コーヒーを二つください but the server says コーヒーを一つですね, the quantity differs. A short polite correction can be いいえ、二つです ('No, two'). For a different drink, say いいえ、コーヒーです ('No, coffee'). The phrase そうです ('That's right') accepts what staff just repeated, so use it only when the item and quantity are correct. A final ありがとうございます thanks the server; it does not correct the order.",
  examples:[["客：コーヒーを二つください。","Customer: Two coffees, please."],["店員：一つですね。","Staff: One, right?"],["客：いいえ、二つです。","Customer: No, two."],["店員：二つですね。客：はい、そうです。","Staff: Two, right? Customer: Yes, correct."]],
  checks:[
   ["The customer requested 二つ, but staff repeats 一つ. Which is an appropriate correction?","いいえ、二つです。","はい、そうです。","何時からですか。","いいえ、二つです corrects the quantity to two."],
   ["Staff repeats the correct item and quantity. Which response accepts it?","はい、そうです。","いいえ、一つです。","どこから来ましたか。","はい、そうです agrees with what staff just said."],
   ["The customer asked for コーヒー, but staff repeats お茶. Which is a short correction?","いいえ、コーヒーです。","はい、お茶です。","はい、何時までですか。","A correction should name the intended drink."],
   ["What must be checked before saying はい、そうです to an order read-back?","The drink and quantity","The customer's nationality","The meeting end time","Order confirmation should match what was actually requested."]
  ],
  recall:["Write 'No, two' in response to an incorrect one-item confirmation.","いいえ、二つです。"],
  writing:"Write a six-turn original café exchange: order two of one drink, hear the wrong quantity, correct it, receive the corrected read-back, confirm it, and thank the staff. Keep the item and count consistent."},
 {id:"cf-a1-16-06",title:"Original café-order conversation",
  scene:"food",objective:"Complete the original Mina–staff E02 food-order scene, keeping its native listening/reading/reply/recall identities and delayed review."}
 ]};
