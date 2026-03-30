import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config';
import { X, Heart, MessageSquare } from 'lucide-react';

interface FeedbackPopupProps {
  onDismiss: () => void;
}

const FeedbackPopup: React.FC<FeedbackPopupProps> = ({ onDismiss }) => {
  const [position, setPosition] = useState<React.CSSProperties>({ top: '20px', left: '20px' });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Random position on screen
    const positions: React.CSSProperties[] = [
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

  const sendFeedback = async (message: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/feedback`, {
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
      className={`fixed z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={position}
    >
      <div className="bg-card border border-border rounded-lg shadow-lg p-6 max-w-sm relative overflow-hidden">
        <button 
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors" 
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Enjoying DevTools?</h3>
            <p className="text-sm text-muted-foreground">This service is free. If you're satisfied, donate and leave feedback! ☕</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors font-medium text-sm"
            onClick={handleSupport}
          >
            <Heart className="h-4 w-4" />
            Support
          </button>
          
          <button 
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors font-medium text-sm"
            onClick={handleFeedback}
          >
            <MessageSquare className="h-4 w-4" />
            Feedback
          </button>
          
          <button 
            className="px-4 py-2 border border-border hover:bg-accent rounded-md transition-colors text-sm"
            onClick={handleDismiss}
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPopup;
