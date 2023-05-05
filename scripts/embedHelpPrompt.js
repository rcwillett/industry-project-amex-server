// Script to generate embeddings for prompt of banking_q
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import qaJSON from '../data/help_prompt.json' assert { type: "json" };
import fs from 'fs';

dotenv.config();

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openAIApi = new OpenAIApi(config);

// Create copy of JSON
const embedJSON = JSON.parse(JSON.stringify(qaJSON));

let index = 0;
for (const qa of qaJSON['content']) {
    const { data } = await openAIApi.createEmbedding({
        model: 'text-embedding-ada-002',
        input: qa['prompt'],
    });
    embedJSON['content'][index]['q_embedding'] = data['data'][0]['embedding'];
    index++;
}

fs.writeFileSync('./data/help_prompt_embed.json', JSON.stringify(embedJSON))

console.log(JSON.stringify());
