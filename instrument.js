import * as Sentry from "@sentry/node";
import { config } from "dotenv";
import fs from 'fs';

config();

const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url)));

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    release: process.env.SENTRY_RELEASE || `${pkg.name}@${pkg.version}`,
    tracesSampleRate: 0, // Solo localizar errores, no rendimiento
    sampleRate: 1.0, // 100% de los errores
    sendDefaultPii: true, // Enviar información personal (ej. req.user)
    enabled: Boolean(process.env.SENTRY_DSN),
    beforeSend(event) {
        if (event.request?.cookies) delete event.request.cookies;
        if (event.request?.headers?.cookie) delete event.request.headers.cookie;
        return event;
    }
});
