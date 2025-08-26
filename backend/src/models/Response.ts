import mongoose from "mongoose";

const ResponseSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    survey_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey', required: true },
    question_id: { type: String, required: true },
    response: { type: mongoose.Schema.Types.Mixed, required: true }
})

const Response = mongoose.model('Response', ResponseSchema);

export default Response;