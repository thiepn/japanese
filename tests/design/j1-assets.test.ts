import {describe,expect,it} from "vitest";
import {validateJVisualAssets,type JVisualAssetRecord} from "../../apps/web/src/design/artAssets";

describe("J1 visual asset provenance registry",()=>{
  it("ships clean when only admitted assets are present",()=>{
    expect(validateJVisualAssets()).toEqual([]);
  });

  it("rejects non-redistributable or weakly documented external assets",()=>{
    const record:JVisualAssetRecord={
      id:"example",
      kind:"artwork",
      title:"Example",
      creator:null,
      period:null,
      sourceInstitution:"Example Museum",
      sourceUrl:"http://example.com/object",
      mediaUrl:null,
      rightsStatement:"",
      license:"Other Open License",
      redistributionAllowed:false,
      modificationAllowed:false,
      attribution:null,
      retrievedAt:"2026-10-07",
      surfaces:["sandbox"],
      transformationNotes:null,
      verifiedBy:"",
      verifiedAt:"",
    };

    const errors=validateJVisualAssets([record]);
    expect(errors.some((error)=>error.includes("redistribution"))).toBe(true);
    expect(errors.some((error)=>error.includes("rights statement"))).toBe(true);
    expect(errors.some((error)=>error.includes("sourceUrl"))).toBe(true);
    expect(errors.some((error)=>error.includes("verification"))).toBe(true);
  });
});
