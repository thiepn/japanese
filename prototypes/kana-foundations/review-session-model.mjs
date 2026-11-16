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
