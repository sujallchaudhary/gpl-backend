import admin from 'firebase-admin';
import serviceAccount from '../configuration/serviceAccountKey.json' with { type: 'json' };
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const { ACCESS_SECRET, ACCESS_EXPIRESIN } = process.env

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

// Post Google sing in.
export const validateToken = async (req, res) => {
    const { idToken } = req.body

    if (!idToken) {
        return res.status(400).json({ error: "BAD_REQUEST", description: "'idToken' missing." })
    }

    try {
        // Validating idToken
        const decodedToken = await admin.auth().verifyIdToken(idToken)
        const { email: email_id, name: user_name, picture: profile, } = decodedToken

        // Add MondoDB query here (create user if not exist)

        const jwtPayload = { email_id, user_name, profile }
        const JWT = jwt.sign(jwtPayload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRESIN })
        res.set({ Authorization: `Bearer ${JWT}` })
        return res.status(200).json({ message: "Login successful." })
    } catch (err) {
        console.error("Something went wrong in /auth", err)
        if (err.errorInfo && err.errorInfo.code) {
            if (err.errorInfo.code == "auth/id-token-expired") {
                return res.status(401).json({ error: "IDTOKEN_EXPIRED", description: "The provided 'idToken' has expired." })
            } else if (err.errorInfo.code == "auth/argument-error") {
                return res.status(401).json({ error: "INVALID_IDTOKEN", description: "The provided 'idToken' is invalid." })
            }
        }

        console.error("Something went wrong in /auth", err)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR", description: "Something went wrong." })
    }

}