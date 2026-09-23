const Case = require('../models/Case');

// @desc    Get all cases
// @route   GET /api/cases
// @access  Private
exports.getCases = async (req, res) => {
  try {
    const cases = await Case.find().populate('client').populate('assignedTo');
    res.status(200).json({ success: true, count: cases.length, data: cases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single case
// @route   GET /api/cases/:id
// @access  Private
exports.getCase = async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id).populate('client').populate('assignedTo');
    if (!caseItem) {
      return res.status(404).json({ success: false, message: `Case not found with id of ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: caseItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new case
// @route   POST /api/cases
// @access  Private
exports.createCase = async (req, res) => {
  try {
    const caseItem = await Case.create(req.body);
    res.status(201).json({ success: true, data: caseItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update case
// @route   PUT /api/cases/:id
// @access  Private
exports.updateCase = async (req, res) => {
  try {
    let caseItem = await Case.findById(req.params.id);

    if (!caseItem) {
      return res.status(404).json({ success: false, message: `Case not found with id of ${req.params.id}` });
    }

    caseItem = await Case.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: caseItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete case
// @route   DELETE /api/cases/:id
// @access  Private
exports.deleteCase = async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);

    if (!caseItem) {
      return res.status(404).json({ success: false, message: `Case not found with id of ${req.params.id}` });
    }

    await caseItem.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
