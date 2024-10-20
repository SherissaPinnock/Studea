// Conversation.js
import React, { useState } from 'react';

function Conversation({ conversationHistory, handleUserResponse }) {
    const [userInput, setUserInput] = useState('');

    // Function to handle user input submission
    const handleSubmit = () => {
        handleUserResponse(userInput);  // Send the input to the parent component's handler
        setUserInput('');  // Clear the input field
    };

    return (
        <div>
            <h3>Conversation</h3>
            <div className="conversation">
                {conversationHistory.map((entry, index) => (
                    <div key={index}>
                        <p><strong>You:</strong> {entry.user}</p>
                        <p><strong>AI:</strong> {entry.ai}</p>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Reply in Spanish..."
            />
            <button onClick={handleSubmit}>Send</button>
        </div>
    );
}

export default Conversation;
