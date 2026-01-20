const express = require('express');
const { getCurrentSong } = require('../services/streamMetadata');

const router = express.Router();

router.get('/now-playing', (req, res) => {
  res.json(getCurrentSong());
});

module.exports = router;
