import { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Slide from './Slide';

gsap.registerPlugin(ScrollTrigger);

const SLIDES = [
  { image: '/watch1.jpg', label: 'CLASSIC AUTOMATIC', index: 0 },
  { image: '/watch2.jpg', label: 'CHRONOGRAPH',       index: 1 },
  { image: '/watch3.jpg', label: 'DIVER',             index: 2 },
  { image: '/watch4.jpg', label: 'DRESS WATCH',       index: 3 },
];

const TRIGGER_HEIGHT = 900; // px of scroll per slide reveal

export default function DemoApp() {
  const [progresses, setProgresses] = useState(SLIDES.map(() => 0));
  const [mounted, setMounted] = useState(false);
  const [introOpacity, setIntroOpacity] = useState(1);

  const updateProgress = useCallback((index: number, value: number) => {
    setProgresses((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const fade = Math.max(0, 1 - y / 280);
      setIntroOpacity(fade);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const triggers = gsap.utils.toArray<HTMLElement>('.reveal-trigger');

    const tweens = SLIDES.map((_, index) => {
      const proxy = { progress: 0 };
      return gsap.to(proxy, {
        progress: 1,
        ease: 'sine.inOut',
        onUpdate: () => updateProgress(index, proxy.progress),
        scrollTrigger: {
          trigger: triggers[index],
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1,
        },
      });
    });

    return () => {
      tweens.forEach((t) => t.scrollTrigger?.kill());
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <main>
      {/* Fixed canvas — pointer-events: none lets scroll pass through */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
        <Canvas
          gl={{ stencil: true, antialias: true }}
          linear
          orthographic
          camera={{ zoom: 80 }}
        >
          {SLIDES.map((slide, i) => (
            <Slide
              key={slide.label}
              slide={slide}
              maskId={SLIDES.length - i}
              revealProgress={progresses[i]}
              zPos={i / 10}
            />
          ))}
        </Canvas>
      </div>

      {/* Intro text — visible on the initial black view, fades as you scroll */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 15,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: introOpacity,
          transition: 'opacity 0.2s ease',
        }}
      >
        <p
          style={{
            fontFamily: '"Arial Narrow", Arial, sans-serif',
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            fontWeight: 300,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.92)',
            margin: 0,
          }}
        >
          Time, refined
        </p>
        <p
          style={{
            fontFamily: '"Arial Narrow", Arial, sans-serif',
            fontSize: 'clamp(0.7rem, 2vw, 0.85rem)',
            fontWeight: 400,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
            marginTop: '1rem',
          }}
        >
          Scroll to explore the collection
        </p>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: 'fixed',
        bottom: '2.5rem',
        right: '2.5rem',
        zIndex: 20,
        color: 'rgba(255,255,255,0.3)',
        fontFamily: '"Arial Narrow", Arial, sans-serif',
        fontSize: '11px',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        writingMode: 'vertical-rl',
        pointerEvents: 'none',
      }}>
        scroll to reveal
      </div>

      {/* Scrollable content — invisible spacers that drive the ScrollTrigger */}
      <div style={{ position: 'relative', zIndex: 0 }}>
        <div style={{ height: '100vh' }} />
        {SLIDES.map((_, i) => (
          <Fragment key={i}>
            <div className="reveal-trigger" style={{ height: `${TRIGGER_HEIGHT}px` }} />
            <div style={{ height: '40vh' }} />
          </Fragment>
        ))}
        <div style={{ height: '100vh' }} />
      </div>
    </main>
  );
}
