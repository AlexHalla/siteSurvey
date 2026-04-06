import React, { useState, useEffect } from 'react';
import styles from './BubbleAnswer.module.css';

interface BubbleAnswerProps {
  options: Array<{
    id: number;
    text: string;
    scores: number;
  }>;
  selectedId: number | null;
  onSelect: (optionId: number) => void;
}

const BubbleAnswer: React.FC<BubbleAnswerProps> = ({ options, selectedId, onSelect }) => {
  const [justSelected, setJustSelected] = useState<number | null>(null);

  const handleBubbleClick = (optionId: number) => {
    onSelect(optionId);
    setJustSelected(optionId);
    
    // Сбрасываем состояние через 400мс (время анимации)
    setTimeout(() => {
      setJustSelected(null);
    }, 400);
  };

  return (
    <div className={styles.bubbleContainer}>
      {options.map((option, index) => {
        const isSelected = selectedId === option.id;
        const isNewlySelected = justSelected === option.id;
        // Создаем разные цвета для пузырей
        const hue = (index * 60 + 200) % 360; // Оттенки синего/фиолетового
        
        return (
          <button
            key={option.id}
            type="button"
            className={`${styles.bubble} ${isSelected ? styles.selected : ''}`}
            style={{ '--bubble-hue': hue } as React.CSSProperties}
            onClick={() => handleBubbleClick(option.id)}
            aria-pressed={isSelected}
          >
            <span className={styles.bubbleText}>{option.text}</span>
            {(isSelected || isNewlySelected) && (
              <span 
                className={`${styles.checkmark} ${isNewlySelected ? styles.checkmarkAnimate : ''}`}
              >
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BubbleAnswer;
