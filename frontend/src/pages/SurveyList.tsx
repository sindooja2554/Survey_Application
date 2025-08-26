import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/header";

type Survey = {
    id: number;
    title: string;
    description: string;
};

export default function SurveyList() {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/surveys').then(response => setSurveys(response.data))
        .catch(error => console.error('Error fetching surveys:', error))
        .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
            <Header />
            <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                    Survey List
                </h2>

                {loading && (
                    <p className="text-center text-gray-500">Loading Surveys...</p>
                )}

                {!loading && surveys.length === 0 && (
                    <p className="text-center text-gray-500">No Surveys Found</p>
                )}

                <div className="space-y-4">
                    {surveys.map((survey) => (
                        <Link to={`/survey/${survey._id}`} className="block p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200">
                            <h3 className="font-semibold text-lg text-gray-800">
                                {survey.title}
                            </h3>
                            {survey.description && (
                                <p className="mt-2 text-gray-600">
                                    {survey.description}
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}