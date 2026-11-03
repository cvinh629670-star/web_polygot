import React, { useEffect, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { animate, MotionConfig, useReducedMotion } from 'motion/react';
import { Dashboard, Navigation } from './App';
import { TooltipProvider } from '@/components/ui/tooltip';
import './styles.css';

function ViewTransitions() {
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion) return;
    const views = [...document.querySelectorAll('.tab-view')];
    const animations = new Map();
    const observer = new MutationObserver(records => {
      records.forEach(({ target }) => {
        animations.get(target)?.stop();
        if (target.classList.contains('hidden')) return;
        animations.set(target, animate(target, { opacity: [0, 1], y: [8, 0] }, {
          duration: 0.25, ease: [0.22, 1, 0.36, 1],
        }));
      });
    });
    views.forEach(view => observer.observe(view, { attributes: true, attributeFilter: ['class'] }));
    return () => {
      observer.disconnect();
      animations.forEach((animation, view) => {
        animation.stop();
        view.style.removeProperty('opacity');
        view.style.removeProperty('transform');
      });
    };
  }, [reducedMotion]);
  return null;
}

function App() {
  const bridge = window.polyglotUI;
  const snapshot = useSyncExternalStore(bridge.subscribe, bridge.getSnapshot);
  useEffect(() => {
    document.body.classList.add('pg-ui-ready');
    return () => document.body.classList.remove('pg-ui-ready');
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={300}>
        {createPortal(<Navigation snapshot={snapshot} actions={bridge.actions} />, document.getElementById('react-navigation-root'))}
        <Dashboard snapshot={snapshot} actions={bridge.actions} />
        <ViewTransitions />
      </TooltipProvider>
    </MotionConfig>
  );
}

// Remove the static fallback before React takes ownership of the navigation.
document.getElementById('react-navigation-root').replaceChildren();
createRoot(document.getElementById('react-dashboard-root')).render(<App />);
