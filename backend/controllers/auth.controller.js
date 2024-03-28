import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req,res)=>{
    try {
        const {fullName, username, password, confirmPassword, gender} = req.body;

        if(password !== confirmPassword){
            return res.status(400).json({error: "Passwords does not match"})
        }

        const user = await User.findOne({username})

        if(user){
            return res.status(400).json({error: "Username already exists"});
        }

        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //https://avatar-placeholder.iran.liara.run/      https://avatar.iran.liara.run/public/boy?username=Scott

        const boyProfilepic =  `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilepic =  `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = new User({
            fullName: fullName,
            username:username,
            password:hashedPassword,
            gender:gender,
            profilePic: gender === "male" ? boyProfilepic : girlProfilepic
        })
            
        if(newUser){
            // Generate JWT token
            generateTokenAndSetCookie(newUser._id, res);

            await newUser.save();
        
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic
        });
        }else{
            return res.status(400).json({error: "Invalid User data"});
        }


    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const login = async (req,res)=>{
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username})
        const isPassword = await bcrypt.compare(password, user?.password || "");
        
        if(!user || !isPassword){
            return res.status(400).json({error: "Invalid Username or password"});
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const logout = (req,res)=>{
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

