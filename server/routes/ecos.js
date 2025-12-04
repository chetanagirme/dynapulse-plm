const express = require('express');
const router = express.Router();
const ECO = require('../models/ECO');

router.get('/', async (req, res) => {
    try {
        const ecos = await ECO.find();
        res.json(ecos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const eco = new ECO(req.body);
    try {
        const newECO = await eco.save();
        res.status(201).json(newECO);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedECO = await ECO.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        res.json(updatedECO);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await ECO.findOneAndDelete({ id: req.params.id });
        res.json({ message: 'ECO deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
