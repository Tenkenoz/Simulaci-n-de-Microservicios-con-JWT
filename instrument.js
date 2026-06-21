import 'dotenv/config';
import Sentry from '@sentry/node';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url)));

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  release: process.env.SENTRY_RELEASE || `jwt${pkg.name}@${pkg.version}`,
  tracesSampleRate: 0, // Solo localización de errores
  sampleRate: 1.0, // 100% de alcance
  sendDefaultPii: true, // Enviar datos personales (ej. email/usuario)
  enabled: Boolean(process.env.SENTRY_DSN),
  beforeSend(event) {
    if (event.request?.cookies) delete event.request.cookies;
    if (event.request?.headers?.cookie) delete event.request.headers.cookie;
    return event;
  }
});

