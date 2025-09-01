import mongoose from 'mongoose';

const attendeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'tentative'],
    default: 'pending',
  },
  isOptional: {
    type: Boolean,
    default: false,
  },
  responseAt: {
    type: Date,
  },
});

const recurrenceSchema = new mongoose.Schema({
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly', 'custom'],
    required: true,
  },
  interval: {
    type: Number,
    default: 1,
  },
  endType: {
    type: String,
    enum: ['never', 'date', 'count'],
    default: 'never',
  },
  endDate: {
    type: Date,
  },
  endCount: {
    type: Number,
  },
  byWeekDay: [Number],
  byMonthDay: [Number],
  byMonth: [Number],
  exceptions: [Date],
});

const reminderSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['email', 'push', 'popup'],
    required: true,
  },
  minutesBefore: {
    type: Number,
    required: true,
  },
  sent: {
    type: Boolean,
    default: false,
  },
});

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  allDay: {
    type: Boolean,
    default: false,
  },
  location: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventCategory',
  },
  color: {
    type: String,
    default: '#3B82F6',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  attendees: [attendeeSchema],
  recurrence: recurrenceSchema,
  reminders: [reminderSchema],
  isPrivate: {
    type: Boolean,
    default: false,
  },
  weatherDependent: {
    type: Boolean,
    default: false,
  },
  travelTime: {
    type: Number,
    default: 0,
  },
  videoMeetingLink: {
    type: String,
  },
  notes: [noteSchema],
  status: {
    type: String,
    enum: ['tentative', 'confirmed', 'cancelled'],
    default: 'confirmed',
  },
}, {
  timestamps: true,
});

// Indexes for performance
eventSchema.index({ start: 1, end: 1 });
eventSchema.index({ createdBy: 1 });
eventSchema.index({ 'attendees.userId': 1 });

export default mongoose.models.Event || mongoose.model('Event', eventSchema);