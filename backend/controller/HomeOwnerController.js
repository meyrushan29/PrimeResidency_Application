// controllers/ownerController.js
const db = require('../models');
const Owner = db.Owner;

// GET all owners
exports.getOwners = async (req, res) => {
  try {
    const owners = await Owner.findAll({ order: [['id', 'ASC']] });
    res.json({ success: true, owners });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch owners', error });
  }
};

// GET one owner
exports.getOwnerById = async (req, res) => {
  try {
    const owner = await Owner.findByPk(req.params.id);
    if (!owner) return res.status(404).json({ success: false, message: 'Owner not found' });
    res.json({ success: true, owner });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch owner', error });
  }
};

// CREATE new owner
exports.createOwner = async (req, res) => {
  try {
    const owner = await Owner.create(req.body);
    res.status(201).json({ success: true, owner });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create owner', error });
  }
};

// UPDATE owner
exports.updateOwner = async (req, res) => {
  try {
    const owner = await Owner.findByPk(req.params.id);
    if (!owner) return res.status(404).json({ success: false, message: 'Owner not found' });

    await owner.update(req.body);
    res.json({ success: true, owner });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update owner', error });
  }
};

// DELETE owner
exports.deleteOwner = async (req, res) => {
  try {
    const owner = await Owner.findByPk(req.params.id);
    if (!owner) return res.status(404).json({ success: false, message: 'Owner not found' });

    await owner.destroy();
    res.json({ success: true, message: 'Owner deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete owner', error });
  }
};
