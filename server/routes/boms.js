const express = require('express');
const router = express.Router();
const BOM = require('../models/BOM');

router.get('/', async (req, res) => {
    try {
        const boms = await BOM.find();
        res.json(boms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const bom = new BOM(req.body);
    try {
        const newBOM = await bom.save();
        res.status(201).json(newBOM);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedBOM = await BOM.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        res.json(updatedBOM);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await BOM.findOneAndDelete({ id: req.params.id });
        res.json({ message: 'BOM deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
