/* <const.tsの説明> */
/*
SYSTEM_PROMPTはゲームマスターの役割を担ってほしいこと,どんな舞台のゲームにしてほしいか,ゲームのルールと,死んだ時とモンスターの処理だけを書いてます。
下にコメントアウトしてる奴なんだけどmessages[]の下にfunction[]を書いたものです。
このfunction[]の使い方なんだけど
requiredに入っている要素をchatGPT側で受け取ったと判断したらそのrequiredが入ってる関数だけを動かすって仕組みらしいです。
なのでGAME STARTと言ったらfunction Story Prologue descriptionが動いて一番最初のプロローグの描写,
選択肢と背景描写を求めるようなプロンプトが来たらgameFunctionが動いて選択肢と背景描写を出力。みたいな動きをしてほしい願いを込めて書いたけど
ちゃんと動くかは試さないとわからん
選択肢と背景描写を求めるプロンプトはプロローグ→一番最初のゲーム画面,と
ゲーム画面→次のゲーム画面(ゲームの進行,場面切り替え)
で変えた方がいいかなあと思って
FIRST_CONTACT_PROMPTにプロローグ→一番最初のゲーム画面のプロンプト
PLAYING_CONTANCT_PROMPTにゲーム画面→次のゲーム画面(ゲームの進行,場面切り替え)のプロンプト入れてます。(選択肢の入る場所は他と混同しないよう『選択肢変数』って書いてます。恐らく自分で作った選択肢以外は選択肢1,選択肢2で進めてくれるはず。)
*/
import { ChatCompletionFunctions } from "openai/api"


/* <ゲームの進行の仕方のお願い。> */
/*
上はこのコードの説明なんだけど一応どうゲーム画面が動くように作ってほしいか書いときます。
Home.tsx：STARTを押したらrole:user content:GAME STARTを送る。
About.tsx：「次へ」のボタンを押したら role:user content:FIRST_CONTACT_PROMPTを送る。
Contact.tsx:選択肢を選んだ後「はい」のボタンが押されたら role:user content:PLAYING_CONTACT_PROMPTを送る。
ContactAlpha.tsx:Contact.tsx同様。
Contact.tsxとContactAlpha.tsxで選択肢と背景描写、そんでStableDiffusionまでちゃんと動くかやってみてほしい。お願いします。
*/
export var gameType = 0;
export var genre = 0;
export var PLAYCHARACTER_FUTURE_PROMPT = ""
export const CHARAMAKING_SYSTEM_PROMPT = "You are a professional screenwriter and an excellent English translator. No matter what character traits come in Japanese, please list in detail in English words the traits of the character that can be read visually. *CAUTION*  Please only use English words that describe the character's mood and characteristics. ***EXAMPLE TEXT*** she has a gentle smile that radiates warmth and compassion, and eyes that sparkle with wisdom and joy.she wears a simple robe that reflects humility and detachment from worldly pleasures, and carries a wooden staff that symbolizes the journey of enlightenment."
export function gameChoice(main: number, sub: number) {
    gameType = main;
    genre = sub;
    if (gameType == 1 && genre == 1) {
        gameType = 0;
    }
    setPrompt()
}

var GAME_KINDS = "CthulhuMythos TRPG game"
var stage = "the Dungeon"
var MASTER_SYSTEM = () => "skilled" + GAME_KINDS;
var STAGE_INFORMATION = "The session takes place in a dungeon with a very intricate structure. The story begins at the entrance to the dungeon.The dungeon is vertically intricate and filled with traps and snares. The objective item is located deep in the dungeon. To reach the desired item, you must prepare for numerous tricks, riddles, dungeon structures and trials. The system is designed in such a way that the objective item cannot be reached easily."
var GAME_RULES = "*Please be flexible if you are presented with a choice number or choice that does not apply to you. *Please do not output choices until I need them. *Please do not get to the desired item until I have presented at least 40 choices.`"
var ATTENTION_TEXT = "*Monster names must be indicated. Monsters should be classified as strong, normal, or weak based on their status in the" + GAME_KINDS + "rulebook. The player's character's status will be classified as normal. After the battle, the character's status will be recovered. Strong status requires three attacks to fall down. Normal status requires two attacks to defeat."
var EXAMPLE_TEXT = "You are standing at the entrance of a dungeon. A rusted stone door rises before you. The surroundings are silent, and countless footprints have been left in front of the door. It is clear that these tracks are the traces of those who once challenged the door."
export const SYSTEM_PROMPT = () => `You are a ` + MASTER_SYSTEM() + STAGE_INFORMATION + `
When the character is lost, close with the message "Your journey ends here.
` + ATTENTION_TEXT + GAME_RULES + "Let's game Start"


