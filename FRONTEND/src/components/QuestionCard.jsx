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
  const animationFrameRef = useRef(null);

  const resetDragState = () => {
    setDragStart({ x: 0, y: 0 });
    setDragOffset({ x: 0, y: 0 });
    isDragging.current = false;
    onDragProgress(null, 0);
  };

  const handleStart = (clientX, clientY) => {
    if (isExiting) return;
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

    event?.preventDefault();

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const maxDrag = window.innerWidth * 0.8;
      const boundedDeltaX = Math.max(Math.min(deltaX, maxDrag), -maxDrag);

      setDragOffset({ x: boundedDeltaX, y: 0 });

      const progress = Math.abs(boundedDeltaX) / (window.innerWidth * 0.35);
      const direction = boundedDeltaX > 0 ? 'right' : 'left';
      onDragProgress(direction, Math.min(progress, 1));
    });
  };

  const handleEnd = () => {
    if (!isDragging.current || isExiting) return;

    if (!isScrolling.current) {
      const threshold = window.innerWidth * 0.35;

      if (Math.abs(dragOffset.x) > threshold) {
        setIsExiting(true);
        const direction = dragOffset.x > 0 ? 'right' : 'left';

        // Immediately notify parent to update card
        onSwipe(direction);

        const exitDistance = direction === 'right' ? window.innerWidth * 1.5 : -window.innerWidth * 1.5;

        requestAnimationFrame(() => {
          setDragOffset(prev => ({ ...prev, x: exitDistance }));

          // Reset state after animation
          setTimeout(() => {
            setIsExiting(false);
            resetDragState();
          }, 300);
        });
      } else {
        requestAnimationFrame(() => {
          setDragOffset({ x: 0, y: 0 });
          setTimeout(resetDragState, 300);
        });
      }
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
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
    e.preventDefault();
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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    if (isDragging.current) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    }

    return cleanup;
  }, [isDragging.current, dragOffset.x]);

  const rotation = (dragOffset.x / window.innerWidth) * 12;

  // Calculate next card scale and opacity
  const nextCardScale = 0.98 + Math.abs(dragOffset.x / window.innerWidth) * 0.02;
  const nextCardOpacity = 0.5 + Math.abs(dragOffset.x / window.innerWidth) * 0.5;

  return (
    <div className="relative w-full h-[80vh] mx-auto">
      {nextQuestion && (
        <div
          className="absolute inset-x-2 top-4 h-[75vh] bg-white rounded-2xl shadow-xl transform-gpu transition-transform duration-300"
          style={{
            zIndex: 1,
            transform: `scale(${Math.min(nextCardScale, 1)}) translateY(10px)`,
            opacity: Math.min(nextCardOpacity, 1),
            willChange: 'transform, opacity',
          }}
        >
          <div className="p-6 opacity-50">
            <h2 className="text-2xl font-bold text-gray-900">{nextQuestion.name}</h2>
          </div>
        </div>
      )}

      <div
        ref={cardRef}
        className={`absolute inset-x-2 top-4 h-[75vh] bg-white rounded-2xl shadow-2xl touch-pan-y transform-gpu ${
          isExiting ? 'transition-all duration-300 ease-out' : 
          isDragging.current ? '' : 'transition-all duration-300 ease-out'
        }`}
        style={{
          zIndex: 2,
          transform: `translate3d(${dragOffset.x}px, 0px, 0) rotate(${rotation}deg)`,
          opacity: isExiting ? 0 : 1,
          willChange: 'transform, opacity'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
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
