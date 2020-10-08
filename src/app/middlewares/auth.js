const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = async (req, res, next) => {
    console.log("HEADERS ==> ", req.headers);
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({message: 'token not available'})
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = await promisify(jwt.verify)(token, process.env.APP_SECRET);
        req.userID = decoded.id;
        return next();
    }catch(err) {
        return res.status(401).json({message: 'Invalid token'});
    }

}