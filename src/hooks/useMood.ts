import { useMoodStore, MoodType } from '../store/mood';

// 更新的心情钩子
export const useMood = () => {
  const { mood, setMood } = useMoodStore();
  
  return {
    mood,
    setMood,
    isHappy: mood === 'happy',
    isSad: mood === 'sad',
    isAngry: mood === 'angry',
    isTired: mood === 'tired',
    isNeutral: mood === 'neutral',
    // 检查是否为特定心情的通用方法
    isMood: (type: MoodType) => mood === type
  };
};

export default useMood;
