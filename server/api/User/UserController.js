const User = require('./UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create a new user
async function register(req, res) {
    try {
        let longitude = 0;
        let latitude = 0;
        const { firstName, lastName, birthday, permission, email, password } = req.body;
        console.log("p is:"+permission)
        if (permission === "airportInspector") {
            longitude = 40.64243;
            latitude = -73.78122;
        }
        else if (permission === "manager") {
            longitude = 40.652398;
            latitude = -73.800251;
        }
        else if (permission === "technician") {
            longitude = 40.655451;
            latitude = -73.802397;
        }
        else if (permission === "ground_attendant") {
            longitude = 40.642596;
            latitude = -73.778963;
        }
        const newUser = new User({ firstName, lastName, birthday, permission, email, password, longitude, latitude });
        const savedUser = await newUser.save();
        const token = jwt.sign({ userId: savedUser._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: savedUser._id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                birthday: savedUser.birthday,
                permission: savedUser.permission,
                email: savedUser.email
            },
            token
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all users
async function getAllUsers(req, res) {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get user by ID
async function getUserById(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update user
async function updateUser(req, res) {
    try {
        const { permission } = req.body;
        if (permission === "airport inspector") {
            longitude = 40.64243;
            latitude = -73.78122;

        }
        else if (permission === "manager") {
            longitude = 40.652398;
            latitude = -73.800251;

        }
        else if (permission === "technician") {
            req.body.longitude = 1.2
            req.body.latitude = 1.2

        }
        else if (permission === "ground attendant") {
            req.body.longitude = 1.2
            req.body.latitude = 1.2
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

// Delete user
async function deleteUser(req, res) {
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        console.log(`User ${userId} was successfully deleted`);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
};

// Get users by permission level
async function getUsersByPermission(req, res) {
    try {
        const { permission } = req.params;
        const users = await User.find({ permission });
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: 'Missing email or password', error: "missing email or password"
        });
    }
    try {
        const user = await User.findOne({ email });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
                error: "invalid email or password"
            });
        }
        const token = jwt.sign({ userId: user.id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                birthday: user.birthday,
                permission: user.permission,
                email: user.email
            },
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error: error.message
        });
    }
};

// הוספת פונקציות חדשות
const getAllUsersPublic = async (req, res) => {
    try {
        const users = await User.find();
        const usersList = users.map(user => ({
            _id: user._id,
            fullName: `${user.firstName} ${user.lastName}`,
            email: user.email,
            permission: user.permission
        }));
        res.json(usersList);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

module.exports = {
    register,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUsersByPermission,
    login,
    getAllUsersPublic
};
