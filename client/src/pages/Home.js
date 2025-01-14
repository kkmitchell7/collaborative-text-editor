import { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() { 
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/documents'); // Navigate to the documents page if authenticated
        } else {
            navigate('/login'); // Navigate to the login page if not authenticated
        }
    }, [navigate]);

    return null; // The component doesn't render anything; it only handles navigation
};
