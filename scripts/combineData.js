// Script to generate embeddings for prompt of banking_q
import fs from 'fs';
import banking_general_q_json from '../data/banking_general_q_embed.json' assert { type: "json" };
import q_a_json from '../data/q_a_embed.json' assert { type: "json" };
import help_prompt_json from '../data/help_prompt_embed.json' assert { type: "json" };

const q_a_array_with_type = q_a_json.content.map((qa) => ({...qa, type: 'common_qa'}));

const combinedData = { content: [] };

combinedData['content'] = [].concat(banking_general_q_json.content).concat(q_a_array_with_type).concat(help_prompt_json.content);

fs.writeFileSync('./data/data.json', JSON.stringify(combinedData));

console.log(JSON.stringify());
