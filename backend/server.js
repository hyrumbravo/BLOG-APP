const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");

// const COUCHDB_URL = process.env.COUCHDB_URL || 'http://hyrumsapurco27:july272002@127.0.0.1:5984';
// const COUCHDB_URL = process.env.COUCHDB_URL || 'http://hyrumsapurco27:july272002@host.docker.internal:5984';
const COUCHDB_URL = process.env.COUCHDB_URL || 'http://hyrumsapurco27:july272002@172.27.16.1:5984';
// const COUCHDB_URL = process.env.COUCHDB_URL || 'http://hyrumsapurco27:july272002@192.168.1.121:5984';
// const COUCHDB_URL = process.env.COUCHDB_URL || 'http://hyrumsapurco27:july272002@couchdb:5984';
// const COUCHDB_URL = process.env.COUCHDB_URL || "http://couchdb:5984";


const nano = require("nano")(COUCHDB_URL);
const app = express();

app.use(express.json());
app.use(cors());

// Function to check and create a database if it doesn't exist
const ensureDatabaseExists = async (dbName) => {
    try {
        const dbList = await nano.db.list();
        if (!dbList.includes(dbName)) {
            await nano.db.create(dbName);
            console.log(`✅ Database '${dbName}' created.`);
        } else {
            console.log(`🔹 Database '${dbName}' already exists.`);
        }
    } catch (error) {
        console.error(`❌ Error checking/creating database '${dbName}':`, error);
    }
};

// Function to get database instance, ensuring it exists
const getDatabase = async (dbName) => {
    await ensureDatabaseExists(dbName);
    return nano.db.use(dbName);
};

// Ensure 'users' and 'posts' databases exist before assigning them
let usersDb, postsDb;
(async () => {
    usersDb = await getDatabase("users");
    postsDb = await getDatabase("posts");
})();

// Welcome Endpoint
app.get("/", (req, res) => {
    res.send("Welcome to the Blog API! 🚀");
});

// Register Endpoint with Duplicate Check
app.post("/register", async (req, res) => {
    const { fullname, username, password } = req.body;
    if (!fullname || !username || !password) {
        return res.status(400).json({ message: "Full name, Username and Password required" });
    }
    try {
        usersDb = await getDatabase("users");
        const response = await usersDb.get(username).catch(() => null);
        if (response) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { _id: username, fullname, username, password: hashedPassword };
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
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }
    try {
        usersDb = await getDatabase("users");
        const response = await usersDb.find({ selector: { username } });
        if (response.docs.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const user = response.docs[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.json({ message: "Login successful", userID: user._id, fullname: user.fullname });
    } catch (error) {
        res.status(500).json({ error: "Error logging in", details: error.message });
    }
});

// Blog Post Submission Endpoint
app.post("/create-post", async (req, res) => {
    const { title, content, userID, fullname } = req.body;
    if (!title || !content || !userID) {
        return res.status(400).json({ message: "Title, content, and userID required" });
    }
    const newPost = {
        title,
        content,
        userID,
        fullname,
        timestamp: new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })
    };
    try {
        postsDb = await getDatabase("posts");
        await postsDb.insert(newPost);
        res.json({ message: "Post created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error saving post", details: error });
    }
});

// Fetch posts for a specific user
app.get("/posts/:userID", async (req, res) => {
    const { userID } = req.params;
    if (!userID) {
        return res.status(400).json({ message: "UserID required" });
    }
    try {
        postsDb = await getDatabase("posts");

        // const response = await postsDb.find({ selector: { userID } });
        const response = await postsDb.find({ selector: { userID: { "$eq": userID } } });

        res.json({ posts: response.docs.length ? response.docs : [] });
    } catch (error) {
        res.status(500).json({ error: "Error fetching posts", details: error.message });
    }
});




// Start the server
app.listen(3000,"0.0.0.0", () => console.log("🚀 Server running on http://localhost:3000"));
































