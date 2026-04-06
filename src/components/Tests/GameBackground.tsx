import React, { useCallback, useEffect, useState } from 'react';
import styles from './GameBackground.module.css';

type Cloud = {
  id: string;
  leftPct: number;
  durationSec: number;
  sizePx: number;
  driftPx: number;
};

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

const GameBackground: React.FC = () => {
  const [clouds, setClouds] = useState<Cloud[]>([]);

  const removeCloud = useCallback((id: string) => {
    setClouds((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const spawnCloud = useCallback(() => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    
    // Размер облака в пикселях
    const sizePx = Math.round(randomBetween(34, 72));
    
    // Рассчитываем безопасные отступы от краев (в процентах от ширины экрана)
    // Учитываем размер облака и padding контейнера (2% с каждой стороны)
    const cloudWidthPercent = (sizePx / window.innerWidth) * 100;
    const safeMargin = cloudWidthPercent / 2 + 2; // Половина ширины облака + padding 2%
    
    // Создаем больше облачков по краям (слева и справа)
    let leftPct: number;
    const edgeProbability = Math.random();
    
    if (edgeProbability < 0.35) {
      // 35% облачков слева с учетом размера и padding
      leftPct = randomBetween(safeMargin, 15);
    } else if (edgeProbability < 0.70) {
      // 35% облачков справа с учетом размера и padding
      leftPct = randomBetween(85, 98 - safeMargin); // 98% вместо 100% из-за padding
    } else {
      // 30% облачков в центре
      leftPct = randomBetween(15, 85);
    }
    
    const cloud: Cloud = {
      id,
      leftPct,
      durationSec: randomBetween(8, 16),
      sizePx,
      driftPx: Math.round(randomBetween(-28, 28)),
    };
    setClouds((prev) => {
      const next = [...prev, cloud];
      return next.length > 25 ? next.slice(-25) : next;
    });
  }, []);

  useEffect(() => {
    // Создаем несколько облачков сразу при загрузке
    for (let i = 0; i < 5; i++) {
      setTimeout(() => spawnCloud(), i * 200);
    }
    
    // Уменьшаем интервал для более частого появления
    const id = window.setInterval(spawnCloud, 1200);
    
    // Обработчик изменения размера окна
    const handleResize = () => {
      // При изменении размера окна ничего не делаем, новые облака будут создаваться с правильными размерами
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(id);
      window.removeEventListener('resize', handleResize);
    };
  }, [spawnCloud]);

  return (
    <div className={styles.layer} aria-hidden>
      {clouds.map((c) => (
        <button
          key={c.id}
          type="button"
          className={styles.cloud}
          style={
            {
              '--left': `${c.leftPct}%`,
              '--duration': `${c.durationSec}s`,
              '--size': `${c.sizePx}px`,
              '--drift': `${c.driftPx}px`,
            } as React.CSSProperties
          }
          onClick={() => removeCloud(c.id)}
          onAnimationEnd={() => removeCloud(c.id)}
        >
          <span className={styles.cloudGlyph} role="presentation">
            ☁️
          </span>
        </button>
      ))}
    </div>
  );
};

export default GameBackground;
