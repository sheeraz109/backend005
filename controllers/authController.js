const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Log the incoming data
    console.log("Received data:", req.body);

    // Check if all required fields are provided
    if (!username || !email || !password) {
      console.log("Missing required fields: username, email, or password.");
      return res.status(400).json({ error: "Username, email, and password are required" });
    }

    // Validate the email format using regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format:", email);
      return res.status(400).json({ error: "Invalid email address" });
    }

    // Check if email already exists in the database
    console.log("Checking if email already exists:", email);
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log("Email already in use:", email);
      return res.status(400).json({ error: "Email is already in use" });
    }

    // Check if username already exists in the database
    console.log("Checking if username already exists:", username);
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("Username already taken:", username);
      return res.status(400).json({ error: "User already registered" });
    }

    // Hash the password before saving to the database
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    // Create a new user instance and save it to the database
    const user = new User({ username, password: hashedPassword, email });
    console.log("Creating new user:", user);

    // Save user to the database
    await user.save();
    console.log("User created successfully.");

    // Respond with success message
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    // Catch any errors and log them
    console.error("Registration failed due to error:", error);
    res.status(400).json({ error: "Registration failed" });
  }
};





exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('email',email);
    console.log('password',password);
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7h" });
    res.json({
      token,
      message: "User successfully logged in",
      userId: user._id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    res.status(400).json({ error: "Login failed" });
  }
};
