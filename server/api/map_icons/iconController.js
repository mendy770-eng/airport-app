const Icon = require('./iconModel');

const createIcon = async (req, res) => {
    const { name, image, location, type } = req.body;
    try {
        const icon = new Icon({ name, image, location, type });
        await icon.save();
        res.status(201).json({ success: true, data: icon });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllIcons = async (req, res) => {
    try {
        const icons = await Icon.find();
        res.status(200).json({
            success: true,
            data: icons
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const editIcon = async (req, res) => {
    const { id } = req.params;
    const { name, image, location, type } = req.body;
    try {
        const icon = await Icon.findByIdAndUpdate(id, { name, image, location, type }, { new: true, runValidators: true });
        res.status(200).json({
            success: true,
            data: icon
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteIcon = async (req, res) => {
    const { id } = req.params;
    try {
        await Icon.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            data: null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createIcon,
    getAllIcons,
    editIcon,
    deleteIcon
};