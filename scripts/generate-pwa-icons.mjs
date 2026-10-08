import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";

const PUBLIC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../apps/web/public");

// Rasterize the immutable geometric logo from public/icon.svg. No network, browser,
// external icon service or unstable bitmap asset is needed during the release build.
function cubic(a,b,c,d,t) {
  const v=1-t;
  return v*v*v*a+3*v*v*t*b+3*v*t*t*c+t*t*t*d;
}
function appendCurve(points,p0,p1,p2,p3) {
  for(let i=1;i<=24;i++) {
    const t=i/24;
    points.push([cubic(p0[0],p1[0],p2[0],p3[0],t),cubic(p0[1],p1[1],p2[1],p3[1],t)]);
  }
}
const MARK=[[184,322]];
appendCurve(MARK,[184,322],[226,312],[261,283],[286,235]);
appendCurve(MARK,[286,235],[304,200],[316,163],[323,124]);
MARK.push([359,124]);
appendCurve(MARK,[359,124],[351,172],[336,216],[314,256]);
appendCurve(MARK,[314,256],[283,312],[240,347],[184,359]);
function insidePolygon(x,y,points) {
  let inside=false;
  for(let i=0,j=points.length-1;i<points.length;j=i++) {
    const a=points[i],b=points[j];
    if((a[1]>y)!==(b[1]>y) && x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;
  }
  return inside;
}
const PAPER=[247,245,240],INK=[31,41,55];
export function createIcon(size) {
  if(![192,512].includes(size))throw new Error("PWA_ICON_SIZE_UNSUPPORTED");
  const png=new PNG({width:size,height:size});
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const sub=[[.25,.25],[.75,.25],[.25,.75],[.75,.75]];
    let r=0,g=0,b=0;
    for(const [sx,sy] of sub){
      const u=(x+sx)*512/size,v=(y+sy)*512/size;
      const circle=(u-256)**2+(v-256)**2<136**2;
      const mark=insidePolygon(u,v,MARK);
      const color=circle&&!mark?INK:PAPER;
      r+=color[0];g+=color[1];b+=color[2];
    }
    const at=(y*size+x)*4;
    png.data[at]=Math.round(r/4);
    png.data[at+1]=Math.round(g/4);
    png.data[at+2]=Math.round(b/4);
    png.data[at+3]=255;
  }
  return PNG.sync.write(png);
}
export function generateIcons() {
  for(const size of [192,512]){
    const target=path.join(PUBLIC,`icon-${size}.png`);
    fs.writeFileSync(target,createIcon(size));
  }
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))generateIcons();
