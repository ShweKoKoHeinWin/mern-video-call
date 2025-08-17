import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'

export const protectRoute = async (request, response, next) => {
    try {
        const token = request.cookies.jwt;

        if(!token) return response.status(401).json({message: "Unauthorized - NO token provided"})

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if(!decode) return response.status(401).json({message: "Unauthorized - Invalid token"})

        const user = await User.findById(decode.userId).select('-password');

        if(!user) return response.status(401).json({message: "Unauthorized - User not found."});

        request.user = user;
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware.", error);
        response.status(401).json({message: "Internal Server Error."})
    }
}