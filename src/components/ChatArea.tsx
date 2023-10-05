import React, { useState, useEffect } from "react";
import {
    Configuration,
    OpenAIApi,
    ChatCompletionRequestMessage,
} from "openai";
// import generateImage, jp2en など他の関数を別ファイルからインポートする

const ChatGPT_TOKEN = "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";

const configuration = new Configuration({ apiKey: ChatGPT_TOKEN });
const openai = new OpenAIApi(configuration);

// ... 他のコード（defaultPrompt, outputJson, promptHistory など）...

const ChatArea = () => {
    const [messages, setMessages] = useState([]);
    const [choices, setChoices] = useState([]);

    // ... 他のコード（clickButton, clearButtons, printAiMsg, printUserMsg など）...



    return (
        <div>

        </div>
    );
};

export default ChatArea;