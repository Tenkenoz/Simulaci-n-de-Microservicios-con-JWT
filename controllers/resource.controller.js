export class ResourceController {
    /**
     * Simula un recurso privado del Microservicio Alpha.
     */
    static getAlphaPrivateData(req, res) {
        return res.json({
            message: 'Acceso exitoso al Microservicio Alpha',
            user: req.user
        });
    }

    /**
     * Simula un recurso privado del Microservicio Beta.
     */
    static getBetaPrivateData(req, res) {
        return res.json({
            message: 'Acceso exitoso al Microservicio Beta',
            user: req.user
        });
    }
}
