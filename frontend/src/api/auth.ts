import axios from 'axios';

export const login = async (data: {email: string, password: string}) => {
    axios.post('/api/login', data);
}

export const signup = async (data: {firstName: string, lastName: string, email: string, password: string}) => {
    axios.post('/api/signup', data);
}

