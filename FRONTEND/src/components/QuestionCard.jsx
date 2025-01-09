import React, { useState, useRef, useEffect } from 'react';
import { Code } from 'lucide-react';

export function QuestionCard({ question, nextQuestion, onSwipe, onDragProgress }) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isExiting, setIsExiting] = useState(false);
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const isScrolling = useRef(false);
  const startScrollTop = useRef(0);

  const resetDragState = () => {
    setDragOffset({ x: 0, y: 0 });
    onDragProgress(null, 0);
    isDragging.current = false;
    isScrolling.current = false;
  };

  const handleStart = (clientX, clientY) => {
    if (isExiting) return;
    dragStart.current = { x: clientX, y: clientY };
    startScrollTop.current = contentRef.current?.scrollTop || 0;
    isDragging.current = true;
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging.current || isExiting) return;

    const deltaX = clientX - dragStart.current.x;
    const deltaY = clientY - dragStart.current.y;

    // Determine if the user is scrolling or swiping
    if (!isScrolling.current && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
      isScrolling.current = Math.abs(deltaY) > Math.abs(deltaX);
    }

    if (isScrolling.current) {
      contentRef.current.scrollTop = startScrollTop.current - deltaY;
      return;
    }

    // Prevent browser default behaviors during dragging
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault();
    }

    // Calculate the drag offset and rotation
    const maxDrag = window.innerWidth * 0.8;
    const boundedDeltaX = Math.max(Math.min(deltaX, maxDrag), -maxDrag);

    setDragOffset({ x: boundedDeltaX, y: 0 });

    const progress = Math.abs(boundedDeltaX) / (window.innerWidth * 0.35);
    const direction = boundedDeltaX > 0 ? 'right' : 'left';
    onDragProgress(direction, Math.min(progress, 1));
  };

  const handleEnd = () => {
    if (!isDragging.current || isExiting) return;

    const threshold = window.innerWidth * 0.35;

    if (Math.abs(dragOffset.x) > threshold) {
      setIsExiting(true);
      const direction = dragOffset.x > 0 ? 'right' : 'left';
      onSwipe(direction);

      const exitDistance = direction === 'right' ? window.innerWidth * 1.5 : -window.innerWidth * 1.5;
      setDragOffset({ x: exitDistance, y: 0 });

      setTimeout(() => {
        setIsExiting(false);
        resetDragState();
      }, 300);
    } else {
      setDragOffset({ x: 0, y: 0 });
      setTimeout(resetDragState, 300);
    }
  };

  const rotation = (dragOffset.x / window.innerWidth) * 12;

  // Calculate next card scale and opacity
  const nextCardScale = 0.98 + Math.abs(dragOffset.x / window.innerWidth) * 0.02;
  const nextCardOpacity = 0.5 + Math.abs(dragOffset.x / window.innerWidth) * 0.5;

  return (
    <div className="relative w-full h-[80vh] mx-auto">
      {nextQuestion && (
        <div
          className="select-none absolute inset-x-2 top-4 h-[75vh] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl transition-transform duration-300 border border-gray-700/50"
          style={{
            zIndex: 1,
            transform: `scale(${Math.min(nextCardScale, 1)}) translateY(10px)`,
            opacity: Math.min(nextCardOpacity, 1),
          }}
        >
          <div className="p-6 opacity-50">
            <h2 className="text-2xl font-bold text-gray-200">{nextQuestion.name}</h2>
          </div>
        </div>
      )}

      <div
        ref={cardRef}
        className={`select-none absolute inset-x-2 top-4 h-[75vh] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl touch-pan-y transform-gpu border border-gray-700/50 ${
          isExiting ? 'transition-all duration-300 ease-out' : 'transition-transform duration-300 ease-out'
        }`}
        style={{
          zIndex: 2,
          transform: `translate3d(${dragOffset.x}px, 0px, 0) rotate(${rotation}deg)`,
          opacity: isExiting ? 0 : 1,
        }}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        onMouseMove={(e) => isDragging.current && handleMove(e.clientX, e.clientY)}
        onTouchMove={(e) => {
          e.preventDefault();
          handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onMouseUp={handleEnd}
        onTouchEnd={handleEnd}
      >
        <div ref={contentRef} className="h-full overflow-y-auto scrollable-content overscroll-contain">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Code className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-200">{question.name}</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 border border-blue-500/20 shadow-lg shadow-blue-500/5">
                <h3 className="font-semibold text-blue-400 mb-2">Problem</h3>
                <p className="whitespace-pre-wrap text-gray-300">{question.question}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 border border-blue-500/20 shadow-lg shadow-blue-500/5">
                <h3 className="font-semibold text-blue-400 mb-2">Description</h3>
                <p className="text-gray-300">{question.description}</p>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}