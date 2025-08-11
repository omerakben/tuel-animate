import { useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsapContext } from '@tuel/gsap';
import { cn, isClient } from '@tuel/utils';

if (isClient) {
  gsap.registerPlugin(ScrollTrigger);
}

export interface StickyCard {
  id: string;
  content: ReactNode;
  backgroundColor?: string;
  image?: string;
  title?: string;
  description?: string;
}

export interface StickyCardsProps {
  cards: StickyCard[];
  className?: string;
  cardClassName?: string;
  overlap?: number;
  scaleEffect?: boolean;
  rotateEffect?: boolean;
  fadeEffect?: boolean;
  spacing?: number;
}

export function StickyCards({
  cards,
  className,
  cardClassName,
  overlap = 40,
  scaleEffect = true,
  rotateEffect = false,
  fadeEffect = false,
  spacing = 100,
}: StickyCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useGsapContext(() => {
    if (!isClient) return;

    const cards = cardsRef.current;
    if (cards.length === 0) return;

    cards.forEach((card, index) => {
      const isLast = index === cards.length - 1;

      // Create scroll trigger for each card
      ScrollTrigger.create({
        trigger: card,
        start: `top top+=${index * overlap}`,
        endTrigger: containerRef.current,
        end: isLast ? 'bottom bottom' : `bottom top+=${(index + 1) * overlap}`,
        pin: true,
        pinSpacing: false,
        onUpdate: (self) => {
          const progress = self.progress;

          if (scaleEffect && !isLast) {
            const scale = 1 - progress * 0.05;
            gsap.set(card, { scale });
          }

          if (rotateEffect && !isLast) {
            const rotation = progress * 3;
            gsap.set(card, { rotation });
          }

          if (fadeEffect && !isLast) {
            const opacity = 1 - progress * 0.3;
            gsap.set(card, { opacity });
          }
        },
      });
    });
  }, [cards.length, overlap, scaleEffect, rotateEffect, fadeEffect]);

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={{ minHeight: `${cards.length * spacing}vh` }}
    >
      {cards.map((card, index) => (
        <div
          key={card.id}
          ref={(el) => {
            if (el) cardsRef.current[index] = el;
          }}
          className={cn(
            'sticky top-0 w-full h-screen flex items-center justify-center',
            'will-change-transform',
            cardClassName
          )}
          style={{
            backgroundColor: card.backgroundColor,
            zIndex: cards.length - index,
          }}
        >
          {card.image && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${card.image})` }}
            />
          )}
          <div className="relative z-10 p-8">
            {card.title && <h2 className="text-4xl font-bold mb-4">{card.title}</h2>}
            {card.description && <p className="text-lg">{card.description}</p>}
            {card.content}
          </div>
        </div>
      ))}
    </div>
  );
}
