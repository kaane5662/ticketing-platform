const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const generateToken = (user) => {
    
    console.log(user)
    return jwt.sign(
        {
            _id: user._id.toString(),
            ...user._doc
        }
        , process.env.SECRET_JWT, {expiresIn: "1h"}); // Token expires in 1 hour
};


const verifyToken = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};



module.exports = {generateToken, verifyToken}