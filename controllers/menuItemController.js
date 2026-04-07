const express = require('express');
const MenuItem = require('../models/menu_item');
const cloudinary = require('../config/cloudinary');
const Category = require('../models/category');

module.exports.getAllMenuItems_get = async (req, res) => {
  try {
    const menuItems = await MenuItem.find().populate('category', 'name');

    const categorizedItems = {};
    menuItems.forEach(item => {
      const categoryName = item.category ? item.category.name : 'Uncategorized';
      if (!categorizedItems[categoryName]) {
        categorizedItems[categoryName] = [];
      }
      categorizedItems[categoryName].push(item);
    });

    res.status(200).json({
      message: 'Menu items fetched successfully, categorized',
      data: categorizedItems,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Server error while fetching menu items',
      error: err.message,
    });
  }
};

module.exports.createMenuItem_post = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const imageFile = req.file;

    if (!name || !description || !price || !category || !imageFile) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'Name must not be empty' });
    }
    if (name.length > 50) {
      return res.status(400).json({ message: 'Name cannot exceed 50 characters' });
    }

    if (typeof description !== 'string' || description.trim() === '') {
      return res.status(400).json({ message: 'Description must not be empty' });
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum)) {
      return res.status(400).json({ message: 'Price must be a valid number' });
    }
    if (priceNum < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }

    if (typeof category !== 'string' || category.trim() === '') {
      return res.status(400).json({ message: 'Category must not be empty' });
    }

    if (!imageFile) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const result = await cloudinary.uploader.upload(imageFile.path, {
      folder: 'menu_items',
      quality: 'auto:good',     
      fetch_format: 'auto'    
    });

    const imagePath = result.secure_url;

    const newMenuItem = await MenuItem.create({
      image: imagePath,
      name: name.trim(),
      description: description.trim(),
      price: priceNum,
      category: category.trim(),
    });

    res.status(201).json({
      message: 'Menu item created successfully',
      item: newMenuItem,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error while creating menu item',
      error: err.message,
    });
  }
};

module.exports.updateMenuItem_patch = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;
    const imageFile = req.file;

    const item = await MenuItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ message: 'Name must not be empty if provided' });
      }
      if (name.length > 50) {
        return res.status(400).json({ message: 'Name cannot exceed 50 characters' });
      }
      item.name = name.trim();
    }

    if (description !== undefined) {
      if (typeof description !== 'string' || description.trim() === '') {
        return res.status(400).json({ message: 'Description must not be empty if provided' });
      }
      item.description = description.trim();
    }

    if (price !== undefined) {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum)) {
        return res.status(400).json({ message: 'Price must be a valid number if provided' });
      }
      if (priceNum < 0) {
        return res.status(400).json({ message: 'Price cannot be negative' });
      }
      item.price = priceNum;
    }

    if (category !== undefined) {
      if (typeof category !== 'string' || category.trim() === '') {
        return res.status(400).json({ message: 'Category must not be empty if provided' });
      }
      item.category = category.trim();
    }

    if (imageFile) {
      if (item.image && item.image.includes('res.cloudinary.com')) {
        const publicId = item.image.split('/').slice(-1)[0].split('.')[0];
        await cloudinary.uploader.destroy(`menu_items/${publicId}`);
      }

      const result = await cloudinary.uploader.upload(imageFile.path, {
        folder: 'menu_items',
        quality: 'auto:good',      
        fetch_format: 'auto'    
      });


    item.image = result.secure_url;
  }

    await item.save();

    res.status(200).json({
      message: 'Menu item updated successfully',
      item,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error while updating menu item',
      error: err.message,
    });
  }
};

module.exports.deleteMenuItem_delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMenuItem = await MenuItem.findByIdAndDelete(id);

    if (!deletedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    res.status(500).json({
      message: 'Server error while deleting menu item',
      error: err.message,
    });
  }
};
