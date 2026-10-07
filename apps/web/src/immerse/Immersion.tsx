import { useEffect,useMemo,useRef,useState,type ReactNode } from "react";
import { getDefaultAudioProvider } from "@thiepn/audio";
import { JCartouche,JInkProgress,JPattern,JSeal } from "../design";
import { AuthenticLibrary } from "./AuthenticLibrary";
import { buildExtensiveTracks } from "./extensive";
import { ShadowingLab } from "./ShadowingLab";
import { NativeListeningLab } from "./NativeListeningLab";
import { NativeCurationPanel } from "./NativeCurationPanel";
import { C1AdvancedLab } from "./C1AdvancedLab";
import { C1AutonomyPanel } from "../study/C1AutonomyPanel";
import { C1EnvironmentLab } from "./C1EnvironmentLab";
import { C1ResearchQualityLab } from "./C1ResearchQualityLab";
import { C1PrecisionLab } from "./C1PrecisionLab";
import { C1AdvancedInteractionLab } from "./C1AdvancedInteractionLab";
import { C1ProsodyEvaluationLab } from "./C1ProsodyEvaluationLab";
import { getAdaptiveImmersionRecommendation,type AdaptiveImmersionRecommendation } from "./adaptive";
import { getAutonomyMissionProgress,type AutonomyMissionProgress } from "../study/autonomyMissions";
import type { ReadingQuestion } from "@thiepn/content-schema";
import {
  buildReaderText,getImmersionProgress,gradeReadingQuestion,recordListeningExposure,recordListeningSegmentReplay,recordMinedWord,
  recordReaderLookup,recordReadingExposure,recordTextCheck,
  type ImmersionProgress,type ReaderTextView,type ReaderToken
} from "./reader";

type CheckMode="reading"|"listening";
interface SelectedToken { token:ReaderToken; sentenceId:string; }

export function Immersion({onStartProductionTask,onStartC1Synthesis,onOpenC1Coach}:{onStartProductionTask:(taskId:string)=>void;onStartC1Synthesis:(packId:string)=>void;onOpenC1Coach:(chainId:string)=>void}){
  const [progress,setProgress]=useState<ImmersionProgress|null>(null);
  const [recommendation,setRecommendation]=useState<AdaptiveImmersionRecommendation|null>(null);