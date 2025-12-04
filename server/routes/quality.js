const express = require('express');
const router = express.Router();
const { NCR, CAPA } = require('../models/Quality');

// NCR Routes
router.get('/ncrs', async (req, res) => {
    try {
        const ncrs = await NCR.find();
        res.json(ncrs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/ncrs', async (req, res) => {
    const ncr = new NCR(req.body);
    try {
        const newNCR = await ncr.save();
        res.status(201).json(newNCR);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/ncrs/:id', async (req, res) => {
    try {
        const updatedNCR = await NCR.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        res.json(updatedNCR);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// CAPA Routes
router.get('/capas', async (req, res) => {
    try {
        const capas = await CAPA.find();
        res.json(capas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/capas', async (req, res) => {
    const capa = new CAPA(req.body);
    try {
        const newCAPA = await capa.save();
        res.status(201).json(newCAPA);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
