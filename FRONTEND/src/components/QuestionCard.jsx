import React, { useState, useRef, useEffect } from 'react';
import { Code } from 'lucide-react';

export function QuestionCard({ question, onSwipe }) {
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isExiting, setIsExiting] = useState(false);
  const cardRef = useRef(null);

  const handleDragStart = (e) => {
    e.preventDefault();
    const point = e.touches ? e.touches[0] : e;
    setDragStart({ x: point.clientX, y: point.clientY });
  };

  const handleDragMove = (e) => {
    e.preventDefault();
    if (!dragStart.x && !dragStart.y) return;
    
    const point = e.touches ? e.touches[0] : e;
    const offset = {
      x: point.clientX - dragStart.x,
      y: point.clientY - dragStart.y
    };
    
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    const threshold = window.innerWidth * 0.6; // Changed to 60%
    
    if (Math.abs(dragOffset.x) > threshold) {
      setIsExiting(true);
      const direction = dragOffset.x > 0 ? 'right' : 'left';
      
      // Animate the card off screen before calling onSwipe
      const exitX = direction === 'right' ? window.innerWidth : -window.innerWidth;
      setDragOffset(prev => ({ ...prev, x: exitX }));
      
      // Wait for animation to complete before triggering onSwipe
      setTimeout(() => {
        onSwipe(direction);
        setIsExiting(false);
        setDragOffset({ x: 0, y: 0 });
      }, 300);
    } else {
      // Spring back animation
      setDragOffset({ x: 0, y: 0 });
    }
    setDragStart({ x: 0, y: 0 });
  };

  useEffect(() => {
    const card = cardRef.current;
    if (card) {
      card.addEventListener('touchstart', handleDragStart, { passive: false });
      card.addEventListener('touchmove', handleDragMove, { passive: false });
      card.addEventListener('touchend', handleDragEnd, { passive: false });

      return () => {
        card.removeEventListener('touchstart', handleDragStart);
        card.removeEventListener('touchmove', handleDragMove);
        card.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [cardRef.current]);

  const rotation = (dragOffset.x / window.innerWidth) * 45;
  const opacity = Math.max(1 - Math.abs(dragOffset.x) / window.innerWidth, 0);

  return (
    <div
      ref={cardRef}
      className="h-[50vh] bg-white rounded-2xl shadow-2xl overflow-y-auto m-8"
      style={{
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
        opacity: isExiting ? 0 : opacity,
        transition: dragStart.x ? 'none' : 'all 0.3s ease',
      }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">{question.name}</h2>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Problem</h3>
            <p className="whitespace-pre-wrap text-gray-600">{question.question}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600">{question.description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Solution Components</h3>
            <div className="space-y-4">
              {question.subunits.map((subunit, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">{subunit.name}</h4>
                  <p className="text-gray-600 mb-3">{subunit.description}</p>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <code>{subunit.content}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {question.categories.map((category, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}