import { create } from 'zustand';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AnalysisResult {
  totalScore: number;
  grade: string;
  categories: {
    name: string;
    score: number;
    description: string;
  }[];
  strengths: string[];
  improvements: {
    point: string;
    tip: string;
  }[];
  oneLineSummary: string;
}

interface ChatState {
  target: string;
  situation: string;
  messages: Message[];
  analysis: AnalysisResult | null;

  setTarget: (target: string) => void;
  setSituation: (situation: string) => void;
  addMessage: (message: Message) => void;
  setAnalysis: (analysis: AnalysisResult) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  target: '',
  situation: '',
  messages: [],
  analysis: null,

  setTarget: (target) => set({ target }),
  setSituation: (situation) => set({ situation }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setAnalysis: (analysis) => set({ analysis }),
  reset: () =>
    set({ target: '', situation: '', messages: [], analysis: null }),
}));
