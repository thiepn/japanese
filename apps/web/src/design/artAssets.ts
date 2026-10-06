export type JVisualAssetLicense="CC0"|"Public Domain"|"Original"|"Other Open License";

export type JVisualAssetRecord={
  id:string;
  kind:"artwork"|"font"|"texture"|"icon"|"other";
  title:string;
  creator:string|null;
  period:string|null;
  sourceInstitution:string;
  sourceUrl:string;
  mediaUrl:string|null;
  rightsStatement:string;
  license:JVisualAssetLicense;
  redistributionAllowed:boolean;
  modificationAllowed:boolean;
  attribution:string|null;
  retrievedAt:string;
  surfaces:string[];
  transformationNotes:string|null;
  verifiedBy:string;
  verifiedAt:string;
};

/**
 * J1 ships no third-party visual artwork.
 * Add external assets here only after docs/J_ASSET_PROVENANCE.md is satisfied.
 */
export const J_VISUAL_ASSETS:readonly JVisualAssetRecord[]=[];

export function validateJVisualAssets(records:readonly JVisualAssetRecord[]=J_VISUAL_ASSETS):string[]{
  const errors:string[]=[];
  const ids=new Set<string>();

  for(const record of records){
    if(ids.has(record.id))errors.push("Duplicate visual asset id: "+record.id);
    ids.add(record.id);

    if(!record.redistributionAllowed){
      errors.push(record.id+": redistribution must be explicitly allowed before shipping");
    }
    if(!record.rightsStatement.trim()){
      errors.push(record.id+": rights statement is required");
    }
    if(!record.sourceUrl.startsWith("https://")){
      errors.push(record.id+": sourceUrl must be HTTPS");
    }
    if(record.mediaUrl!==null&&!record.mediaUrl.startsWith("https://")){
      errors.push(record.id+": mediaUrl must be HTTPS when supplied");
    }
    if(!record.verifiedBy.trim()||!record.verifiedAt.trim()){
      errors.push(record.id+": verification metadata is required");
    }
  }

  return errors;
}
