import User from "../models/User.js";
import bcrypt from "bcrypt";


export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:"Email already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name, email, password: hashedPassword
    });

    await user.save();
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};