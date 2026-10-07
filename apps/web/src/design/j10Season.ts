import type {JPatternName,JSeason} from "./index";

const VALID_SEASONS:readonly JSeason[]=["spring","tsuyu","summer","autumn","winter","new-year"];

export function j10SeasonFromDate(now=new Date()):JSeason{
  const month=now.getMonth()+1;
  const day=now.getDate();
  if(month===1&&day<=7)return "new-year";
  if(month>=3&&month<=5)return "spring";
  if(month===6)return "tsuyu";
  if(month===7||month===8)return "summer";
  if(month>=9&&month<=11)return "autumn";
  return "winter";
}

export function resolveJ10Season(now=new Date(),search?:string):JSeason{
  const raw=search??(typeof window!=="undefined"?window.location.search:"");
  if(raw){
    try{
      const preview=new URLSearchParams(raw).get("season");
      if(preview&&VALID_SEASONS.includes(preview as JSeason))return preview as JSeason;
    }catch{/* malformed QA query falls back to calendar */}
  }
  return j10SeasonFromDate(now);
}

export function j10SeasonLabel(season:JSeason):string{
  switch(season){
    case "spring":return "春";
    case "tsuyu":return "梅雨";
    case "summer":return "夏";
    case "autumn":return "秋";
    case "winter":return "冬";
    case "new-year":return "正月";
  }
}

export function j10SeasonEnglish(season:JSeason):string{
  switch(season){
    case "spring":return "Spring";
    case "tsuyu":return "Rainy season";
    case "summer":return "Summer";
    case "autumn":return "Autumn";
    case "winter":return "Winter";
    case "new-year":return "New Year";
  }
}

export function j10SeasonPattern(season:JSeason):JPatternName{
  switch(season){
    case "spring":return "shippo";
    case "tsuyu":
    case "summer":return "seigaiha";
    case "autumn":return "asanoha";
    case "new-year":return "ichimatsu";
    case "winter":return "kikko";
  }
}
