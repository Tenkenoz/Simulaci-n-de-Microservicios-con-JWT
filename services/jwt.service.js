import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export class JwtService {
    /**
     * Firma un token JWT basándose en el algoritmo configurado.
     * @param {Object} user - Los datos del usuario a incluir en el token.
     * @returns {string} El token JWT generado.
     */
    static signToken(user) {
        const payload = {
            sub: user.id,
            name: user.name,
            exp: Math.floor(Date.now() / 1000) + 60
        };

        if (config.ALGORITHM === 'RS256' && config.PRIVATE_KEY) {
            return jwt.sign(payload, config.PRIVATE_KEY, { algorithm: 'RS256' });
        } else {
            return jwt.sign(payload, config.JWT_SECRET, { algorithm: 'HS256' });
        }
    }

    /**
     * Verifica un token JWT basándose en el algoritmo configurado.
     * @param {string} token - El token JWT a verificar.
     * @returns {Object} El payload decodificado. Lanza un error si es inválido.
     */
    static verifyToken(token) {
        if (config.ALGORITHM === 'RS256' && config.PUBLIC_KEY) {
            return jwt.verify(token, config.PUBLIC_KEY, { algorithms: ['RS256'] });
        } else {
            return jwt.verify(token, config.JWT_SECRET, { algorithms: ['HS256'] });
        }
    }
}
