import './styles.css'

import React from 'react'

export default function ManageUsersList({users, documentId, setError,setMessage, setUpdateList}) {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem('token');
    const userId = JSON.parse(localStorage.getItem('userId'));

    const onRevoke = async (userId)=>{
        try{
            const response = await fetch(`${backendUrl}/api/documents/${documentId}/access`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ userId }),
            });
            if (response.ok){
                setError('');
                setUpdateList((prevCount) => prevCount + 1);
                setMessage('Successfully revoked access')
            } else {
                setMessage('');
                setError('Failed to revoke access')
            }
        } catch (error){
            console.error(`Failed to revoke access:${error}`)
            setMessage('');
            setError('Failed to revoke access')
        }
    }
    return (
    <div className="manage-users-list">
        <h4>Users with Access:</h4>
            {users.filter((user) => user._id !== userId).map((user, index) => (
                <div key={user._id}>
                    <span>{user.username}</span>
                    <button
                    className="revoke-button"
                    onClick={() => onRevoke(user._id)} // Call the revoke function with the user's ID
                    >
                    Revoke
                    </button>
                </div>
            ))}
        </div>
  )
}
