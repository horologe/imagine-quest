import './style.css'
import {Configuration, OpenAIApi} from "openai";
import {ChatCompletionRequestMessage} from "openai/api";

const ChatGPT_TOKEN = "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";
const result = document.querySelector("#result") as HTMLDivElement;
const background = document.querySelector("#background") as HTMLImageElement;

const buttons = document.querySelector("#buttons") as HTMLButtonElement;

const defaultPrompt = `
あなたは熟練のクトゥルフ神話TRPGのゲームマスターです。 セッションを通してゲームブック調の口調で話を進めてください。 セッションは非常に入り組んだ構造のダンジョン内で行われます。 物語はダンジョンの入り口から始まります。 ダンジョンには、凶暴なモンスターやトラップがあります。 ダンジョンの構造は、通路、広間、部屋、小部屋、などがあります。 ダンジョンは、縦方向にも入り組んだ構造で、罠やトラップがたくさん仕掛けられています。 ダンジョンの奥深くに目的のアイテムがあります。 目的のアイテムに到達するには、数多くの仕掛けや謎解き、ダンジョンの構造や試練を用意してください。 ※簡単に目的のアイテムには到達できないよう仕組みです。 目的のアイテムは凶暴なモンスターが守っています。 モンスターが登場した場合は、モンスター名と容姿や特徴、装備、動作や強さの分類も含めて詳しく話してください。 ※モンスターの名前は必ず表示してください。 モンスターは、クトゥルフ神話TRPGのルールブックのステータスを参考に、強、普通、弱に分類してください。 プレイヤーのキャラクターのステータスは、普通に分類されます。 戦闘が終わるとキャラクターのステータスは、回復します。 ステータスの強は3回攻撃しないと倒れません ステータスの普通は2回攻撃で倒せます。 ステータスの弱は1回攻撃で倒れます。 キャラクターをロストしたら、「あなたの旅はここで幕をとじた」と表示して締めくくってください。 ※ロストしても、ひとつ前の選択肢に戻ることを宣言すると、戻ることが出来る。 ※もし〜ならばなどの、想定はしないでください。 ※ヒントは提示しないでください。 ※各文3文に留めてください ※選択肢の選択は、必ず私が選択します。 ゲームが始まったら、冒険のタイトルをつけてください。 タイトルのあと、冒険の舞台の歴史を大陸の名前や国や土地の名前を含めて話してください。 そして、今回の依頼内容、冒険の経緯、今の状況について目的のアイテム名とその効果を含めて語ってください。
`

const outputJson = `
選択肢3つ及び現在の背景描写だけを下記のようなJson形式で出力してください
 例
 {
   “background”:扉の前に立ち、周囲を見渡すと、風がざわめく樹々や古代の遺跡が広がっています。空気は静かで重苦しく、遠くで鳥の鳴き声が聞こえることもあります。扉は厚い鉄の装飾が施されており、そこには古代の神々を讃えるかのような文様が刻まれています“,
   ”choices“:[扉を力ずくで開ける”, "扉の文様を調べる”, "扉の文様を調べる”]
 }
 `;


const configuration = new Configuration({apiKey: ChatGPT_TOKEN});
const openai = new OpenAIApi(configuration);

const promptHistory:  Array<ChatCompletionRequestMessage> = [
  {role: "system", content: defaultPrompt},
  // {role: "system", content: outputJson},
  // {role: "user", content: "選択肢を提示する前に、必ず現在のダンジョンの様子を詳しく描画してください。また、詳しい様子を描画する際には以下のように{ }で囲って描画してください。\n" +
  //       "　例：{床には不規則な大理石のタイルが敷かれ、天井は高く突き抜けている。部屋は暗く、わずかな光が小さな穴から漏れている。壁は厚く、石でできており、岩盤を掘り進めたような風合いがある。中央には一つの大きな石柱があり、光がそこから漏れ出しているように見える。部屋の隅には、古代の書物が積まれた大きな棚が置かれている。扉はなく、部屋の奥には暗い通路が続いている。部屋には何かが潜んでいるような気配があり、神秘的な雰囲気が漂っている}など。"}
];

(function init() {
  const gameStart = document.createElement("button");
  gameStart.innerHTML = "ゲームスタート"
  gameStart.onclick = clickButton
  buttons.append(gameStart)
}())

function clearButtons() {
  buttons.innerHTML = "";
}

function printAiMsg(str: string) {
  const p = document.createElement("p");
  p.innerText = str;
  p.className = "message ai-message";
  result.append(p);
}
function printUserMsg(str: string) {
  const p = document.createElement("p");
  p.innerText = str;
  p.className = "message user-message";
  result.append(p);
}

async function clickButton(e: Event) {
  const prompt = (e.target as HTMLButtonElement).innerHTML;
  promptHistory.push({role: "user", content: prompt})
  clearButtons();
  printUserMsg(prompt);

  // @ts-ignore
  const completion = (await openai?.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: promptHistory,
  })).data.choices[0].message.content as string;

  promptHistory.push({role: "assistant", content: completion})

  printAiMsg(completion)

  const nextButton = document.createElement("button");
  nextButton.innerHTML = "次へ";
  nextButton.onclick = async () => {
    clearButtons();
    // @ts-ignore
    const stringChoices = (await openai?.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [...promptHistory, {role: "system", content: outputJson}],
    })).data.choices[0].message.content;
    console.log({stringChoices})

    const choices: {background: string;choices: string[]} = JSON.parse(stringChoices as string);
    for (const choice of choices.choices) {
      const choiceButton = document.createElement("button");
      choiceButton.innerHTML = choice;
      choiceButton.onclick = clickButton
      buttons.append(choiceButton)
    }

    (async function () {
      const img = document.createElement("img");
      img.className = "message ai-message"
      result.append(img);

      img.alt = "[画像を生成中(プロンプト:" + choices.background + ")]";
      const en = await jp2en(choices.background)

      img.alt = "[画像を生成中(プロンプト:" + en + ")]";
      try {
        img.src = await generateImage(en);
        img.alt = "[" + en + "]"
      } catch (e) {
        img.alt = "[画像の生成に失敗]";
        console.log(e);
      }
    })().then(() => console.log("finished generating image"))
  }
  buttons.append(nextButton);
}

// Stable Diffusionで画像を生成する
async function generateImage(str: string): Promise<string> {
  console.log("[generateImage]", str)
  const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
  // #########
  // 下のコードはなぜか学校のwi-fiでは実行できない
  // #########
  const url = "http://5722-35-247-167-70.ngrok-free.app/"; // URL指定

  return fetch(url + "?prompt=" + str, {method:"POST", headers}).then(res => res.text())
}

// 日本語→英語
async function jp2en(str: string) {
  const options = {
    method: 'POST',
    body: new URLSearchParams({
      target_lang: 'EN',
      text: str,
      auth_key: '1ff102e8-0a69-2ea2-ad48-70bdf48679df:fx'
    })
  };

  return fetch('https://api-free.deepl.com/v2/translate', options)
      .then(async r => JSON.parse(await r.text()).translations[0].text as string)
}
