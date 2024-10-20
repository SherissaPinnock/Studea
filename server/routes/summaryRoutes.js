const express = require("express");
const { Configuration, OpenAIApi } = require("azure-openai");

const router = express.Router();

const openai = new OpenAIApi(
    new Configuration({
        azure: {
            apiKey: `${process.env.API_KEY}`, 
            endpoint: `${process.env.ENDPOINT}`,
            deploymentName: "gpt-4", 
        }
    })
);


//Summary Route
router.post('/api/summary', async (req, res) => {
    const conversationHistory = req.body.conversationHistory;

    if (!conversationHistory || conversationHistory.length === 0) {
        return res.status(400).json({ error: "Conversation history is required" });
    }

    try {
        // Create a summary based on the conversation history
        const response = await openai.createChatCompletion({
            messages: [
                { role: "system", content: `Based on this conversation, please offer personalized feedback to the user in English.
            Your feedback should be friendly and helpful, providing recommendations in a conversational tone. 
            Focus on how the user can improve their Spanish language interactions. 
            Suggestions should include politeness, clarity, and formal or casual language conventions.` },
                { role: "user", content: `Here is the conversation history: ${JSON.stringify(conversationHistory)}.` }
            ]
        });

        const summary = response.data.choices[0].message.content;
        res.json({ summary });
    } catch (error) {
        console.error('Error generating summary:', error.message);
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;
