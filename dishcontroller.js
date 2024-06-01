
const Dish = require('../models/dish.model');
const { validationResult } = require('express-validator');

// Создать новое блюдо
exports.createDish = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { categoryId, title, description, photo, isPublish, ingredients, price } = req.body;

    try {
        let dish = new Dish({
            categoryId,
            title,
            description,
            photo,
            isPublish,
            ingredients,
            price
        });

        dish = await dish.save();

        res.json(dish);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Обновить блюдо
exports.updateDish = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, photo, isPublish, ingredients, price } = req.body;

    try {
        let dish = await Dish.findById(req.params.dishId);

        if (!dish) {
            return res.status(404).json({ msg: 'Dish not found' });
        }

        dish.title = title;
        dish.description = description;
        dish.photo = photo;
        dish.isPublish = isPublish;
        dish.ingredients = ingredients;
        dish.price = price;

        dish = await dish.save();

        res.json(dish);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Удалить блюдо
exports.deleteDish = async (req, res) => {
    try {
        let dish = await Dish.findById(req.params.dishId);

        if (!dish) {
            return res.status(404).json({ msg: 'Dish not found' });
        }

        await Dish.findByIdAndRemove(req.params.dishId);

        res.json({ msg: 'Dish removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
