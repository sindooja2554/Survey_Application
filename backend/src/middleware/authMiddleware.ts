import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET || "secret";

export const authMiddleware = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const token = req.headers.authorization.split(' ')[1];

    if(!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch(error) {
        res.status(401).json({ message: "Invalid token" });
    }
}
