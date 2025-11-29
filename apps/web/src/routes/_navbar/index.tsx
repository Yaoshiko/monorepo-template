import { createFileRoute } from '@tanstack/react-router';
import { Badge } from 'src/components/ui/badge';
import { useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

export const Route = createFileRoute('/_navbar/')({
  component: Home
});

function Home() {
  const controls = useAnimationControls();
  const biteControls = useAnimationControls();

  useEffect(() => {
    const sequence = async () => {
      // Initial State: donut off-screen, bites are invisible
      controls.set({ opacity: 1, x: -800, rotate: 0 });
      biteControls.set({ opacity: 0, x: -100, y: -100 });

      // Rolling animation
      await controls.start({
        x: 0,
        rotate: 360,
        transition: {
          x: { type: 'spring', stiffness: 100, damping: 10, duration: 0.7 },
          rotate: { duration: 0.7, ease: 'easeInOut' }
        }
      });

      // Bite the donut
      controls.start({ scale: 1.05, transition: { duration: 0.1 } });
      await biteControls.start({
        opacity: 1
      });
    };

    sequence();
  }, [controls, biteControls]);

  return (
    <div className="container mx-auto">
      <section className="relative overflow-hidden px-8 py-32">
        <div className="container">
          <div className="magicpattern absolute inset-x-0 top-0 -z-10 flex h-full w-full items-center justify-center opacity-100" />
          <div className="mx-auto flex max-w-5xl flex-col items-center">
            <div className="z-10 flex flex-col items-center gap-6 text-center">
              <motion.div
                className="relative flex h-64 w-64 items-center justify-center"
                initial={{ x: -800 }}
                animate={controls}
              >
                <img src="/donut.svg" alt="Donut" className="h-full w-full" />
                <motion.div className="absolute" animate={biteControls}>
                  {[
                    [0, 0],
                    [20, -30],
                    [10, -5],
                    [-5, 10],
                    [-30, 20]
                  ].map(([x, y], index) => (
                    <motion.div
                      key={index}
                      className="absolute rounded-full"
                      style={{
                        height: '2.5rem',
                        width: '2.5rem',
                        x: x,
                        y: y,
                        backgroundColor: 'white'
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>

              <Badge variant="outline">Hey, you</Badge>
              <div>
                <h1 className="mb-6 text-2xl font-bold text-pretty lg:text-5xl">
                  Free donuts!
                </h1>
                <p className="text-muted-foreground lg:text-xl">
                  I&apos;m sorry, you got{' '}
                  <a href="https://youtu.be/dQw4w9WgXcQ?si=QI5RgbjfHrI0dgDo">
                    Rick-Rolled
                  </a>
                  ...
                  <br />
                  But you can enjoy a useless recipe webapp!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
