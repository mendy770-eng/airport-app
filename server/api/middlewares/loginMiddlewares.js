const jwt = require('jsonwebtoken');
const User = require('../User/UserModel');

async function verifyToken(permission, req, res, next) {
    try {
        const [type, token] = req.headers.authorization?.split(' ');
        if (type != 'Bearer' || !token) {
            throw new Error('Unauthorized');
        }
        const data = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(data.userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (permission && permission!='admin' && user.permission!=permission){
            throw new Error();
        }
        req.user = user;
        next();
    } catch (e) {
        res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: 'Invalid token'
        });
    }
}

const verifyTechnicion = (req, res, next) => {
    verifyToken('technicion', req, res, next);
};

const verifyAdmin = (req, res, next) => {
    verifyToken('admin', req, res, next);
};  

const verifySupervisor = (req, res, next) => {
    verifyToken('supervisor', req, res, next);
};

const verifyGroundAttendant = (req, res, next) => {
    verifyToken('ground_attendant', req, res, next);
};

const verifyUser = (req, res, next) => {
    verifyToken(null, req, res, next);
};

module.exports = {
    verifyTechnicion,
    verifyAdmin,
    verifySupervisor,
    verifyGroundAttendant,
    verifyUser
}