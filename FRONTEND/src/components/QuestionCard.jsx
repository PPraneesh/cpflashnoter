import  { useState, useRef, useEffect } from 'react';
import { Code } from 'lucide-react';

export function QuestionCard({ question, nextQuestion, onSwipe, onDragProgress }) {
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isExiting, setIsExiting] = useState(false);
  const cardRef = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const isDragging = useRef(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window);
  }, []);

  const resetDragState = () => {
    setDragStart({ x: 0, y: 0 });
    setDragOffset({ x: 0, y: 0 });
    isDragging.current = false;
    onDragProgress(null, 0);
  };

  const handleStart = (clientX, clientY) => {
    isDragging.current = true;
    setDragStart({ x: clientX, y: clientY });
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging.current) return;
    
    const offset = {
      x: clientX - dragStart.x,
      y: Math.min(Math.max(clientY - dragStart.y, -50), 50)
    };
    
    setDragOffset(offset);

    // Calculate and report drag progress
    const progress = Math.abs(offset.x) / (window.innerWidth * 0.4);
    const direction = offset.x > 0 ? 'right' : 'left';
    onDragProgress(direction, Math.min(progress, 1));
  };

  const handleEnd = () => {
    if (!isDragging.current) return;
    
    const threshold = window.innerWidth * 0.4;
    
    if (Math.abs(dragOffset.x) > threshold) {
      setIsExiting(true);
      const direction = dragOffset.x > 0 ? 'right' : 'left';
      const exitX = direction === 'right' ? window.innerWidth : -window.innerWidth;
      
      setDragOffset(prev => ({ ...prev, x: exitX }));
      onSwipe(direction);
      
      setTimeout(() => {
        setIsExiting(false);
        resetDragState();
      }, 300);
    } else {
      resetDragState();
    }
  };

  // Touch event handlers
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Mouse event handlers
  const handleMouseDown = (e) => {
    if (isTouchDevice) return;
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      handleEnd();
    }
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    if (isTouchDevice) {
      card.addEventListener('touchstart', handleTouchStart, { passive: false });
      card.addEventListener('touchmove', handleTouchMove, { passive: false });
      card.addEventListener('touchend', handleTouchEnd);

      return () => {
        card.removeEventListener('touchstart', handleTouchStart);
        card.removeEventListener('touchmove', handleTouchMove);
        card.removeEventListener('touchend', handleTouchEnd);
      };
    } else {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragStart, isTouchDevice]);

  // Clean up drag state when component unmounts
  useEffect(() => {
    return () => {
      resetDragState();
    };
  }, []);

  const rotation = (dragOffset.x / window.innerWidth) * 20;

  return (
    <div className="relative w-full h-[60vh] mx-auto">
      {/* Stacked card effect */}
      {nextQuestion && (
        <div 
          className="absolute top-4 left-4 right-4 h-[50vh] bg-white rounded-2xl shadow-xl transform-gpu"
          style={{
            zIndex: 1,
            transform: `scale(${0.98}) translateY(10px)`,
          }}
        >
          <div className="p-6 opacity-50">
            <h2 className="text-2xl font-bold text-gray-900">{nextQuestion.name}</h2>
          </div>
        </div>
      )}

      {/* Current card */}
      <div
        ref={cardRef}
        className="absolute top-4 left-4 right-4 h-[50vh] bg-white rounded-2xl shadow-2xl overflow-y-auto"
        style={{
          zIndex: 2,
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
          opacity: isExiting ? 0 : 1,
          transition: isDragging.current ? 'none' : 'all 0.3s ease',
          cursor: isTouchDevice ? 'default' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
      >
        {/* Card content */}
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
    </div>
  );
}