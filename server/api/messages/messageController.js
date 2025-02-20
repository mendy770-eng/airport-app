const Message = require('./messageModel');
const jwt = require('jsonwebtoken');

// שליחת הודעה חדשה
async function sendMessage(req, res) {
    try {
        const { receiver, content } = req.body;
        const sender = req.user.userId; // מניח שהמשתמש מחובר ונתון ב-req.user

        const message = new Message({
            sender,
            receiver,
            content
        });

        const savedMessage = await message.save();

        res.status(201).json({
            success: true,
            message: "message sent successfully",
            data: savedMessage
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// קבלת כל ההודעות של משתמש מסוים
async function getMessages(req, res) {
    try {
        const permission = req.user.permission;
        const messages = await Message.find({receiver: permission})
            .populate('sender', 'firstName lastName email')
            .sort({ sentAt: -1 });

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// סימון הודעה כנקראה
async function markAsRead(req, res) {
    try {
        const messageIds = req.params.ids;

        const result = await Message.updateMany({_id: {$in: messageIds}}, {read: true});

        if (!result.modifiedCount) {
            return res.status(404).json({
                success: false,
                message: "the messages were not found"
            });
        }

        res.status(200).json({
            success: true,
            message: 'the message were marked as read',
            data: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    markAsRead
};
