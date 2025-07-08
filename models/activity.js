const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
   startDate: {
    type: Date,
    required: true
  },
   endDate: {
    type: Date,
    required: true,
  },
    points: {
    type: Number,
    required: true,
  },
  description:{
    type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  enrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;