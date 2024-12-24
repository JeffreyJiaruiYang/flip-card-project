import React, { useState } from 'react';
import './Card.css'; // 样式文件

interface CardProps {
  frontImage: string;
  backImage: string;
}

const Card: React.FC<CardProps> = ({ frontImage, backImage }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="card-container" onClick={handleFlip}>
      <div className={`card ${isFlipped ? 'is-flipped' : ''}`}>
        <div
          className="card-face card-front"
          style={{ backgroundImage: `url(${frontImage})` }}
        ></div>
        <div
          className="card-face card-back"
          style={{ backgroundImage: `url(${backImage})` }}
        ></div>
      </div>
    </div>
  );
};

export default Card;
