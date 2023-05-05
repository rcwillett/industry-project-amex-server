import { Configuration, OpenAIApi } from 'openai';
import qa_embed_json from '../data/data.json' assert { type: "json" };

// Function to get cosine simliarity between two vectors
function getCosineSimilarity (a, b) {
    // Instantiate dot sum
    let dot_sum = 0;
    // Find min length as other vector will be 0 padded
    const maxLength = Math.min(a.length, b.length);
    for (let i = 0; i < maxLength; i++) {
        // Add dot of vector index
        dot_sum += (a[i] * b[i]);
    }
    // Instantiate a manitude
    let a_abs_sum = 0;
    for (let i of a) {
        // Add square of a vector index to magnitude sum
        a_abs_sum += Math.pow(i, 2);
    }
    // Instantiate b manitude
    let b_abs_sum = 0;
    for (let i of b) {
        // Add square of b vector index to magnitude sum
        b_abs_sum += Math.pow(i, 2);
    }
    // Return Cosine Similarity
    return dot_sum / (Math.sqrt(a_abs_sum) * Math.sqrt(b_abs_sum));
};

// Instantiation of OpenAI service
class OpenAIService {
    constructor() {
        // Set up OpenAI config
        const config = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        // Instantiate OpenAI SDK
        this.openAIApi = new OpenAIApi(config);
    }

    getEmbedding = async ({ input }) => {
        // Get embedding for input using OpenAI api
        const { data } = await this.openAIApi.createEmbedding({
            model: 'text-embedding-ada-002',
            input,
        });
        return data['data'][0]['embedding'];
    };

    getClosestQAPair = async ({ question }) => {
        // Get question embedding for user question
        const questionEmbed = await this.getEmbedding({
            input: question,
        });
        // Create copy of prompt embedding JSON
        const qa_similarity_json = JSON.parse(JSON.stringify(qa_embed_json));
        // Create array for json
        const qa_best_match = qa_similarity_json['content'];
        // Get cosine similarity for each prompt
        for (const qa of qa_best_match) {
            qa['cos_sim'] = getCosineSimilarity(qa['q_embedding'], questionEmbed);
        }
        // Sort prompts + responses by cosine similarity
        qa_best_match.sort((a, b) => b['cos_sim'] - a['cos_sim']);
        // Return best match
        return qa_best_match[0];
    };

    getChatCompletion = async ({ messages }) => {
        // Send request to OpenAI gpt 3.5 turbo to send next message in chat
        const { data } = await this.openAIApi.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages,
        });
        return data['choices'][0]['message'];
    };
}

export { OpenAIService };