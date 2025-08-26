import { Request, response, Response } from "express";
import Survey from "../models/Survey.js";
import ResponseModel from "../models/Response.js";

export const getSurveys =  async ( req: Request, res: Response) => {
    try {
        const surveys = await Survey.find({});
        return res.status(200).json(surveys);

    } catch(error) {
        console.log("Error while getting the surveys", error);
        return res.status(500).json({ message: "Error while getting the surveys" })
    }
}

export const getSurveyById = async ( req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const survey = await Survey.findById(id);

        if( !survey) {
            return res.status(404).json({ message: "Survey not found" });
        }
        return res.status(200).json(survey);
    } catch(error) {
        console.log("Error while getting the survey", error);
        return res.status(500).json({ message: "Error while getting the survey" });
    }
}

export const submitResponses = async( req: Request, res: Response) => {
    try {
        const { id: survey_id } = req.params;
        const { responses } = req.body;

        const user_id = req.user?.id;

        if(!user_id) return res.status(401).json({ message: "Unauthorized User"});

        const docs = responses.map(r => ({
            user_id,
            survey_id,
            question_id: r.question_id,
            response: r.response
        }));
    
        await ResponseModel.insertMany(docs);

        return res.status(200).json({ message: "Responses submitted successfully"});
    } catch(error) {
        console.log("Error while submitting response", error);
        return res.status(500).json({ message: "Error while submitting response" });
    }
}

export const getUserResponses = async (req: Request, res: Response) => {
    try {
        const survey_id = req.params.id;
        const user_id = req.user?.id;

        if(!user_id) return res.status(401).json({ message: "Unauthorized User"});

        const responses = await ResponseModel.find({ user_id, survey_id})

        return res.status(200).json(responses);

    } catch(error) {
        console.log("Error fetching the response", error);
        return res.status(500).json({ message: "Error fetching the response" });
    }
}