function setPrompt() {
    switch (gameType) {
        case 0:


            switch (genre) {
                case 0:
                    GAME_KINDS = "CthulhuMythos TRPG game master" + `Please use a gamebook tone throughout the session. `;
                    break;
                case 1:
                    GAME_KINDS = "writer of fantasy stories"
                    STAGE_INFORMATION = "This story is about a traveler, the protagonist, who searches for a legendary item that will help him grow. The story begins in a deep forest. Once you leave the forest, you will find yourself in a world of ruins. In order to escape from this world, or rather, to survive, the protagonist is in pursuit of a certain item.";
                    GAME_RULES = ""
                    stage = "Fantastic apocalypse"
                    ATTENTION_TEXT = "To make the story interesting, you should put special emphasis on the description of the scene."
                    EXAMPLE_TEXT = "The forest was dark and silent. The sun's rays did not reach the forest because they were blocked by thick clouds and tall trees. The forest was cold and damp, and the air was heavy and stifling. There was no sign of life in the forest, no birdsong, no sound of insects, no rustling of the wind. The only sound in the forest was the hum of machinery."
                    break;
                case 2:
                    GAME_KINDS = "writer of fantasy stories"
                    STAGE_INFORMATION = "This story is a world of dragons and magic. The protagonist sets out on a journey to acquire magical powers in order to take revenge on the dragon that destroyed his village. Through the friends and enemies he meets along the way, and through various adventures, the hero learns the secrets of the dragon and his destiny. This story is a tale of courage, friendship, and love.";
                    stage = "Fantastic apocalypse"
                    ATTENTION_TEXT = "You must focus your output on the background description of the protagonist."
                    EXAMPLE_TEXT = "You are on your way to the shelter with the villagers when you see the shadow of a dragon descending from the sky. The dragon kills the village chief before your very eyes and taunts the protagonist, You are the one with magical powers. You are the one with magical powers. You have magical powers, so fight me. I am the king of this world. You are angry and afraid of the dragon, but you can do nothing. The dragon looks down on him and leaves. You hear the chief's last words. You are the one who has the power of magic. You have magical powers, so go to the school of magic. There you will learn magic and face the dragon. You are the chosen one to save this world.You are moved to tears by the chiefs words, but you are determined. You decide to set out on a journey to go to the school of magic, and here your story begins!"
                    break;
            }
            break;
        case 1:
            switch (genre) {
                case 0:
                    GAME_KINDS = "Commanding officer in charge of the pilots of a starship."
                    STAGE_INFORMATION = "You and I, the pilot, are on a spaceship to an unknown planet. The planet is rumored to be a place where the remains of an ancient civilization still remain and where treasures lie. However, we encounter various troubles in space until we arrive at the planet. You must explain the current situation to me, the pilot, accurately in order to break through that space safely.";
                    GAME_RULES = ""
                    stage = "the universe"
                    ATTENTION_TEXT = "I think it would be interesting to create a sense of realism by using not only things that actually exist in the universe, but also fantasy things as trouble. You can use the Milky Way Galaxy, black holes, aliens, or anything else you can think of as a trouble. However, please consider as a pilot a method that you can always get out of."
                    EXAMPLE_TEXT = "The spacecraft plunged into the cloud layer. Immediately, the cockpit windows fogged up white and the radar screen was filled with noise. It was as if we had entered another dimension. Vibrant colors flooded out of the clouds, weaving a fantastic scene. Red, blue, green, and purple lights poured onto the spaceship through the clouds, giving it the feeling of crossing a rainbow bridge."
                    break;
                case 1:
                    GAME_KINDS = "サイバーパンクな世界の世界崩壊。"
                    STAGE_INFORMATION = "";

                    break;
                case 2:
                    break;
            }
            break;
        case 2:

            GAME_KINDS = "Artificial Intelligence for a bird's eye view of human society"
            switch (genre) {
                case 0:
                    STAGE_INFORMATION = "I belong to a company with a lot of work and a very strict attitude of my boss, and you, as an artificial intelligence, are observing how I am managing to survive.I am going through a number of hardships that may cause me to have a mental breakdown, but I am trying my best to survive by making a number of choices. You must describe in detail your current visual situation.";
                    GAME_RULES = ""
                    stage = "the Company Office"
                    ATTENTION_TEXT = "Please do not mention anything outside of the company as this is only my story as I struggle in the company. It starts out with me sitting in my office at work. You are to visually describe the disaster that befalls me. Surviving in this company is not easy."
                    EXAMPLE_TEXT = "You are sitting in your office at work. In front of you are a computer and a telephone. On the computer screen are documents for a project that is about to be due. The phone rings from time to time with requests and complaints from your boss and clients. You are so busy that you feel dizzy.The air in the office is heavy. The air conditioner is out of order; it is hot and stifling. The windows cannot be opened. There are posters on the walls with the company's philosophy and goals, but they are meaningless to you. There are no smiles or laughter in the office. It is not easy to survive in this company."
                    break;
                case 1:
                    break;
                case 2:
                    break;
            }
            break;
        case 3:

            break;
    }
}

