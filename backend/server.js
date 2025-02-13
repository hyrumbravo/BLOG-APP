const express = require("express");
const nano = require("nano")("http://hyrumsapurco27:July272002!@127.0.0.1:5984"); // Replace with your CouchDB credentials
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const usersDb = nano.db.use("users"); // Connect to "users" database
const postsDb = nano.db.use("posts");

// Register Endpoint with Duplicate Check
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    try {
        // 🔍 Check if the username already exists
        const response = await usersDb.find({ selector: { username } });

        if (response.docs.length > 0) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // ✅ If not found, hash password and save new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { username, password: hashedPassword };
        await usersDb.insert(user);

        res.json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Error saving user", details: error.message });
    }
});


// Login Endpoint
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    console.log("Login Attempt - Username:", username); // ✅ Log received username

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    try {
        const response = await usersDb.find({ selector: { username } });

        console.log("CouchDB Query Result:", response); // ✅ Log CouchDB response

        if (response.docs.length === 0) {
            console.log("User not found!"); // ✅ Log when user is not found
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = response.docs[0]; // Get user document
        console.log("Found User:", user); // ✅ Log the retrieved user

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password Match:", isMatch); // ✅ Log if password matches

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({ message: "Login successful" });
    } catch (error) {
        console.error("Login Error:", error); // ✅ Log any errors
        res.status(500).json({ error: "Error logging in", details: error.message });
    }
});



// Blog Post Submission Endpoint
app.post("/create-post", async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: "Title and content required" });
    }

    const newPost = {
        title,
        content,
        timestamp: new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }) // Manila time
    };

    try {
        await postsDb.insert(newPost);
        res.json({ message: "Post created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error saving post", details: error });
    }
});

app.get("/posts", async (req, res) => {
    try {
        const response = await postsDb.list({ include_docs: true });
        const posts = response.rows.map(row => ({
            id: row.doc._id,
            title: row.doc.title,
            content: row.doc.content,
            timestamp: row.doc.timestamp
        }));

        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: "Error fetching posts", details: error.message });
    }
});




// Start the server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
