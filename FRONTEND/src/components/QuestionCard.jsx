import React, { useState, useRef, useEffect } from 'react';
import { Code } from 'lucide-react';

export function QuestionCard({ question, nextQuestion, onSwipe, onDragProgress }) {
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isExiting, setIsExiting] = useState(false);
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const isDragging = useRef(false);
  const startScrollTop = useRef(0);
  const isScrolling = useRef(false);

  const resetDragState = () => {
    setDragStart({ x: 0, y: 0 });
    setDragOffset({ x: 0, y: 0 });
    isDragging.current = false;
    onDragProgress(null, 0);
  };

  const handleStart = (clientX, clientY) => {
    if (isExiting) return; // Prevent new drag while card is exiting
    startScrollTop.current = contentRef.current?.scrollTop || 0;
    isDragging.current = true;
    setDragStart({ x: clientX, y: clientY });
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging.current || isExiting) return;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    
    if (!isScrolling.current && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
      isScrolling.current = Math.abs(deltaY) > Math.abs(deltaX);
    }

    if (isScrolling.current) {
      if (contentRef.current) {
        contentRef.current.scrollTop = startScrollTop.current - deltaY;
      }
      return;
    }

    // Prevent default to avoid scroll interference
    event?.preventDefault();

    const maxDrag = window.innerWidth * 0.8;
    const boundedDeltaX = Math.max(Math.min(deltaX, maxDrag), -maxDrag);
    
    setDragOffset({ x: boundedDeltaX, y: 0 });

    const progress = Math.abs(boundedDeltaX) / (window.innerWidth * 0.35); // Threshold at 35% of screen width
    const direction = boundedDeltaX > 0 ? 'right' : 'left';
    onDragProgress(direction, Math.min(progress, 1));
  };

  const handleEnd = () => {
    if (!isDragging.current || isExiting) return;
    
    if (!isScrolling.current) {
      // Lower threshold - card will swipe away at 35% of screen width
      const threshold = window.innerWidth * 0.35;
      
      if (Math.abs(dragOffset.x) > threshold) {
        setIsExiting(true);
        const direction = dragOffset.x > 0 ? 'right' : 'left';
        const exitDistance = direction === 'right' ? window.innerWidth * 1.5 : -window.innerWidth * 1.5;
        
        // Animate the card off screen
        setDragOffset(prev => ({ ...prev, x: exitDistance }));
        
        // Notify parent of swipe with slight delay to allow animation to start
        setTimeout(() => {
          onSwipe(direction);
        }, 50);
        
        // Reset state after animation completes
        setTimeout(() => {
          setIsExiting(false);
          resetDragState();
        }, 300);
      } else {
        // Spring back animation
        setDragOffset({ x: 0, y: 0 });
        setTimeout(resetDragState, 300);
      }
    }

    isDragging.current = false;
    isScrolling.current = false;
    startScrollTop.current = 0;
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // Prevent scroll while swiping
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.scrollable-content')) return;
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX, e.clientY);
  };

  useEffect(() => {
    const cleanup = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };

    if (isDragging.current) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    }

    return cleanup;
  }, [isDragging.current, dragOffset.x]); // Added dragOffset.x as dependency

  const rotation = (dragOffset.x / window.innerWidth) * 12; // Slightly reduced rotation

  return (
    <div className="relative w-full h-[80vh] mx-auto">
      {/* Stacked card effect */}
      {nextQuestion && !isExiting && (
        <div 
          className="absolute inset-x-2 top-4 h-[75vh] bg-white rounded-2xl shadow-xl transform-gpu transition-transform duration-300"
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
        className={`absolute inset-x-2 top-4 h-[75vh] bg-white rounded-2xl shadow-2xl touch-pan-y transform-gpu ${
          isExiting ? 'transition-transform duration-300 ease-out' : 
          isDragging.current ? '' : 'transition-transform duration-300 ease-out'
        }`}
        style={{
          zIndex: 2,
          transform: `translate(${dragOffset.x}px, 0px) rotate(${rotation}deg)`,
          opacity: isExiting ? 0 : 1,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Card content remains the same */}
        <div 
          ref={contentRef}
          className="h-full overflow-y-auto scrollable-content overscroll-contain"
        >
          <div className="p-6">
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
    </div>
  );
}