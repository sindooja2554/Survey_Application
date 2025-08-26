import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/header";
import ProgressBar from "../components/Progressbar";

type Question = {
    options?: string[];
    question_type: 'text' | 'number' | 'rating' | 'checkbox';
    id: number;
    title: string;
    description?: string;
    required: boolean;
}

export default function SurveyForm() {
    const {id} = useParams();
    const [survey, setSurvey] = useState<{title: string; description?: string; questions: Question[]} | null>(null);
    const navigate = useNavigate();
    const [currIndex, setCurrIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: any }>({});
    const [error, setError] = useState<string | null>(null);
    const question = survey?.questions[currIndex];

    const validateCurrent = () => {
        if(!question.required) return true;
        const answer = answers[question.id];
        if(question?.question_type === 'checkbox' && Array.isArray(answer) && answer.length === 0) {
            setError('Please select at least one option.');
            return false;
        }
        if((question?.question_type === 'text' || question?.question_type === 'number' || question?.question_type === 'rating') && (!answer || answer.toString().trim() === "")) {
            setError('This question is required.');
            return false;
        }
        return true;
    }

    const handleNext = () => {
        if(!validateCurrent()) return;
        setCurrIndex(idx => Math.min(idx + 1, survey?.questions.length - 1));
        if(error) setError('');
    }

    const handlePrev = () => {
        setCurrIndex(idx => Math.max(idx - 1, 0));
        if(error) setError('');
    }

    const handleSubmit = async() => {
        for( const q of survey?.questions || []) {
            if(q.required && (!answers[q.id] || (Array.isArray(answers[q.id]) && answers[q.id].length === 0))) {
                setCurrIndex(survey?.questions.indexOf(q));
                setError('Please answer all required questions.');
                return;
            }
        }
        const token = localStorage.getItem("token");
        await axios.post(`http://localhost:3000/api/surveys/${id}/responses`, { responses:Object.entries(answers).map(([question_id, response]) => ({ question_id, response })) }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        navigate(`/surveys/${id}/review`);
    }

    const renderInputField = (question: Question) =>{
        const value = answers[question.id] || "";

        switch(question.question_type) {
            case 'text': 
                return (
                    <input 
                    type="text"
                    className="border p-2 w-full rounded"
                    value={value}
                    onChange={handleChange}
                    />
                )
            case 'number': 
                return (
                    <input
                    type="number"
                    className="border p-2 w-full rounded"
                    value={value}
                    onChange={handleChange}
                    />
                )
            case 'rating':
                return (
                    <div className="flex space-x-2 mt-2">
                        {[1,2,3,4,5].map(star => (
                            <button type="button" key={star} className={`p-2 rounded ${Number(value) >= star ? 'bg-yellow-400' : 'bg-gray-200'}`}
                            onClick={() => setAnswers({...answers, [question.id]: star})}>
                                {star}☆
                            </button>
                        ))}
                    </div>
                )
            case 'checkbox': 
                return (
                    <div className="flex flex-col mt-2">
                        {question.options?.map(option => {
                            const selected = Array.isArray(answers[question.id]) ? answers[question.id] : [];
                            return (
                                <label key={option} className="mb-1 flex items-center">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={selected.includes(option)}
                                        onChange={() => {
                                            const newSelected = selected.includes(option)
                                                ? selected.filter(item => item !== option)
                                                : [...selected, option];
                                            setAnswers({...answers, [question.id]: newSelected});
                                        }}
                                    />
                                    {option}
                                </label>
                            )
                        })
                        }
                    </div>
                )
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
            <Header />
            <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                    {survey?.title}
                </h2>
                {survey?.description && (
                    <p className="mb-4 text-gray-700 text-center">
                        {survey.description}
                    </p>
                )}

                <ProgressBar progress={((currIndex + 1)/survey?.questions.length) * 100} />

                <div className="mb-4 mt-4"> 
                    <h3 className="font-semibold text-gray-800">
                        {question.title} {question?.required && <span className="text-sm mb-2 text-gray-600">{question.description}</span>}
                        {renderInputField(question)}
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p> }
                    </h3>
                </div>

                <div className="flex justify-between mt-4"> 
                    <button disabled={currIndex === 0}
                    onClick={handlePrev} className="bg-gray-300 p-2 rounded hover:bg-gray-400 transition">
                    Previous
                    </button>
                    {currIndex < survey?.questions.length - 1 ? (
                        <button onClick={handleNext} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
                            Next
                        </button>
                    ) : (
                        <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded hover:bg-green-600 transition">
                            Submit
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
