const express = require('express');
const router = express.Router();
const { User } = require('../models');

// Sign Up route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.create({ username, email, password });
        req.session.save(() => {
            req.session.userId = user.id;
            req.session.loggedIn = true;
            res.status(201).json(user);
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (user && (await user.comparePassword(password))) {
            req.session.save(() => {
                req.session.userId = user.id;
                req.session.loggedIn = true;
                res.json({ message: 'Login successful', userId: user.id });
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy((err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;
