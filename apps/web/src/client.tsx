import { scan } from 'react-scan';
import { hydrateRoot } from 'react-dom/client';
import { StartClient } from '@tanstack/react-start';
import { createRouter } from './router';

scan({
  enabled: true
});

const router = createRouter();

hydrateRoot(document!, <StartClient router={router} />);
