const express = require('express');
const router = express.Router();
const {
  createClaim,
  getMyClaims,
  getReceivedClaims,
  updateClaimStatus,
} = require('../controllers/claimController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createClaim);
router.get('/mine', protect, getMyClaims);
router.get('/received', protect, getReceivedClaims);
router.put('/:id', protect, updateClaimStatus);

module.exports = router;
