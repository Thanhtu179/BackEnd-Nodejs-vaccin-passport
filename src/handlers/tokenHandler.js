const jwt = require('jsonwebtoken');
const { Admin, User } = require('../models');

const tokeDecode = (req) => {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        const bearer = bearerHeader.split(" ")[1];
        try {
            const tokenDecoded = jwt.verify(
                bearer,
                process.env.TOKEN_SECRET_KEY
            );
            return tokenDecoded;
        } catch (err) {
            return false;
        }
    } else {
        return false;
    }
}

exports.verifyAdminToken = async (req, res, next) => {
    const tokenDecoded = tokeDecode(req);
    if (tokenDecoded) {
        const admin = await Admin.findById(tokenDecoded.id);
        if (!admin) return res.status(403).json("Now Allowed!");
        req.admin = admin;
        next();
    } else {
        res.status(401).json("Uanuthorized");
    }
}

exports.verifyToken = async (req, res, next) => {
    const tokenDecoded = tokeDecode(req);
    if (tokenDecoded) {
        const admin = await Admin.findById(tokenDecoded.id);
        const user = await User.findById(tokenDecoded.id);
        if (!admin && !user) return res.status(403).json("Now Allowed!");
        req.admin = admin;
        req.user = user;
        next();
    } else {
        res.status(401).json("Uanuthorized");
    }
}