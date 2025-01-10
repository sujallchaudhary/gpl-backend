import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const {ACCESS_SECRET} = process.env

const verifyJWT = (req,res,next) => {
    const authHeader = req.headers["authorization"]

    if(!authHeader) {
        return res.status(400).json({error: "BAD_REQUEST", description: "Authorization header missing."})
    }
    const JWT = authHeader.split(" ")[1]
    if (!JWT) {
        return res.status(400).json({error: "BAD_REQUEST", description: "JWT missing."})
    }

    try {
        jwt.verify(JWT, ACCESS_SECRET)
        return res.status(200).json({message: "Login Successful."})
    } catch (err) {
        // If error, redirect user to /login to sign in again and generate new JWT
        console.error(err)
        return res.status(401).json({ error: "UNAUTHORIZED", description: "JWT malformed." })
    }
}

export default verifyJWT