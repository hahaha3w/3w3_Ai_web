import { create } from 'zustand';

// 扩展心情类型，匹配Sidebar中的四种表情
export type MoodType = 'happy' | 'sad' | 'angry' | 'tired' | 'neutral';

interface MoodState {
  // 当前心情
  mood: MoodType;
  // 设置心情
  setMood: (mood: MoodType) => void;
}

// 心情存储
export const useMoodStore = create<MoodState>((set) => ({
  mood: 'neutral',
  setMood: (mood: MoodType) => set({ mood }),
}));
