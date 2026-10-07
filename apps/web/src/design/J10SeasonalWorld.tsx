import type {JSeason} from "./index";

export function J10SeasonalWorld({season,compact=false}:{season:JSeason;compact?:boolean}){
  return <div className={"j10-seasonal-world"+(compact?" j10-seasonal-world--compact":"")} data-j10-season={season} aria-hidden="true">
    <span className="j10-seasonal-world__wash"/>
    <span className="j10-seasonal-world__motif j10-seasonal-world__motif--a"/>
    <span className="j10-seasonal-world__motif j10-seasonal-world__motif--b"/>
    <span className="j10-seasonal-world__motif j10-seasonal-world__motif--c"/>
    <span className="j10-seasonal-world__line j10-seasonal-world__line--a"/>
    <span className="j10-seasonal-world__line j10-seasonal-world__line--b"/>
    <span className="j10-seasonal-world__seal">{season==="spring"?"春":season==="tsuyu"?"雨":season==="summer"?"夏":season==="autumn"?"秋":season==="winter"?"冬":"正"}</span>
  </div>;
}
