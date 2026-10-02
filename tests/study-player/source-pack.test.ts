import { describe,expect,it } from "vitest";
import { parseJapaneseSourcePack,validateJapaneseSourcePack } from "../../apps/web/src/immerse/sourcePacks";

function pack(){
  return parseJapaneseSourcePack({
    manifest:{
      id:"fixture-pack",title:"Fixture Japanese",version:"1.0.0",language:"ja",
      sourceUrl:"https://example.test/source",licenseName:"CC BY 4.0",attribution:"Fixture Author",redistributable:true
    },
    items:[{
      id:"line-1",title:"A reusable dialogue",text:"制度の変更に伴って、説明も変わりました。",
      audio:{
        url:"https://example.test/audio.mp3",credit:"Fixture Speaker",licenseName:"CC BY 4.0",
        attributionUrl:"https://example.test/audio",nativeSpeaker:true
      }
    }]
  });
}

describe("P6 Japanese source-pack policy",()=>{
  it("admits an explicitly redistributable attributed pack and native recording",()=>{
    expect(validateJapaneseSourcePack(pack())).toEqual({valid:true,errors:[],warnings:[]});
  });

  it("rejects non-commercial or non-derivative source-pack licenses",()=>{
    const nc=pack();nc.manifest.licenseName="CC BY-NC 4.0";
    expect(validateJapaneseSourcePack(nc).valid).toBe(false);
    const nd=pack();nd.manifest.licenseName="CC BY-ND 4.0";
    expect(validateJapaneseSourcePack(nd).valid).toBe(false);
  });

  it("does not label audio native without an explicit native-speaker declaration and reusable license",()=>{
    const invalid=pack();invalid.items[0]!.audio!.nativeSpeaker=false;
    invalid.items[0]!.audio!.licenseName="all rights reserved";
    const result=validateJapaneseSourcePack(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/nativeSpeaker|audio license/);
  });

  it("warns instead of fabricating native audio when text has no recording",()=>{
    const textOnly=pack();delete textOnly.items[0]!.audio;
    const result=validateJapaneseSourcePack(textOnly);
    expect(result.valid).toBe(true);
    expect(result.warnings[0]).toMatch(/no reusable native recording/i);
  });
});
