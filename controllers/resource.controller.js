import * as Sentry from '@sentry/node';

export class ResourceController {
    /**
     * Simula un recurso privado del Microservicio Alpha.
     */
    static getAlphaPrivateData(req, res) {
        // Simulación de fallo operacional (500)
        throw new Error("Conexión perdida con la BDD");
        
        return res.json({
            message: 'Acceso exitoso al Microservicio Alpha',
            user: req.user
        });
    }

    /**
     * Simula un recurso privado del Microservicio Beta.
     */
    static getBetaPrivateData(req, res) {
        try {
            // Simulamos un error interno en la lógica de beta
            throw new Error("Fallo inesperado en servicio beta al procesar datos");
        } catch (error) {
            Sentry.captureException(error, {
                tags: {
                    servicio: 'beta',
                    userId: req.user ? req.user.id : 'desconocido'
                }
            });
            return res.status(500).json({ message: 'Error interno en Beta' });
        }
    }
}
