import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ValentineProposal.css';

const ValentineProposal = () => {
  const [accepted, setAccepted] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const noButtonRef = useRef(null);

  // Load Tenor embed script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://tenor.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const moveNoButton = useCallback(() => {
    const maxX = window.innerWidth - 120;
    const maxY = window.innerHeight - 50;
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    setNoButtonPos({ x: newX, y: newY });
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (accepted || !noButtonRef.current) return;

    const noButton = noButtonRef.current.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const buttonCenterX = noButton.left + noButton.width / 2;
    const buttonCenterY = noButton.top + noButton.height / 2;
    const distance = Math.sqrt(
      Math.pow(mouseX - buttonCenterX, 2) + Math.pow(mouseY - buttonCenterY, 2)
    );

    if (distance < 100) {
      moveNoButton();
    }
  }, [accepted, moveNoButton]);

  const handleYesClick = () => {
    setAccepted(true);
    createConfetti();
  };

  const createConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const colors = ['#ff0000', '#ff69b4', '#ff1493', '#ffc0cb', '#ff6b9d'];

    const confettiInterval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(confettiInterval);
        return;
      }

      for (let i = 0; i < 5; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
      }
    }, 100);
  };

  useEffect(() => {
    if (!accepted) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [accepted, handleMouseMove]);

  return (
    <div className="valentine-container">
      {!accepted ? (
        <div className="proposal-screen">
          <div className="content-center">
            <div className="intro-gif">
              <div 
                className="tenor-gif-embed" 
                data-postid="14801073887683685524" 
                data-share-method="host" 
                data-aspect-ratio="1.15714" 
                data-width="100%"
              >
                <a href="https://tenor.com/view/dudu-bubu-cute-gif-peachugomu-gif-14801073887683685524">
                  Dudu Bubu Cute Gif
                </a>
              </div>
            </div>
            
            <h1 className="romantic-heading">
              Will you be my Valentine? 💕
            </h1>
            
            <div className="button-container">
              <button className="yes-button" onClick={handleYesClick}>
                Yes! ❤️
              </button>
              
              <button 
                ref={noButtonRef}
                className="no-button"
                style={{
                  position: noButtonPos.x || noButtonPos.y ? 'fixed' : 'relative',
                  left: noButtonPos.x ? `${noButtonPos.x}px` : 'auto',
                  top: noButtonPos.y ? `${noButtonPos.y}px` : 'auto',
                  transition: 'all 0.3s ease-out'
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="celebration-screen">
          <div className="celebration-content">
            <div className="celebration-gif">
              <img 
                src="/celebration.gif" 
                alt="Celebration" 
                className="gif-image"
              />
            </div>
            
            <h1 className="celebration-message">
              Yes,I lovee youuu babyyy ❤️
            </h1>
            
            <div className="hearts-float">
              <span className="heart">❤️</span>
              <span className="heart">💕</span>
              <span className="heart">💖</span>
              <span className="heart">💗</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValentineProposal;
