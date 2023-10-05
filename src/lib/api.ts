
import { ChatCompletionFunctions, Configuration, CreateChatCompletionResponse, OpenAIApi } from "openai";
import { ChatCompletionRequestMessage } from "openai/api";
import * as OpenAIEnv from "./apienv";

const configuration = new Configuration({ apiKey: OpenAIEnv.API_KEY });
const openai = new OpenAIApi(configuration);

export async function getAiMessage(prompt: Array<ChatCompletionRequestMessage>, func: ChatCompletionFunctions) {
    /*
    const completion = (await openai?.createChatCompletion({
        model: OpenAIEnv.MODEL,
        messages: prompt,
        max_tokens: 1024,
    })).data.choices[0].message.content;
    return completion;
    */
    const completion = (await openai?.createChatCompletion({
        model: OpenAIEnv.MODEL,
        messages: prompt,
        functions: [func],
        function_call: "auto"
    }));
    return completion;
}

export async function getStreamingAiMessage(prompt: Array<ChatCompletionRequestMessage>) {
    // @ts-ignore
    return openai?.createChatCompletion({
        model: OpenAIEnv.MODEL,
        messages: prompt,
        max_tokens: 2048,
        stream: true
    }, { responseType: "stream" });
}

export async function chatGPT(systemText: string, assistantText: string, userText: string) {

    const completion = await openai.createChatCompletion({
        model: OpenAIEnv.MODEL, // string;
        messages: [
            {
                role: "user", // "user" | "assistant" | "system"
                content: userText
            },
            {
                role: "assistant",
                content: assistantText
            },
            {
                role: "system",
                content: systemText
            }

        ],
    });
    if (completion.data.choices[0].message != undefined) {
        return completion.data.choices[0].message.content;
    }
}



export async function jp2en(str: string) {
    const options = {
        method: 'POST',
        body: new URLSearchParams({
            target_lang: 'EN',
            text: str,
            auth_key: process.env.REACT_APP_DEEPL_TOKEN as string
        })
    };

    return fetch('https://api-free.deepl.com/v2/translate', options)
        .then(async r => JSON.parse(await r.text()).translations[0].text as string)
}

export async function generateImage(str: string, width: number, height: number): Promise<string> {
    console.log("[generateImage]", str)
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    // 越野研究室のWSのip
    return fetch("http://100.121.222.4/?width=" + width + "&height=" + height + "&prompt=" + str, { method: "GET", headers, mode: "cors" }).then(res => res.text())
}
