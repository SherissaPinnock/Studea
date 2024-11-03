const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const scenarioRoutes = require("./routes/scenarioRoutes"); // Adjust the path as needed
//const conversationRoutes = require("./routes/conversationRoutes"); // Import your conversation routes
const summaryRoutes=require("./routes/summaryRoutes");

const api = express();
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());
api.use(cors());

// Use your routes
api.use(scenarioRoutes); // Prefix all scenario routes with /api
api.use(summaryRoutes);

const port = 8080;
api.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
