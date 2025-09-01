import mongoose from 'mongoose';

const eventCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
    default: '#3B82F6',
  },
  description: {
    type: String,
  },
  icon: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.EventCategory || mongoose.model('EventCategory', eventCategorySchema);