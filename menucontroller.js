
const Menu = require('../models/menu.model');
const Category = require('../models/category.model');
const { validationResult } = require('express-validator');

// Создать новое меню
exports.createMenu = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, photo, isPublish } = req.body;

    try {
        let menu = new Menu({
            title,
            photo,
            isPublish
        });

        menu = await menu.save();

        res.json(menu);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Обновить меню
exports.updateMenu = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, photo, isPublish } = req.body;

    try {
        let menu = await Menu.findById(req.params.menuId);

        if (!menu) {
            return res.status(404).json({ msg: 'Menu not found' });
        }

        menu.title = title;
        menu.photo = photo;
        menu.isPublish = isPublish;

        menu = await menu.save();

        res.json(menu);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Удалить меню
exports.deleteMenu = async (req, res) => {
    try {
        let menu = await Menu.findById(req.params.menuId);

        if (!menu) {
            return res.status(404).json({ msg: 'Menu not found' });
        }

        await Category.deleteMany({ menuId: req.params.menuId });
        await Menu.findByIdAndRemove(req.params.menuId);

        res.json({ msg: 'Menu removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
