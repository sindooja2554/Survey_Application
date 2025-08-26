import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
    firstName: string;
    lastName: string;
}

export default function Header() {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if(storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    }

    return (
        <header className="w-full bg-blue-600 text-white shadow-md">
            <div className="max-w-8xl mx-auto flex items-center justify-between px-6 py-3">
                <h1 className="text-xl font-bold">Survey Application</h1>
                <div className="flex items-center space-x-3">
                    {user && (
                        <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
                    )}
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-blue-600 font-bold">
                        {initials}
                    </div>
                    <button onClick={handleLogout} className="bg-white text-blue-600 font-semibold px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                        Logout
                    </button>
                </div>
            </div>
        </header>
    )
}