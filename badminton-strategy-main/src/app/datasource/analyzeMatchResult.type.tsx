import { Set } from "./match.type";

export interface Advice {
  title: string;
  text: string;
  comment: string;
  tag: string[];
}

export interface MatchAnalysisResult {
  mainAdvice: Advice;
  secondaryAdvices: Advice[];
}

export type PostMatchAnalysisResult = {
  timestamp: number;
  type: 'double' | 'simple';
  player_1_name: string;
  player_2_name?: string;
  opponent_1_name: string;
  opponent_2_name?: string;
  phase: '1_11' | '1_21' | '2_11' |'2_21' | '3_11';
  sets: Set[];
}