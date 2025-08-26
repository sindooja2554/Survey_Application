import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    title: { type: String, required: true },
})

const SurveySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    questions: [questionSchema],
    createdAt: { type: Date, Default: Date.now }
})

const Survey = mongoose.model('Survey', SurveySchema);

export default Survey;