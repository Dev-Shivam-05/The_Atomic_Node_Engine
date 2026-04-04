import jwt from 'jsonwebtoken';
import envConfig from '../config/dotenv.js';

const authMiddleware = (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const token = bearer[1];
            const decoded = jwt.verify(token, envConfig.JWT_SECRET);
         
            if (decoded.id === req.params.id) {
                next();
            } else {
                return res.status(401).json({ message: 'You Are Not Authorized' });
            }
        }
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

export default authMiddleware;
