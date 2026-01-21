import React, { useState, useEffect } from 'react';

const FeedbackPopup = ({ onDismiss }) => {
  const [position, setPosition] = useState({ top: '20px', left: '20px' });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Random position on screen
    const positions = [
      { top: '20px', left: '20px' },
      { top: '20px', right: '20px' },
      { bottom: '20px', left: '20px' },
      { bottom: '20px', right: '20px' },
      { top: '50%', left: '20px', transform: 'translateY(-50%)' },
      { top: '50%', right: '20px', transform: 'translateY(-50%)' },
    ];
    
    const randomPosition = positions[Math.floor(Math.random() * positions.length)];
    setPosition(randomPosition);
    
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Wait for fade out animation
  };

  const sendFeedback = async (message) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          timestamp: new Date().toISOString(),
          page: window.location.pathname
        }),
      });
      
      if (response.ok) {
        alert('Thank you for your feedback!');
      }
    } catch (error) {
      console.error('Failed to send feedback:', error);
    }
    handleDismiss();
  };

  const handleSupport = () => {
    window.open('https://buymeacoffee.com/dandev2026', '_blank');
    handleDismiss();
  };

  const handleFeedback = () => {
    const feedback = prompt('Please share your feedback:');
    if (feedback) {
      sendFeedback(feedback);
    } else {
      handleDismiss();
    }
  };

  return (
    <div 
      className={`feedback-popup ${isVisible ? 'visible' : ''}`}
      style={position}
    >
      <div className="feedback-popup-content">
        <button 
          className="feedback-close-btn" 
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 352 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
          </svg>
        </button>
        
        <div className="feedback-header">
          <div className="feedback-icon">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="heart-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path>
            </svg>
            <div className="ping-dot"></div>
          </div>
          <div>
            <h3>Enjoying DevTools?</h3>
            <p>This service is free. If you're satisfied, donate and leave feedback! ☕</p>
          </div>
        </div>
        
        <div className="feedback-actions">
          <button className="support-btn" onClick={handleSupport}>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path>
            </svg>
            Support
          </button>
          
          <button className="feedback-btn" onClick={handleFeedback}>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M416 192c0-88.4-93.1-160-208-160S0 103.6 0 192c0 34.3 14.1 65.9 38 92-13.4 30.2-35.5 54.2-35.8 54.5-2.2 2.3-2.8 5.7-1.5 8.7S4.8 352 8 352c36.6 0 66.9-12.3 88.7-25 32.2 15.7 70.3 25 111.3 25 114.9 0 208-71.6 208-160zm122 220c23.9-26 38-57.7 38-92 0-66.9-53.5-124.2-129.3-148.1.9 6.6 1.3 13.3 1.3 20.1 0 105.9-107.7 192-240 192-10.8 0-21.3-.8-31.7-1.9C207.8 439.6 281.8 480 368 480c41 0 79.1-9.2 111.3-25 21.8 12.7 52.1 25 88.7 25 3.2 0 6.1-1.9 7.3-4.8 1.3-2.9.7-6.3-1.5-8.7-.3-.3-22.4-24.2-35.8-54.5z"></path>
            </svg>
            Feedback
          </button>
          
          <button className="later-btn" onClick={handleDismiss}>
            Later
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>
      </div>
    </div>
  );
};

export default FeedbackPopup;