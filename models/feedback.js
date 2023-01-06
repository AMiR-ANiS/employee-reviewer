// mongoose feedback model

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
