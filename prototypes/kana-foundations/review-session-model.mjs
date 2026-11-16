// Self-assessment only: immutable, memory-only review round state.
const RATINGS=Object.freeze(['remembered','again']);
export function createReviewRound(ids,number=1){
 if(!Array.isArray(ids)||!ids.every(id=>Number.isInteger(id)&&id>=0)||
    new Set(ids).size!==ids.length||!Number.isInteger(number)||number<1)
  throw Error('Invalid review queue.');
 return {ids:[...ids],position:0,ratings:{},finished:ids.length===0,number};
}
export function rateReviewPrompt(round,rating){
 if(round.finished||!RATINGS.includes(rating))return round;
 const id=round.ids[round.position];
 const ratings={...round.ratings,[id]:rating};
 const last=round.position===round.ids.length-1;
 return {...round,ratings,position:last?round.position:round.position+1,finished:last};
}
export function moveReviewPrompt(round,delta){
 if(round.finished||![-1,1].includes(delta))return round;
 const position=round.position+delta;
 return position<0||position>=round.ids.length?round:{...round,position};
}
export function finishReviewRound(round){
 return {...round,finished:true};
}
export function reviewRoundSummary(round){
 const remembered=round.ids.filter(id=>round.ratings[id]==='remembered').length;
 const again=round.ids.filter(id=>round.ratings[id]==='again').length;
 return {total:round.ids.length,remembered,again,unrated:round.ids.length-remembered-again};
}
export function retryReviewRound(round){
 const ids=round.ids.filter(id=>round.ratings[id]!=='remembered');
 return ids.length?createReviewRound(ids,round.number+1):null;
}


// Pure order-only transform: no card changes, scheduler updates or persistence.
// Injecting random enables deterministic tests; normal pages use Math.random.
export function orderReviewIds(ids,mode='lesson',random=Math.random){
 if(!Array.isArray(ids)||!ids.every(id=>Number.isInteger(id)&&id>=0)||
    new Set(ids).size!==ids.length)throw Error('Invalid review queue.');
 if(mode!=='lesson'&&mode!=='mixed')throw Error('Unknown review order.');
 const ordered=[...ids];
 if(mode==='mixed'){
  if(typeof random!=='function')throw Error('Invalid random source.');
  for(let i=ordered.length-1;i>0;i--){
   const v=random();
   if(!Number.isFinite(v)||v<0||v>=1)throw Error('Invalid random source.');
   const j=Math.floor(v*(i+1));
   [ordered[i],ordered[j]]=[ordered[j],ordered[i]];
  }
 }
 return ordered;
}
