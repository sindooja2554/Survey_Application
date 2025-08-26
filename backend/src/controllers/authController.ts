import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { lstat } from "fs";

const secret = process.env.JWT_SECRET || "secret";

export const signUp = async (req: Request, res: Response) => {
    const {firstName, lastName, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        return res.status(200).json({message: 'User created successfully', user: newUser})
    } catch(error) {
        return res.status(400).json({message: 'Error signing up user', error: error.message})
    }
}

export const signIn = async ( req: Request, res: Response) => {
    try{
        const { email, password}  =  req.body;
        const user = await User.findOne({ email});

        if(!user) return res.status(404).json({ message: "User is not registered. Please register to Login"})
        
        const valid = await bcrypt.compare(password, user.password);

        if(!valid) return res.status(401).json({ message: "Invalid email or password" });

        const token = jwt.sign({ id: user._id}, secret, { expiresIn: '1h'})

        return res.status(200).json({ token, user: { id: user._id, firstName: user.firstName, lastname: user.lastName, email: user.email }})

    } catch(error) {
        console.log("Login Error", error);
        return res.status(500).json({ message: "Internal Server Error"})
    }
}