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
  characterImage: string;

  setTarget: (target: string) => void;
  setSituation: (situation: string) => void;
  addMessage: (message: Message) => void;
  setAnalysis: (analysis: AnalysisResult) => void;
  setCharacterImage: (image: string) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  target: '',
  situation: '',
  messages: [],
  analysis: null,
  characterImage: '',

  setTarget: (target) => set({ target }),
  setSituation: (situation) => set({ situation }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setAnalysis: (analysis) => set({ analysis }),
  setCharacterImage: (image) => set({ characterImage: image }),
  reset: () =>
    set({ target: '', situation: '', messages: [], analysis: null, characterImage: '' }),
}));
