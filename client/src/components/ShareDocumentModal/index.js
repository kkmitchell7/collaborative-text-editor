import './styles.css'
import React, {useState, useEffect} from 'react'
import ManageUsersList from '../ManageUsersList'


export default function ShareDocumentModal({isOpen, onClose, documentId}) {
    const [username, setUsername] = useState('');  // State for username input
    const [usersWithAccess, setUsersWithAccess] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [updateList, setUpdateList] = useState(0);

    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem('token');

    const handleUsernameChange = (e) => setUsername(e.target.value);
    
    const handleOnClose = () =>{
        setError('');
        setMessage('')
        onClose();
    }
    
    const handleShareDocument = async () => {
        try {
           
            const userResponse = await fetch(`${backendUrl}/api/users/ID/${username}`);
            const userData = await userResponse.json();

            if (userResponse.status !== 200) {
                setMessage('');
                setError(userData.error);
                return;
            }

            const userId = userData.userId;

            
            const updateResponse = await fetch(`${backendUrl}/api/documents/${documentId}/access`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ userId }),
            });

            const updateData = await updateResponse.json();

            if (updateResponse.status === 200) {
                setError('');
                setUpdateList((prevCount) => prevCount + 1);
                setMessage('Access granted successfully!');
            } else if (updateData.error === `User with ID: ${userId} already has access to the document`) {
                setMessage('');
                setError(`${username} already has access to the document`);
            } else {
                setMessage('');
                setError('Something went wrong on our end');
            }
        } catch (error) {
            console.error('Error granting access:', error);
            setMessage('');
            setError('An error occurred while granting access.');
        }
    };

    useEffect(()=>{
        const fetchUsersWithAccess = async ()=>{
            try {
                const response = await fetch(`${backendUrl}/api/documents/${documentId}/access`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` }
                });
                const {users} = await response.json();
                setUsersWithAccess(users);
            } catch (error) {
                console.error('Error fetching all users:', error);
                setError('An error occured while fetching user IDs with access')
            }
        };

        if (documentId){
            fetchUsersWithAccess();
        }
        
    },[backendUrl,token,documentId,updateList]) //need to run this every time message changes because we've successfully removed or added someone



    return isOpen ? (
        <div className="modal">
            <div className="modal-content">
                <h2>Share Document</h2>
                < ManageUsersList users={usersWithAccess} documentId={documentId} setError={setError} setMessage={setMessage} setUpdateList={setUpdateList}/>
                <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="Enter Username"
                />
                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}
                <button onClick={handleOnClose} className="modal-button">Done</button>
                <button onClick={handleShareDocument} className="modal-button">Share</button>
            </div>
        </div>) : null;
}
