
import * as dotenv from 'dotenv';
import express from 'express';
import { OpenAIService } from './services/openAI.js';
const app = express();
dotenv.config();

(async () => {
    const openAIService = new OpenAIService();
    const response = await openAIService.answerQuestion({ question: 'Am I able to make payments online?'});
    console.log(response);
})();

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});