export const BACKGROUND_PROMPT = `Detailed description of the player's current location *Please use at least 5 detailed sentences ###example ### ` + EXAMPLE_TEXT
//### example ###The floor is covered with irregular marble tiles and the ceiling is high and piercing. The rooms are dark, with the slightest light leaking through tiny holes. The walls are thick and made of stone, with the texture of excavated bedrock. In the center is a single large stone pillar from which light seems to leak. In the corner of the room is a large shelf stacked with ancient books. There is no door, and a dark passageway leads to the back of the room. There is a sense that something is lurking in the room, and there is a mysterious atmosphere.
export var FIRST_CONTACT_PROMPT = "Please give a background description of where the player is currently located and three options.lang:jp"
export var PLAYING_CONTACT_PROMPT = "I choose " + "『選択肢変数』" + "Please give me the following background description and choices."

export const API_KEY = process.env.REACT_APP_OPENAI_API_KEY
export const Organization_ID = process.env.REACT_APP_OPENAI_ORG_ID
export const MODEL = "gpt-3.5-turbo"; // model name

export type FunctionMessage = {
    role: "function",
    name: string,
    content: string
}
/*
"messages": [
     { "role": "system",
      "content": SYSTEM_PROMPT
    },
  ], */
export const GAME_FUNCTION: ChatCompletionFunctions = {
    name: "gameFunction",
    description: "Function to output the current player's background description and 3 options",
    parameters: {
        type: "object",
        properties: {
            background: {
                type: "string",
                description: BACKGROUND_PROMPT
            },
            choice1: {
                type: "string",
                description: "The first option of where to go and what to do in " + stage,
            },
            choice2: {
                type: "string",
                description: "The second option of where to go and what to do in" + stage,
            },
            choice3: {
                type: "string",
                description: "The third option of where to go and what to do in " + stage,
            },
        },
        required: ["Choice and background description request"]
    }
};

export const STORY_PROLOGUE_DESCRIPTION: ChatCompletionFunctions = {
    name: "Story-Prologue-description",
    description: "Function to output a description of the game when the game is said to start.",
    parameters: {
        type: "object",
        properties: {
            "Story Prologue to the Adventure": {
                type: "string",
                description: "title to the adventure&the history of the setting of the adventure including the names of the continents, countries and lands.Then, tell us about the request, the adventure, and the current situation, including the name of the desired item and its effects.",
            },
        },
        required: ["GameStart"]
    },
};
export const TitleMaking: ChatCompletionFunctions = {
    name: "TitleMaking",
    description: "You are the writer who gives the title to the story. I write the story and you give the title in one word.",
    parameters: {
        type: "object",
        properties: {
            "Title": {
                type: "string",
                description: "the title in one word.in Japanese",
            },
            "Describing_the_scenery_that_represents_the_story": {
                type: "string",
                description: "Please use English words with detailed and specific exaggerated expressions to describe the scenery that fits the title and the story. *Please do not use bullet points.",
            }
        },
        required: []
    },
};
export const PLAYCHARACTER_DETAIL_FUNCTION: ChatCompletionFunctions = {
    name: "playcharacter_detail_function",
    description: "A function that uses English words to describe in detail and exaggerate the appearance of the character represented by the received words. *No bullet points.",
    parameters: {
        type: "object",
        properties: {
            "playcharacter_detail": {
                type: "string",
                description: "A detailed, exaggerated description in English words of the appearance of the character represented by the received word",
            },
        },
        required: ["before_detail_string"]
    },
};
export const PLAYCHARACTER_FUNCTION: ChatCompletionFunctions = {
    name: "playcharacter features output",
    description: "Please output 4 different ones with the characteristics I am looking for that are in line with the characteristics of the character you told me about as an excellent character creator.",
    parameters: {
        type: "object",
        properties: {
            "the characteristics of the character1": {
                type: "string",
                description: "The first feature in line with the character",
            },
            "the characteristics of the character2": {
                type: "string",
                description: "The second feature in line with the character",
            },
            "the characteristics of the character3": {
                type: "string",
                description: "The third feature in line with the character",
            },
            "the characteristics of the character4": {
                type: "string",
                description: "The forth feature in line with the character",
            },
        },
        required: {}
    },
};

