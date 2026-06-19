# Autenticación Stateless y Simulación de Microservicios con JWT

## Investigación Teórica - Integración de Refresh Tokens

**1. Dado que los JWT son Stateless y en nuestra práctica expiran en 1 minuto, ¿de qué manera la implementación teórica de un Refresh Token solucionaría la experiencia del usuario sin comprometer la seguridad de los servicios distribuidos?**

La implementación de un **Refresh Token** soluciona la experiencia del usuario al permitir renovar automáticamente el Access Token (JWT) de corta duración (ej. 1 minuto) en segundo plano, evitando que el usuario deba introducir sus credenciales continuamente. Al separar el ciclo de vida de los tokens en dos, no se compromete la seguridad del ecosistema distribuido porque:
- El **Access Token** de vida corta se envía frecuentemente a los microservicios. Su corta vida minimiza la ventana de ataque si este token es interceptado.
- El **Refresh Token** (que tiene una duración mayor, como días o semanas) se envía de forma restringida únicamente al servidor centralizado de identidad, limitando enormemente su exposición. En caso de revocar la sesión o detectar una anomalía, el servidor de identidad invalida el Refresh Token, deteniendo la emisión de nuevos Access Tokens en el ecosistema.

**2. ¿En qué lugar del ecosistema (Cliente o Servidor) se debería almacenar y gestionar el ciclo de vida del Refresh Token según las buenas prácticas analizadas sobre la persistencia de cookies seguras?**

El Refresh Token debe ser enviado al **Cliente**, pero almacenado de manera estricta y delegada en el navegador mediante **Cookies HTTPOnly, Secure y SameSite=Strict**.
- **HTTPOnly**: Bloquea el acceso al contenido de la cookie desde lenguajes de scripting del lado del cliente (como JavaScript), mitigando drásticamente el riesgo ante ataques de tipo XSS.
- **Secure**: Asegura que el token viaje obligatoriamente sobre una capa segura HTTPS.
- **SameSite**: Mitiga vectores de ataque CSRF asegurándose que el navegador no envíe la cookie de forma cruzada desde orígenes no confiables.

Para el control del **ciclo de vida**, esto se gestiona desde el **Servidor (Servidor de Identidad)**, que guarda un registro estructurado (mediante una lista blanca o almacenamiento rápido persistente como Redis) de la validez de cada Refresh Token. Esto permite tener la capacidad fundamental de revocar sesiones (logout) o forzar una rotación de los tokens.
