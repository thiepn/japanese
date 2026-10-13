import type {P43Scene,P43OpeningChoice,P43Route,P43ReturnCue} from "./dialogue43";
export type P43ChoiceSource=readonly [string,string,string];
export type P43RouteSource=readonly [string,string,string,string,string,string,string];
export type P43ReturnSource=readonly [string,string,string,string,string];
export function makeP43Scene(input:{
 id:string;baseArcId:string;level:"A1"|"A2";unitIds:readonly string[];
 title:string;setting:string;goal:string;register:"polite"|"casual";
 openingPartner:string;openingIntention:string;
 direct:P43ChoiceSource;alternate:P43ChoiceSource;mistake:P43ChoiceSource;
 misconception:string;directRoute:P43RouteSource;alternateRoute:P43RouteSource;
 repairRoute:P43RouteSource;returnCue:P43ReturnSource;
}):P43Scene{
 const choice=([form,meaning,consequence]:P43ChoiceSource):P43OpeningChoice=>
  ({form,meaning,consequence});
 const route=([partner,intention,model,alternative,misstep,why,outcome]:P43RouteSource):P43Route=>
  ({partner,intention,model,alternative,misstep,why,outcome});
 const [intention,model,alternative,misstep,why]=input.returnCue;
 return {
  id:input.id,baseArcId:input.baseArcId,level:input.level,unitIds:input.unitIds,
  title:input.title,setting:input.setting,goal:input.goal,register:input.register,
  opening:{partner:input.openingPartner,intention:input.openingIntention,
   direct:choice(input.direct),alternate:choice(input.alternate),
   mistake:choice(input.mistake),misconception:input.misconception},
  routes:{direct:route(input.directRoute),alternate:route(input.alternateRoute),
   repair:route(input.repairRoute)},
  returnCue:{intention,model,alternative,misstep,why}
 };
}
