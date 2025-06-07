import mongoose, { Schema, model, models } from 'mongoose';

const questionSchema = new Schema({
  type: { type: String, enum: ['single-choice', 'short-text'], required: true },
  question: { type: String, required: true },
  options: [String], // only used for single-choice
});

const quizSchema = new Schema(
  {
    title: { type: String, required: true },
    questions: [questionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Quiz = models.Quiz || model('Quiz', quizSchema);
export default Quiz;
