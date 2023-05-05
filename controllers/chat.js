import { AmexService, OpenAIService } from '../services/index.js';

class ChatController {
    constructor () {
        this.openAIService = new OpenAIService();
        this.amexService = new AmexService();
    }

    handleUserInput = async (req, res) => {
        try {
            const { messages } = req.body;
            if (!messages) {
                return res.status(400).send('Error! Missing required body parameters');
            }
            // Remove last user message to provide next prompt
            const lastUserMessage = messages.splice(-1)[0]['content'];
            // Add prompt to set chatbot as 'Amie'
            messages.push({
                "role": "system",
                "content": "You are a chatbot named 'Amie' who is a customer service rep for American Express."
            });
            // Find closest prompt to user prompt
            const closestQAPair = await this.openAIService.getClosestQAPair({ question: lastUserMessage });
            // If cosine similarity of user prompt and pre-generated prompt > 0.75 associate response with prompt
            if (closestQAPair['cos_sim'] >= 0.8) {
                // Handle response for general QA
                if (closestQAPair['type'] === 'common_qa'){
                    return res.status(200).json({
                        role: 'assistant',
                        content: closestQAPair['completion'],
                    });
                // Handle response for when type is API info request
                } else if (closestQAPair['type'] === 'api_info') {
                    let data;
                    // Identify type of question and get relevant info from american express service
                    if (closestQAPair['completion'] === 'banking_summary') {
                        data = this.amexService.getBankingInfo();
                    } else if (closestQAPair['completion'] === 'mortgage_summary') {
                        data = this.amexService.getMortgageInfo();
                    } else if (closestQAPair['completion'] === 'credit_card_summary') {
                        data = this.amexService.getCreditCardInfo();
                    }
                    // Replace previous user prompt with prompt providing data and user question
                    const chatContent = `
                        Use the below banking information to answer the subsequent question.
                        """
                        ${data}
                        """
                        Question: ${lastUserMessage}
                    `;
                    messages.push({
                        role: 'user',
                        content: chatContent,
                    });
                    // Get AI response for new prompt
                    const aiResponse = await this.openAIService.getChatCompletion({
                        messages,
                    });
                    // Send AI response
                    return res.status(200).json(aiResponse);
                // Handle response for when type is help
                } else if (closestQAPair['type'] === 'help') {
                    // Send apology message
                    return res.status(200).json({
                        role: 'assistant',
                        content: closestQAPair['completion']
                    });
                }
            // Handle case where there are no matches
            } else {
                // Create new prompt for Amie to handle
                const prompt = `Provide friendly response to the following message.
                    Message:${lastUserMessage}
                    Then ask if they have any questions about banking.
                `;
                // Add prompt to messages
                messages.push({
                    role: 'user',
                    content: prompt,
                });
                // Get AI response to chat
                const aiResponse = await this.openAIService.getChatCompletion({
                    messages,
                });
                // Send response
                return res.status(200).json(aiResponse);
            }
            // Error to be thrown if no matches
            throw new Error('No matching conditions, unexpected error!')
        } catch (error) {
            console.log(error);
            // 500 Error to send if unexpected error
            return res.status(500).send('Unexpected error, please try again!');
        }
    }
}

export { ChatController };