import { JwtService } from '../services/jwt.service.js';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso denegado: Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = JwtService.verifyToken(token);
        req.user = payload;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Acceso denegado: Token expirado' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Acceso denegado: Firma inválida' });
        }
        return res.status(500).json({ message: 'Error interno de validación' });
    }
};
