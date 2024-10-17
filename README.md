**STUDEA**

**Component Breakdown**
Frontend (React)
-Scenario.js: This component will display a dynamically generated learning scenario in Spanish. It will fetch the scenario from the backend and render it on the screen.

-Quiz.js: After the scenario is displayed, this component will display timed questions based on the scenario. Users must respond in Spanish, and their answers will be evaluated using AI.

--Summary.js: This component shows the analysis of the quiz results, giving feedback on what the user needs to improve based on their performance. The analysis will come from Azure OpenAI.

TranslateButton.js: Optional button that allows users to manually translate words or sentences from Spanish to English using Azure Cognitive Services (Translator).

Backend (Node.js/Express)
aiController.js: Handles communication with Azure OpenAI to generate learning scenarios and analyze user quiz responses.

translateController.js: Handles translation between English and Spanish using Azure Translator API.

aiRoutes.js: The Express routes for making calls to the AI-related features, like scenario generation and feedback analysis.

translateRoutes.js: Routes for translation requests to and from Azure Translator.

**Azure Services Used**
Azure OpenAI:

Purpose: Generate Spanish learning scenarios and analyze user quiz responses.
APIs:
Chat Completion API: Generates text-based scenarios.
Text Completion API: Evaluates user responses and gives feedback on areas to improve.
Azure Cognitive Services (Translator):

Purpose: Translate content between English and Spanish. This service can be used for translating prompts and responses during the quiz.
APIs:
Translator Text API: Translates text from English to Spanish or vice versa.
