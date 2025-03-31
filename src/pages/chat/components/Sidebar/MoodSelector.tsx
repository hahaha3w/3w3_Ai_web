import React from 'react';
import { MoodType } from '@/store/mood';
import styles from './Sidebar.module.scss';

interface MoodSelectorProps {
  mood: MoodType;
  onSetMood: (moodType: MoodType) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ mood, onSetMood }) => {
  // 心情映射表
  const moodMap: Record<MoodType, { emoji: string; text: string }> = {
    happy: { emoji: "😊", text: "开心" },
    sad: { emoji: "😢", text: "难过" },
    angry: { emoji: "😡", text: "生气" },
    tired: { emoji: "😴", text: "疲惫" },
    neutral: { emoji: "😐", text: "平静" },
  };

  return (
    <div className="mb-4">
      <div className="px-2 py-2">
        <h3 className="text-base font-medium">今日心情</h3>
      </div>

      <div className="flex justify-between mt-2">
        {(["happy", "sad", "angry", "tired", "neutral"] as MoodType[]).map(
          (moodType) => (
            <div
              key={moodType}
              className={`${styles.moodItem} ${
                mood === moodType ? styles.active : ""
              }`}
              onClick={() => onSetMood(moodType)}
            >
              <span className={styles.moodEmoji}>
                {moodMap[moodType].emoji}
              </span>
              <div className={styles.moodText}>
                {moodMap[moodType].text}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MoodSelector;
