import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<String | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const res: any = await login({ email, password});
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate('/surveys');
        } catch(error: any) {
            if(error.response) {
                setError(error.response.data.message || "Login Failed");
            } else if (error.request) {
                setError("No response from server. Please try again later.");
            } else {
                setError("Error while sending request. Please try again later.");
            }
        }

    }

    return (
        <div className="w-screen h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl w-[400px] space-y-6">
                <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>

                {error && (
                    <div className="text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="flex flex-col space-y-4">
                    <input 
                    id='email'
                    type='email'
                    placeholder="Email"
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    />

                    <input 
                    id='password'
                    type='password'
                    placeholder="Password"
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    />
                </div>

                <button 
                type="submit"
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded-lg transition-colors durations-300"
                >Login</button>

                <p>
                    Don't have an account?{" "}
                    <a href="/signup" className="text-blue-500 hover:underline">
                        Sign Up
                    </a>
                </p>

            </form>
        </div>
    )

}