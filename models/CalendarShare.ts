import mongoose from 'mongoose';

const calendarShareSchema = new mongoose.Schema({
  calendarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sharedWith: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  permissions: {
    type: String,
    enum: ['read', 'write', 'admin'],
    default: 'read',
  },
}, {
  timestamps: true,
});

// Ensure unique sharing relationships
calendarShareSchema.index({ calendarId: 1, sharedWith: 1 }, { unique: true });

export default mongoose.models.CalendarShare || mongoose.model('CalendarShare', calendarShareSchema);