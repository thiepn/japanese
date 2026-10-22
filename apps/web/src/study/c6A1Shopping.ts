import type {CourseFirstUnit} from "./courseAuthoring";

/** Original C6 price and purchase material. The native E02 shopping scene is unchanged. */
export const C6_A1_SHOPPING:CourseFirstUnit={
 id:"a1-unit-17",title:"Shopping and price decisions",
 objective:"Ask prices, read simple item labels, compare totals and request or decline an item politely.",
 lessons:[
 {id:"cf-a1-17-01",title:"How much is this?",
  objective:"Ask for the price of an item using これはいくらですか and identify the answer.",
  teach:"In a shop, これはいくらですか asks 'How much is this?' The demonstrative これ refers to an object near the speaker; いくら asks the price. The answer can be 五百円です ('It is 500 yen'). 円 is the currency unit, not a counter for objects. Point to the right item before asking: asking a price does not mean that you have agreed to buy it.",
  examples:[["これはいくらですか。","How much is this?"],["五百円です。","It is 500 yen."],["このノートはいくらですか。","How much is this notebook?"],["三百円です。","It is 300 yen."]],
  checks:[
   ["客：これはいくらですか。 What is the customer asking?","The item's price","The customer's name","When the shop opens","いくら asks how much an item costs."],
   ["店員：五百円です。 What price was given?","500 yen","50 yen","1,000 yen","五百 means five hundred; 円 means yen."],
   ["Which asks about the price of a notebook?","このノートはいくらですか。","このノートをください。","ノートが好きです。","いくら asks for the price; をください requests an item."],
   ["After asking これはいくらですか, what is NOT yet established?","That a purchase was made","That the customer asked a price","That the item is near the speaker","A price inquiry is not a completed purchase."]
  ],
  recall:["Write 'How much is this?' with これ.","これはいくらですか。"],
  writing:"Write an original four-turn shop interaction: ask about two different items, receive their prices, then decide what else you need to know before buying."},
 {id:"cf-a1-17-02",title:"This one, that one, over there",
  objective:"Distinguish これ, それ, あれ and the noun modifiers この, その, あの.",
  teach:"これ is 'this one' near me; それ is 'that one' near you; あれ refers to one away from both of us. These stand alone as nouns. When a noun follows, use この, その or あの instead: このかばん ('this bag'), そのノート ('that notebook near you'), あのかさ ('that umbrella over there'). Avoid これかばん. In a real shop, the speaker's and listener's positions determine which form fits.",
  examples:[["これはノートです。","This is a notebook."],["それはいくらですか。","How much is that near you?"],["あれはかばんです。","That over there is a bag."],["このかばんは千円です。","This bag costs 1,000 yen."]],
  checks:[
   ["The customer points to a bag beside THEM and names it. Choose the phrase.","このかばん","これかばん","あれかばん","この modifies the following noun かばん."],
   ["An item is next to the listener. Which standalone demonstrative fits?","それ","これ","あれ","それ refers to a thing near the listener."],
   ["Both people point to an umbrella far away. Which standalone form fits?","あれ","これ","それ","あれ points away from both participants."],
   ["Which sentence correctly asks the price of THAT notebook near the listener?","そのノートはいくらですか。","それノートはいくらですか。","このノートを何時ですか。","その modifies ノート and いくら requests the price."]
  ],
  recall:["Write 'How much is that notebook?' using その.","そのノートはいくらですか。"],
  writing:"Sketch a fictional shop display in your notes with two people and three objects. Write three original price questions whose demonstratives match each object's position."},
 {id:"cf-a1-17-03",title:"Read the price correctly",
  objective:"Identify 百, 千 and the price of each of several labelled products.",
  teach:"Shopping prices may include 百 (100) and 千 (1,000). 五百円 is 500 yen; 千円 is 1,000 yen; 千五百円 is 1,500 yen. Be careful: 五十円 is 50 yen, not five hundred. Read this mock label set: ノート 五百円 / かばん 千五百円 / かさ 千円. Each yen amount belongs to the item on its own line. Prices here are fictional language-practice examples, not current market prices.",
  examples:[["ノート：五百円","Notebook: 500 yen"],["かばん：千五百円","Bag: 1,500 yen"],["かさ：千円","Umbrella: 1,000 yen"],["これは五十円です。","This costs 50 yen."]],
  checks:[
   ["Price labels: ノート 五百円 / かばん 千五百円 / かさ 千円. How much is the bag?","1,500 yen","500 yen","1,000 yen","The かばん label is 千五百円."],
   ["Which label is 50 yen rather than 500 yen?","五十円","五百円","千円","十 means ten, while 百 means one hundred."],
   ["According to the labels, which item is cheapest?","Notebook","Bag","Umbrella","The notebook is 500 yen, less than the other two prices."],
   ["What price does 千円 state?","1,000 yen","100 yen","10,000 yen","千 is one thousand."]
  ],
  recall:["Write 'It is 1,500 yen' using 千五百円.","千五百円です。"],
  writing:"Create three fictional product labels with different prices including at least one 千 amount. Write a short Japanese question-and-answer pair about the cheapest item and one about the most expensive."},
 {id:"cf-a1-17-04",title:"Two customers, one shop notice",
  objective:"Read two connected shopping exchanges and distinguish who buys which product.",
  teach:"Follow both original exchanges: 『ミナ：このノートはいくらですか。店員：五百円です。ミナ：じゃあ、これをください。』 『ケン：そのかばんはいくらですか。店員：千五百円です。ケン：ありがとうございます。今日は買いません。』 じゃあ signals a decision in context; 今日は買いません means 'I will not buy it today'. Mina explicitly requests the notebook, but Ken only asks the price and declines to purchase today. Never infer a purchase solely from a price inquiry.",
  examples:[["このノートはいくらですか。","How much is this notebook?"],["じゃあ、これをください。","Then I'll take this one."],["そのかばんはいくらですか。","How much is that bag near you?"],["今日は買いません。","I won't buy it today."]],
  checks:[
   ["Who explicitly asks to purchase an item in the two exchanges?","Mina","Ken","Both","Mina says これをください; Ken says 今日は買いません."],
   ["What is the price of Ken's bag?","1,500 yen","500 yen","1,000 yen","The clerk answers 千五百円 about the bag."],
   ["Which item did Mina ask for?","Notebook","Bag","Umbrella","Mina points to ノート and says これをください."],
   ["What conclusion is supported about Ken?","He does not buy the bag today","He buys the bag","He bought the notebook yesterday","今日は買いません explicitly declines buying today."]
  ],
  recall:["Write 'I won't buy it today' using 今日.","今日は買いません。"],
  writing:"Write two short customer exchanges in one fictional shop. Customer A requests an item after learning its price; customer B asks a different price but decides not to buy. Make both outcomes explicit."},
 {id:"cf-a1-17-05",title:"A changed price, a clear decision",
  objective:"Ask about a replacement price and choose an appropriate buying or declining response.",
  teach:"When the item changes, ask its price again rather than reusing a previous answer. Imagine a customer thought a notebook cost 五百円, but the new notebook is 千円. Say このノートはいくらですか and listen for 千円です. Then これをください is a request to buy, while 今日は買いません declines for today. You can add すみません before a question and ありがとうございます after receiving an answer. A product's price and the buyer's choice are distinct facts.",
  examples:[["すみません。このノートはいくらですか。","Excuse me. How much is this notebook?"],["千円です。","It is 1,000 yen."],["じゃあ、これをください。","Then I'll take this."],["ありがとうございます。今日は買いません。","Thank you. I won't buy it today."]],
  checks:[
   ["The shopkeeper says 千円です about the NEW notebook. What price should be remembered?","1,000 yen","500 yen","1,500 yen","The replacement item's latest price is 千円."],
   ["You decide to buy the item. Which sentence communicates that choice?","これをください。","これはいくらですか。","今日は買いません。","をください requests the chosen item."],
   ["You decline to buy today. Which response is clear?","今日は買いません。","これをください。","買いました。","買いません is polite nonpast negative: not buying."],
   ["Which assumption is unsafe after hearing a shop price?","The customer definitely buys it","The staff stated a price","The customer knows the quoted amount","Knowing a price does not mean accepting a purchase."]
  ],
  recall:["Write 'Then I'll take this one' with じゃあ and これ.","じゃあ、これをください。"],
  writing:"Write a six-turn original shopping dialogue: ask a price, realize you were looking at the wrong item, ask the new item's price, hear the changed amount, and either request it or politely decline. Keep the amounts and decision consistent."},
 {id:"cf-a1-17-06",title:"Original notebook-price conversation",
  scene:"shopping",objective:"Comprehend Mina's original notebook shopping exchange and complete native E02 price, reply and changed-item review checks."}
 ]};
