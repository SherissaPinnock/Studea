// Conversation.js
import React, { useState, useEffect } from 'react';
import '../css/Conversation.css'

function Conversation({ conversationHistory, handleUserResponse }) {
    const [aiAudioUrl, setAiAudioUrl] = useState(null);
    const [userInput, setUserInput] = useState('');

    useEffect(() => {
        // Only trigger when an AI response is generated
        const aiLine = conversationHistory.find(entry => entry.ai);

        if (aiLine) {
            fetchAIAudio(aiLine.text);
        }
    }, [conversationHistory]); 

    const fetchAIAudio = async (text) => {
        try {
            const response = await fetch('/api/text-to-speech', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });

            if (response.ok) {
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                setAiAudioUrl(audioUrl);  // Set the URL of the AI audio
            } else {
                console.error('Failed to generate AI audio.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Function to handle user input submission
    const handleSubmit = () => {
        handleUserResponse(userInput);  // Send the input to the parent component's handler
        setUserInput('');  // Clear the input field
    };

    return (
        <div>
            <h3>Conversation</h3>
            <div className="conversation-container">
                {conversationHistory.map((entry, index) => (
                    <div key={index} className="message-wrapper">
                        {entry.user && (
                            <div className="message user-message">
                                <div className="user-avatar">U</div>
                                <div className="message-bubble user-bubble">{entry.user}</div>
                            </div>
                        )}
                        {entry.ai && (
                            <div className="message ai-message">
                                <div className="ai-avatar">AI</div>
                                <div className="message-bubble ai-bubble">{entry.ai}</div>
                            </div>
                        )}
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
