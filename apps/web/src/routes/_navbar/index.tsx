import { createFileRoute } from '@tanstack/react-router';
import { Badge } from 'src/components/ui/badge';

export const Route = createFileRoute('/_navbar/')({
  component: Home
});

function Home() {
  return (
    <div className="container mx-auto">
      <section className="relative overflow-hidden px-8 py-32">
        <div className="container">
          <div className="magicpattern absolute inset-x-0 top-0 -z-10 flex h-full w-full items-center justify-center opacity-100" />
          <div className="mx-auto flex max-w-5xl flex-col items-center">
            <div className="z-10 flex flex-col items-center gap-6 text-center">
              <img src="donut.svg" alt="logo" className="h-16" />
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
