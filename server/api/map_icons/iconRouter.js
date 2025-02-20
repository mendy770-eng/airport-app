const express = require('express');
const router = express.Router();
const { createIcon, getAllIcons, editIcon, deleteIcon } = require('./iconController');

//יצירת אייקון חדש
router.post('/', createIcon);

//קבלת כל האייקונים
router.get('/', getAllIcons);

//עריכת אייקון
router.put('/:id', editIcon);

//מחיקת אייקון
router.delete('/:id', deleteIcon);

module.exports = router;