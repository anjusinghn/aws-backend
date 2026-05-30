const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
var ObjectId = require("mongodb").ObjectId;

dotenv.config();
const uri = process.env.MONGODB_URI;

let client;

async function connectClient() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
}

async function signUp(req, res) {
    const { username, email, password } = req.body;
    try{
        await connectClient();
        const db = client.db("versioncontrol");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            email,
            password: hashedPassword,
            repositories: [],
            followedUsers: [],
            starRepos: [],
        };

        const result = await usersCollection.insertOne(newUser);
        const token = jwt.sign({ userId: result.insertedId }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        res.json({
            token,
            userId: result.insertedId,
        });
    }
    
    catch(error){
        console.error("Error during sign up : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

async function login(req, res) {
    const { email, password } = req.body;
    try{

        await connectClient();
        const db = client.db("versioncontrol");
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        res.json({ token, userId: user._id });

    } catch(error){
        console.error("Error during login : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

async function getAllUsers(req, res) {
    try{

        await connectClient();
        const db = client.db("versioncontrol");
        const usersCollection = db.collection("users");

        const users = await usersCollection.find({}).toArray();
        res.json(users);

    }catch(error){
        console.error("Error fetching users : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getUserProfile(req, res) {
    const currentId = req.params.id;
    try{

        await connectClient();
        const db = client.db("versioncontrol");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ _id: new ObjectId(currentId) });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.send(user, "User profile fetched");

    }catch(error){
        console.error("Error fetching user profile : ", error);
        res.status(500).json({ message: "Internal server error" });
    }

}

async function updateUserProfile(req, res) {
    const currentId = req.params.id;
    const { email,password } = req.body;

    try{

        await connectClient();
        const db = client.db("versioncontrol");
        const usersCollection = db.collection("users");


        let updateFields = {email};
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateFields.password = hashedPassword;
        }

        const result = await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(currentId) },
            { $set: updateFields },
            { returnDocument: "after" }
        );

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User profile updated", user: result });
    }catch(error){
        console.error("Error updating user profile : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function deleteUser(req, res) {
    try{
        await connectClient();
        const db = client.db("versioncontrol");
        const usersCollection = db.collection("users");

        const result = await usersCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (!result.deletedCount) {
            return res.status(404).json({ message: "User not found" });
        }
        res.send("User deleted");

    }catch(error){
        console.error("Error deleting user : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getAllUsers,
    signUp,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUser,
}