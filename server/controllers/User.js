import bcrypt from 'bcryptjs';
import User from "../models/user.js";

export const Login = async (req, res) => {
    console.log(req.body)
    const { username, password } = req.body
    try {
        const oldUser = await User.findOne({ username });
        if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });
        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
        if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid username or password!"});
        res.status(200).json({ result: oldUser });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

export const Signup = async (req, res) => {
    console.log(req.body)
    const { firstName, lastName, username, password, confirmPassword } = req.body;
    try {
        const oldUser = await User.findOne({username}); 
        debugger;
        if (oldUser) return res.status(400).json({ message: "User already exists!" });
        if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match." });

        const hashedPassword = await bcrypt.hash(password, 12); 
        const result = await User.create({ username, password: hashedPassword, firstName, lastName }); 
        res.status(201).json({ message: "New User successfully created!", result });
    }
    catch (error){
        res.status(500).json({ message: error.message });
    }
}
