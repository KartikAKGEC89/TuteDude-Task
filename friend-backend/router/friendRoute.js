const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');

const SECRET_KEY = 'Letsmakenewfriends';

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send({ error: 'Unauthorized' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).send({ error: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};

router.get('/home', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('friends');
    const allUsers = await User.find({ _id: { $ne: req.userId } });
    res.send({
      user,
      allUsers,
    });
  } catch (error) {
    res.status(500).send({ error: 'Error fetching users' });
  }
});

router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({ username: new RegExp(query, 'i') });
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: 'Error searching users' });
  }
});

router.post('/send-request', authMiddleware, async (req, res) => {
  try {
    const { friendId } = req.body;
    const user = await User.findById(req.userId);
    if (user.friends.includes(friendId)) {
      return res.status(400).send({ error: 'Already friends' });
    }
    res.send({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).send({ error: 'Error sending request' });
  }
});

router.post('/manage-request', authMiddleware, async (req, res) => {
  try {
    const { friendId, action } = req.body;
    const user = await User.findById(req.userId);

    if (action === 'accept') {
      user.friends.push(friendId);
      await user.save();
      res.send({ message: 'Friend request accepted' });
    } else if (action === 'reject') {
      res.status(302).send({ message: 'Friend request rejected' });
    } else {
      res.status(400).send({ error: 'Invalid action' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Error managing request' });
  }
});


router.get('/recommend-friends', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('friends', 'friends username');
    const userFriendIds = user.friends.map((friend) => friend._id);

    const candidates = await User.find({
      _id: { $nin: [...userFriendIds, req.userId] },
    }).populate('friends', 'username');

    const recommendations = candidates.map((candidate) => {
      const mutualFriends = candidate.friends.filter((friend) =>
        userFriendIds.includes(friend._id.toString())
      );
      return {
        _id: candidate._id,
        username: candidate.username,
        mutualFriendsCount: mutualFriends.length,
        mutualFriends: mutualFriends.map((mf) => mf.username),
      };
    });

    recommendations.sort((a, b) => b.mutualFriendsCount - a.mutualFriendsCount);

    res.send(recommendations);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching recommendations' });
  }
});

module.exports = router;