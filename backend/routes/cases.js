const express = require('express');
const {
  getCases,
  getCase,
  createCase,
  updateCase,
  deleteCase
} = require('../controllers/cases');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes are protected

router
  .route('/')
  .get(getCases)
  .post(createCase);

router
  .route('/:id')
  .get(getCase)
  .put(updateCase)
  .delete(deleteCase);

module.exports = router;
