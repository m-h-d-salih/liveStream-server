import mongoose from 'mongoose';

const MeetingSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

export const Meeting = mongoose.model('Meeting', MeetingSchema);
