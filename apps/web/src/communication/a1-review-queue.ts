/** Pure session selection. Only eligible cards may be selected or retried. */
export function nextRecallCard<T extends {id:string}>(
 eligible:readonly T[],retries:readonly string[],seen:readonly string[],previousId?:string
):T|undefined{
 const eligibleIds=new Set(eligible.map(item=>item.id));
 const retry=retries.find(id=>eligibleIds.has(id)&&id!==previousId);
 if(retry)return eligible.find(item=>item.id===retry);
 const unseen=eligible.find(item=>!seen.includes(item.id)&&item.id!==previousId);
 if(unseen)return unseen;
 const alternate=eligible.find(item=>item.id!==previousId);
 return alternate??eligible[0];
}
export function advanceRecallQueue(
 retries:readonly string[],seen:readonly string[],answeredId:string,correct:boolean,eligibleIds:readonly string[]
):{retries:string[];seen:string[]}{
 const allowed=new Set(eligibleIds);
 const filtered=retries.filter(id=>allowed.has(id)&&id!==answeredId);
 if(!correct&&allowed.has(answeredId))filtered.push(answeredId);
 return {retries:[...new Set(filtered)],seen:[...new Set([...seen,answeredId])].filter(id=>allowed.has(id))};
}
