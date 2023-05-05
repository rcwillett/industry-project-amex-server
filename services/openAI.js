import { Configuration, OpenAIApi } from 'openai';
import qa_embed_json from '../data/q_a_embed.json' assert { type: "json" };

function getCosineSimilarity (a, b) {
    let dot_sum = 0;
    const maxLength = Math.min(a.length, b.length);
    for (let i = 0; i < maxLength; i++) {
        dot_sum += (a[i] * b[i]);
    }
    let a_abs_sum = 0;
    for (let i of a) {
        a_abs_sum += Math.pow(i, 2);
    }
    let b_abs_sum = 0;
    for (let i of b) {
        b_abs_sum += Math.pow(i, 2);
    }
    return dot_sum / (Math.sqrt(a_abs_sum) * Math.sqrt(b_abs_sum));
};

class OpenAIService {
    constructor() {
        const config = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.openAIApi = new OpenAIApi(config);
    }


    answerQuestion = async ({ question }) => {
        const { data } = await this.openAIApi.createEmbedding({
            model: 'text-embedding-ada-002',
            input: question,
        });
        const questionEmbed = data['data'][0]['embedding'];
        const qa_similarity_json = JSON.parse(JSON.stringify(qa_embed_json));
        const qa_best_match = qa_similarity_json['content'];
        for (const qa of qa_best_match) {
            qa['cos_sim'] = getCosineSimilarity(qa['q_embedding'], questionEmbed);
        }
        qa_best_match.sort((a, b) => b['cos_sim'] - a['cos_sim']);
        return qa_best_match[0]['completion'];
    };
}

export { OpenAIService };