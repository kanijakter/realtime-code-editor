const User = require('../models/user');
const { generateToken } = require('../utils/jwtUtils');

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ name, email, password });
        await user.save();

        res.status(201).json({ msg: 'User created' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

       
        if (user.password !== password) {
           
            return res.status(400).json({ msg: 'password not match' });
        }

        const token = generateToken(user._id);

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

