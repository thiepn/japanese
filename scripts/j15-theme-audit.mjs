import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const stylesPath=path.join(ROOT,"apps/web/src/styles.css");
const j1Path=path.join(ROOT,"apps/web/src/design/j1.css");
const j5Path=path.join(ROOT,"apps/web/src/design/j5.css");
const themePath=path.join(ROOT,"apps/web/src/design/j14Theme.ts");
const mainPath=path.join(ROOT,"apps/web/src/main.tsx");
const shellPath=path.join(ROOT,"apps/web/src/design/J2AppShell.tsx");
const legacyRuntime=path.join(ROOT,"apps/web/src/design/J14DarkRuntime.ts");
const legacyCss=path.join(ROOT,"apps/web/src/design/j14-dark.css");

const styles=fs.readFileSync(stylesPath,"utf8");
const j1=fs.readFileSync(j1Path,"utf8");
const j5=fs.readFileSync(j5Path,"utf8");
const theme=fs.readFileSync(themePath,"utf8");
const main=fs.readFileSync(mainPath,"utf8");
const shell=fs.readFileSync(shellPath,"utf8");

const forbiddenPalette=[
  "#f7f5f0","#faf9f6","#f3f1eb","#f0ede7","#ece8df","#e8e3da","#e5e0d7",
  "#eee9e0","#f3f0e9","#f2efe8","#fff8dc","#fcfbf8","#f8faf7","#f1f6ef",
  "#f7ece8","#fbf4f1","#fff9f6","#fff8f5","#1f2937","#252a32","#2c3138",
  "#817a70","#655f56","#777166","#5f594f","#6c665d","#565149"
];
const paletteLeaks=forbiddenPalette.filter(value=>styles.toLowerCase().includes(value));
const literalWhiteSurface=/background(?:-color)?\s*:\s*(?:white|#fff)(?=[;\s}])/i.test(styles);
const literalWhiteText=/color\s*:\s*(?:white|#fff)(?=[;\s}])/i.test(styles);
const runtimeReferences=[theme,main,shell].some(source=>source.includes("J14DarkRuntime")||source.includes("ensureJ14DarkStyles"));
const sourceRuntimeExists=fs.existsSync(legacyRuntime)||fs.existsSync(legacyCss);
const semanticTokens=[
  "--j-bg-subtle","--j-control-strong","--j-on-strong","--j-positive-bg","--j-positive-fg",
  "--j-warning-bg","--j-warning-fg","--j-danger-fg","--j-note-bg","--j-note-fg"
];
const missingTokens=semanticTokens.filter(token=>!j1.includes(token));
const studyShellNative=!/#fbf8f1|#0d0d0c/i.test(j5.slice(0,260))&&j5.includes("background:var(--j-bg)!important");

const failures=[];
if(paletteLeaks.length)failures.push("legacy palette: "+paletteLeaks.join(", "));
if(literalWhiteSurface)failures.push("literal white surface remains in styles.css");
if(literalWhiteText)failures.push("literal white foreground remains in styles.css");
if(runtimeReferences)failures.push("J14 lazy dark compatibility is still referenced");
if(sourceRuntimeExists)failures.push("J14 dark compatibility source files still exist");
if(missingTokens.length)failures.push("semantic tokens missing: "+missingTokens.join(", "));
if(!studyShellNative)failures.push("Study shell still owns a hard-coded light/dark page background");

const report={
  schema:"thiepn-japanese-j15-native-theme-audit",
  schemaVersion:1,
  passed:failures.length===0,
  assertions:{
    legacyPalettePurged:paletteLeaks.length===0,
    literalWhiteSurfacesPurged:!literalWhiteSurface,
    literalWhiteForegroundsPurged:!literalWhiteText,
    lazyDarkCompatibilityRemoved:!runtimeReferences&&!sourceRuntimeExists,
    semanticStateTokensPresent:missingTokens.length===0,
    studyShellUsesNativeTheme:studyShellNative
  },
  failures
};
fs.mkdirSync(path.join(ROOT,"artifacts"),{recursive:true});
fs.writeFileSync(path.join(ROOT,"artifacts/j15-native-theme-audit.json"),JSON.stringify(report,null,2)+"\n");
if(failures.length)throw new Error("J15_THEME_AUDIT_FAILED: "+failures.join(" | "));
process.stdout.write("J15 native theme audit PASS — legacy palette and lazy dark compatibility removed\n");
