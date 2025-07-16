'use client';

import { useState, useEffect } from 'react';

interface FoldableState {
  isFoldable: boolean;
  screenSegments: number;
  foldPosition: 'vertical' | 'horizontal' | null;
  isSpanned: boolean;
}

export function useFoldable(): FoldableState {
  const [state, setState] = useState<FoldableState>({
    isFoldable: false,
    screenSegments: 1,
    foldPosition: null,
    isSpanned: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkFoldable = () => {
      // Check for horizontal viewport segments (vertical fold)
      const verticalSegments = window.matchMedia('(horizontal-viewport-segments: 2)').matches;
      
      // Check for vertical viewport segments (horizontal fold)
      const horizontalSegments = window.matchMedia('(vertical-viewport-segments: 2)').matches;
      
      // Check if device is spanned
      const isSpanned = window.matchMedia('(screen-spanning: single-fold-vertical)').matches ||
                       window.matchMedia('(screen-spanning: single-fold-horizontal)').matches;

      setState({
        isFoldable: verticalSegments || horizontalSegments,
        screenSegments: verticalSegments || horizontalSegments ? 2 : 1,
        foldPosition: verticalSegments ? 'vertical' : horizontalSegments ? 'horizontal' : null,
        isSpanned,
      });
    };

    // Initial check
    checkFoldable();

    // Listen for changes
    const mediaQueries = [
      window.matchMedia('(horizontal-viewport-segments: 2)'),
      window.matchMedia('(vertical-viewport-segments: 2)'),
      window.matchMedia('(screen-spanning: single-fold-vertical)'),
      window.matchMedia('(screen-spanning: single-fold-horizontal)'),
    ];

    const handler = () => checkFoldable();
    
    mediaQueries.forEach(mq => {
      mq.addEventListener('change', handler);
    });

    // Also listen to resize events
    window.addEventListener('resize', handler);

    return () => {
      mediaQueries.forEach(mq => {
        mq.removeEventListener('change', handler);
      });
      window.removeEventListener('resize', handler);
    };
  }, []);

  return state;
}

// CSS utilities for foldable layouts
export const foldableStyles = {
  // For vertical fold (book-like)
  verticalFold: `
    @media (horizontal-viewport-segments: 2) {
      .foldable-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: env(viewport-segment-width 0 0, 0);
      }
      
      .foldable-left {
        grid-column: 1;
      }
      
      .foldable-right {
        grid-column: 2;
      }
    }
  `,
  
  // For horizontal fold (laptop-like)
  horizontalFold: `
    @media (vertical-viewport-segments: 2) {
      .foldable-container {
        display: grid;
        grid-template-rows: 1fr 1fr;
        gap: env(viewport-segment-height 0 0, 0);
      }
      
      .foldable-top {
        grid-row: 1;
      }
      
      .foldable-bottom {
        grid-row: 2;
      }
    }
  `,
};