import { upsertStreamUser } from '../lib/stream.js';
import Validation from '../lib/validation.js';
import User from '../models/User.model.js'
import jwt from 'jsonwebtoken'

const signup = async (request, response) => {
    const { email, password, fullName } = request.body;

    try {
        if (!email || !password || !fullName) {
            return response.status(400).json({ message: "All fields are required." });
        }

        if (password.length < 8) {
            return response.status(400).json({ message: "Password must be at least 8 characters." });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return response.status(400).json({ message: 'Invalid email format' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return response.status(400).json({ message: "Email already exists, please use a different one." });

        const idx = Math.floor(Math.random() * 100) + 1;
        const randomPic = `https://avatar.iran.liara.run/public/${idx}.png`
        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomPic
        })

        try {
            await upsertStreamUser({
                id: newUser._id,
                name: newUser.fullName,
                image: newUser.profilePic || randomPic
            });
            console.log(`Stream user created for ${newUser.fullName}`)
        } catch (error) {
            console.error("Error creating stream user", error);
        }


        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        response.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "None",
            secure: process.env.NODE_ENV === 'production',
        })

        response.status(201).json({ success: true, user: newUser })
    } catch (error) {
        console.error("Error In Sign up method.", error);
        response.status(500).json({ message: "Internal Server Error." });
    }
};

const login = async (request, response) => {
    const { email, password } = request.body;
    try {
        if (!email || !password) {
            return response.status(400).json({ message: "All fields are required." });
        }

        const user = await User.findOne({ email });
        if (!user) return response.status(401).json({ message: "Invalid email." });

        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) return response.status(401).json({ message: "Invalid password." })

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
        response.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === 'production'
        })

        response.status(201).json({ message: "Success" })

    } catch (error) {
        console.error("Error In Login method.", error);
        response.status(500).json({ message: "Internal Server Error." });
    }
};

const logout = (request, response) => {
    response.clearCookie("jwt");
    response.status(200).json({ success: true, message: "Logout successfully." })
}

const onboard = async (request, response) => {
    try {
        const userId = request.user._id;
        const { fullName, bio, nativeLanguage, learningLanguage, location } = request.body;

        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return response.status(400).json({
                message: "All fields are required.",
                missingFields: [
                    !fullName && "fullName",
                    !bio && 'bio',
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && 'location'
                ].filter(Boolean)
            })
        }


        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...request.body,
            isOnboarded: true
        }, { new: true })

        if (!updatedUser) return response.status(401).json({ message: "User not found." })

        try {
            await upsertStreamUser({
                id: updatedUser._id,
                name: updatedUser.fullName,
                image: updatedUser.profilePic || ""
            });
            console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`)
        } catch (error) {
            console.error("Error updating during onboarding user", error);
        }

        response.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        response.status(500).json({ message: "Internal server error." })
    }
}

export default { signup, login, logout, onboard };