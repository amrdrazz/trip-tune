const JWT = require('jsonwebtoken');

export const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
        message: "Unauthorized",
        });
    }

    try{
        const decoded = JWT.verify(
            token,
            process.env.JWT_SECRET
        )
    }catch(error){
        return res.status(401).json({
            message: "Invalid token",
        }); 
    }
}