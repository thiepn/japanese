import {test,expect} from '@playwright/test';
import {writeFileSync,mkdirSync} from 'node:fs';

test('read genuine hashed Commons originals and probe Ogg Vorbis browser decoding',async({page,request},testInfo)=>{
 await page.goto('/index.html');
 const response=await request.get('/verified-audio-manifest.json');
 expect(response.ok()).toBe(true);
 const manifest=await response.json();
 expect(manifest.candidate_count).toBe(5);
 expect(manifest.human_auditory_approval).toBe('PENDING');
 expect(manifest.production_integration).toBe('PROHIBITED_BEFORE_REVIEW');
 const evidence=await page.evaluate(async items=>{
  const results=[];
  for(const item of items){
   const response=await fetch('/review-only-originals/'+encodeURIComponent(item.filename));
   if(!response.ok)throw new Error('Original audio not served '+item.filename);
   const bytes=await response.arrayBuffer();
   const actualHash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))]
    .map(n=>n.toString(16).padStart(2,'0')).join('');
   if(actualHash!==item.computed_sha256_hex)throw new Error('Browser source byte hash mismatch: '+item.filename);
   const tag=document.createElement('audio');
   const canPlayType=tag.canPlayType('audio/ogg; codecs="vorbis"');
   let loadedMetadata=false,metadataError=null,elementDurationSeconds=null;
   const fileUrl='/review-only-originals/'+encodeURIComponent(item.filename);
   const media=await new Promise(resolve=>{
    const audio=document.createElement('audio');
    let done=false;
    function finish(out){
     if(done)return;
     done=true;clearTimeout(timer);
     audio.removeAttribute('src');audio.load();
     resolve(out);
    }
    const timer=setTimeout(()=>finish({ok:false,reason:'metadata timeout'}),4500);
    audio.preload='metadata';
    audio.onloadedmetadata=()=>finish({ok:true,duration:audio.duration});
    audio.onerror=()=>finish({ok:false,reason:'HTMLAudioElement decode/metadata error'});
    audio.src=fileUrl;
    audio.load();
   });
   loadedMetadata=media.ok;
   metadataError=media.reason||null;
   elementDurationSeconds=Number.isFinite(media.duration)?media.duration:null;
   let decoded=false,decodeError=null,decodedDuration=null,sampleRate=null,decodeElapsedMs=null;
   try{
    const Ctx=window.AudioContext||window.webkitAudioContext;
    if(!Ctx)throw new Error('AudioContext unavailable');
    const ctx=new Ctx();
    const t=performance.now();
    const audioBuffer=await Promise.race([
     ctx.decodeAudioData(bytes.slice(0)),
     new Promise((_,reject)=>setTimeout(()=>reject(new Error('decode timeout')),4500))
    ]);
    decodeElapsedMs=Math.round((performance.now()-t)*100)/100;
    decodedDuration=audioBuffer.duration;
    sampleRate=audioBuffer.sampleRate;
    decoded=true;
    await ctx.close();
   }catch(err){decodeError=String(err?.name||'Error')+': '+String(err?.message||err);}
   results.push({kana:item.kana,filename:item.filename,source_sha256_verified:true,
    media_can_play_type:canPlayType,html_audio_metadata_loaded:loadedMetadata,
    html_audio_duration_seconds:elementDurationSeconds,html_audio_error:metadataError,
    audio_context_decoded:decoded,audio_context_duration_seconds:decodedDuration,
    decoded_sample_rate_hz:sampleRate,decode_elapsed_ms:decodeElapsedMs,decode_error:decodeError,
    human_auditory_review:'PENDING'});
  }
  return results;
 },manifest.items);
 expect(evidence).toHaveLength(5);
 expect(evidence.every(e=>e.source_sha256_verified)).toBe(true);
 const summary={browser:testInfo.project.name,environment:'GitHub Actions browser, no human listening',
  original_file_count:5,
  html_audio_supported:evidence.filter(e=>e.html_audio_metadata_loaded).length,
  audio_context_decoded:evidence.filter(e=>e.audio_context_decoded).length,
  release_approved:false,evidence};
 const out=process.env.KANA_AUDIO_REVIEW_DIR;
 if(out){
  mkdirSync(out+'/browser-compatibility',{recursive:true});
  writeFileSync(out+'/browser-compatibility/'+testInfo.project.name+'.json',JSON.stringify(summary,null,2)+'\n');
 }
 await testInfo.attach('isolated-browser-decode-evidence',{body:Buffer.from(JSON.stringify(summary,null,2)),contentType:'application/json'});
 console.log('SOURCE_BYTE_VERIFIED browser='+testInfo.project.name+
  ' html_audio='+summary.html_audio_supported+'/5 audiocontext='+summary.audio_context_decoded+'/5');
});
