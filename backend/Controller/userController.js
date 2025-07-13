import db from "../db.js";
import JWT from "jsonwebtoken";
import bcrypt from 'bcrypt';


export async function registerUser(req,res){
    const {username,designation,email,password} = req.body;
    const saltRounds = 10;
    try {
        const existingUser =  await db.query("SELECT * FROM users WHERE email=$1",[email])
      if(existingUser.rows.length > 0){
        return res.status(409).json({message :"User already Exists with this email"});
      }
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const token = JWT.sign(
        { username, email }, 
         "PrivateKey", 
        { expiresIn: "15m" }
        );
      const result = await db.query(
      `INSERT INTO users (username, designation, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, designation, email`,
      [username, designation, email, hashedPassword]
    );
    const newUser = result.rows[0];
    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      jwtToken : token
    });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal server error." });   
    }
    
}


export async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = JWT.sign(
      { id: user.id, username: user.username, email: user.email },
     "PrivateKey",
      { expiresIn: "15m" }
    );
  delete user.password;
  res.status(201).json({ message: "Login successful", user, jwtToken: token });


  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}


export async function editUserDetails(req, res) {
  const { username, designation, password } = req.body;
  const email = req.user.email;  
  const saltRounds = 10;

  try {
    const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (existingUser.rows.length === 0) {
      return res.status(404).json({ message: "No user is registered with this email" });
    }

    const currentUser = existingUser.rows[0];
    const updatedUsername = username || currentUser.username;
    const updatedDesignation = designation || currentUser.designation;
    const updatedPassword = password
      ? await bcrypt.hash(password, saltRounds)
      : currentUser.password;

    const result = await db.query(
      `UPDATE users
       SET username = $1,
           designation = $2,
           password = $3
       WHERE email = $4
       RETURNING id, username, designation, email`,
      [updatedUsername, updatedDesignation, updatedPassword, email]
    );

    const updatedUser = result.rows[0];
    delete updatedUser.password;

    res.status(200).json({
      message: "User edited successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Error editing user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}




export function verifyJwtToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized. Token missing." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = JWT.verify(token, "PrivateKey");
    req.user = decoded; 
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ message: "Token Timeout, login again" });
  }
}
