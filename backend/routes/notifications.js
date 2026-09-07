const express = require('express');
const router = express.Router();
const webpush = require('web-push');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Configure Web Push with VAPID keys
webpush.setVapidDetails(
  'mailto:support@lexora.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// GET /api/notifications/vapidPublicKey - Expose public key to frontend
router.get('/config/vapidPublicKey', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

// GET /api/notifications/:userId - Get all notifications for a user
router.get('/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.params.userId })
                                            .sort({ createdAt: -1 })
                                            .limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Not found' });
    
    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/notifications/subscribe - Subscribe to web push
router.post('/subscribe', async (req, res) => {
  const { userId, subscription } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if subscription already exists to avoid duplicates
    const exists = user.pushSubscriptions.some(sub => sub.endpoint === subscription.endpoint);
    if (!exists) {
      user.pushSubscriptions.push(subscription);
      await user.save();
    }

    res.status(201).json({ message: 'Subscribed to push notifications' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Utility Route for Testing: POST /api/notifications/test
router.post('/test', async (req, res) => {
  const { userId, title, message } = req.body;
  
  try {
    // 1. Save to DB
    const notif = new Notification({
      recipient: userId,
      title,
      message,
      type: 'System'
    });
    await notif.save();

    // 2. Send Web Push to all devices
    const user = await User.findById(userId);
    if (user && user.pushSubscriptions.length > 0) {
      const payload = JSON.stringify({ title, message });
      
      const sendPromises = user.pushSubscriptions.map(sub => 
        webpush.sendNotification(sub, payload).catch(err => {
          console.error("Failed to send push, maybe expired?", err);
          // In production, we should remove expired subscriptions here
        })
      );
      await Promise.all(sendPromises);
    }
    
    res.json({ message: 'Notification sent', notification: notif });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
