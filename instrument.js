import { createRequire } from 'module';
const require = createRequire(import.meta.url);

require('dotenv').config();
const Sentry = require('@sentry/node');
const pkg = require('./package.json');


Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development', // le decimos que estmaos trabajando en desarrollo ojo en modo desarrollo
  // si uqieren a produccion con sentry deben cambiar el env a produccion
  release: process.env.SENTRY_RELEASE || `spacechat${pkg.name}@${pkg.version}`, // le decimos que estamos trabajando con la version de nuestro proyecto nobre y version y las variables de entorno, va a ir docuemntando en funcion a la docuemntaicon del proyecto
  tracesSampleRate: 0, // el alcacne de sentry va a ser para localizar logs no va a ser de monitoreo de rendimiento, si quisieramos monitorear el rendimiento de la aplicacion le pondriamos un valor entre 0 y 1, pero como solo queremos localizar errores le ponemos 0
  sampleRate: 1.0, // el alcance de los errores va a ser del 100% de los errores del sistema, si quisieramos reducir el alcance de los errores le pondriamos un valor entre 0 y 1
  sendDefaultPii: true, // le decimos a sentry que envie informacion personal identificable, como el correo electronico del usuario, el nombre de usuario, etc, esto es util para localizar errores relacionados con usuarios especificos
  enabled: Boolean(process.env.SENTRY_DSN), // le decimos que no inicialice si no esta en local
  beforeSend(event) {
    if (event.request?.cookies) delete event.request.cookies; // eliminamos las cookies del evento para evitar enviar informacion sensible a sentry
    if (event.request?.headers?.cookie) delete event.request.headers.cookie;// el header de cookie puede contener informacion sensible, como el token de autenticacion, por lo que lo eliminamos del evento antes de enviarlo a sentry
    return event;
  }, // esto ocurre cuando ocurran errores en la aplicacion, antes de enviar el error a sentry, se ejecuta esta funcion, y si el error es un error de validacion, no se envia a sentry, esto es util para evitar enviar errores que no son relevantes para el monitoreo de la aplicacion
});

