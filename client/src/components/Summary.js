import React, { useEffect, useState } from 'react';

function Summary({ conversationHistory }) {
    const [summary, setSummary] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            generateSummary();
        }, 2000); // Wait 2 seconds before making the request

        return () => clearTimeout(delayDebounceFn);
    }, [conversationHistory]);

    const generateSummary = async () => {
        try {
            const res = await fetch('/api/summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ conversationHistory }),
            });

            if (!res.ok) {
                throw new Error(`Server responded with ${res.status}`);
            }

            const data = await res.json();
            setSummary(data.summary);
        } catch (error) {
            console.error('Failed to generate summary', error);
        }
    };

    return (
        <div>

            {summary ?  
            <>
            <h3>Summary</h3> 
            <p>{summary}</p> 
            </>
            : null}
        </div>
    );
}

export default Summary;
 