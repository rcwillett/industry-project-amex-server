import { OpenAIService } from '../services';

class ChatController {
    constructor () {
        this.openAIService = new OpenAIService();
    }

    categorizeChat = () => {
        this.openAIService.categorizeChat();
    }
}

export { ChatController }