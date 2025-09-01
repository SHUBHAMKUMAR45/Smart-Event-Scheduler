import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  emailVerified: {
    type: Date,
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  password: {
    type: String,
  },
  preferences: {
    timezone: {
      type: String,
      default: 'UTC',
    },
    workingHours: {
      start: {
        type: String,
        default: '09:00',
      },
      end: {
        type: String,
        default: '17:00',
      },
      days: {
        type: [Number],
        default: [1, 2, 3, 4, 5], // Monday to Friday
      },
    },
    defaultEventDuration: {
      type: Number,
      default: 60, // minutes
    },
    reminderDefaults: {
      type: [Number],
      default: [15, 60], // minutes before event
    },
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', userSchema);