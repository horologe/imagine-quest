import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    ButtonBase,
    Stack,
    TextField,
    Grid,
    Typography,
} from "@mui/material"; // TextFieldコンポーネントをインポートする
import { getAiMessage, jp2en, generateImage, chatGPT } from "../lib/api";
import * as OpenAIEnv from "../lib/apienv";
import { createTheme, ThemeProvider } from "@mui/material";
import { PlayCharacterContext } from "../App";
import * as photos from "../screenPicture";
import { ImageToButton } from "./ImageToButton";
import { DecideButton } from "./buttons";

const theme = createTheme({
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    // ルート要素のスタイル
                    borderWidth: "3px",
                    color: "white",
                    borderColor: "white",
                },
                input: {
                    fontWeight: "bold",
                    borderWidth: "3px",
                    color: "white",
                    borderColor: "white",
                    // 入力要素のスタイル
                    "&:hover": {
                        borderColor: "#4DC2B1", // カーソルが上にあるときの枠線の色を #4DC2B1 に設定
                    },
                },
                notchedOutline: {
                    // 枠線要素のスタイル
                    borderWidth: "3px", // 枠線の太さを3pxにする
                    color: "white",
                    borderColor: "white",
                    "&:hover": {
                        borderColor: "#4DC2B1", // カーソルが上にあるときの枠線の色を #4DC2B1 に設定
                    },
                },
            },
        },
    },
});

function PlayerChoice() {
    const [isChosen, setIsChosen] = useState<boolean>(false);
    const [selected, setSelected] = useState<number[][]>(
        Array.from({ length: 7 }, () => [])
    );
    const choiceRef = useRef<string[]>([]); // 選択されたテキストを保持する参照（配列）
    const [choiceIndex, setChoiceIndex] = useState<number>(0); // ボタンのテキストのインデックスを管理するステート
    const [inputText, setInputText] = useState<string>(""); // TextFieldの値を管理するステート
    const { PlayCharacterSaveText, setPlayCharacterSaveText } =
        useContext(PlayCharacterContext);
    const navigate = useNavigate() as (path: string) => void;
    const home = () => {
        navigate("/");
    };
    const choicesBoxStyle1 = {
        color: "white",
        fontSize: "30px",
    };
    const choicesBoxStyle2 = {
        color: "#B3B3B3",
        fontSize: "30px",
    };
    const choices = [
        ["男(成人)", "女(成人)", "男の子", "女の子"], // ボタンのテキストを二次元配列で管理する
        ["金髪", "茶髪", "黒髪", "青髪"],
        ["ボブ", "ショート", "ロング", "ウルフカット", "ストレート"],
        ["黒色", "茶色", "青色", "赤色", "黄色"],
        ["幼い目", "ツンデレ目", "凛とした目", "猫目"],
        [
            "明るい",
            "バカ",
            "インテリ",
            "ツンデレ",
            "クーデレ",
            "冷酷",
            "天才",
            "社交的",
            "積極的",
        ],
        ["騎士", "戦士", "探検家", "作家", "魔法使い"],
    ];
    const texts = [
        ["a man", "a woman", "a boy", "a girl"],
        ["blond hair", "light brown hair", "black hair", "blue hair"],
        ["bob hair", "short hair", "long hair", "wolf cut hair", "straight hair"],
        ["black eye", "blown eye", "blue eye", "red eye", "yellow eye"],
        ["young eyes", "tsundere eyes", "dignified eyes", "cat eyes"],
        [
            "bright",
            "stupid",
            "intelligent",
            "tsundere",
            "Kuudere",
            "ruthless",
            "genius",
            "Sociable",
            "positive"
        ],
        ["knight", "warrior", "explorer", "writer", "wizard"],
    ]; // 参照にセットするテキストを英語で管理する
    const features = ["性別", "髪色", "髪型", "目の色", "目の形", "性格", "職業"];
    const handleClick = (choiceIndex: number, index: number) => {
        // ボタンがクリックされたときの処理
        const updatedSelected = [...selected];

        if (updatedSelected[choiceIndex].includes(index)) {
            // 選択されているボタンと同じボタンがクリックされたら
            updatedSelected[choiceIndex] = updatedSelected[choiceIndex].filter(
                (i) => i !== index
            ); // 選択を解除する（配列から削除する）
            choiceRef.current = choiceRef.current.filter(
                (c) => c !== texts[choiceIndex][index]
            ); // 参照もクリアする（配列から削除する）
        } else {
            // 選択されていないボタンがクリックされたら
            updatedSelected[choiceIndex] = [...updatedSelected[choiceIndex], index]; // 選択状態を更新する（配列に追加する）
            choiceRef.current = [...choiceRef.current, texts[choiceIndex][index]]; // 参照にテキストをセットする（配列に追加する）
        }

        setSelected(updatedSelected);
    };

    const handleFeatureClick = (index: number) => {
        setIsChosen(true);
        setChoiceIndex(index);
    };
    function clickReset() {
        choiceRef.current = [];

        // selectedを全て空の配列にする
        const updatedSelected = selected.map(() => []);
        setSelected(updatedSelected);
    }
    function clickAdd() {
        const newText = inputText;
        choiceRef.current = [...choiceRef.current, newText];
        setInputText("");
    }
    async function AIbuttonClick() {
        const newInputText = inputText;
        console.log("AIボタンクリックされたよ!!")
        const AIMessage = (await chatGPT(OpenAIEnv.CHARAMAKING_SYSTEM_PROMPT, "", newInputText));
        if (AIMessage != undefined) {
            const newText = JSON.stringify(AIMessage)
            choiceRef.current = [...choiceRef.current, newText];
        }
        setInputText("");
    }
    function decide() {
        const allTexts = choiceRef.current.join(",");
        setPlayCharacterSaveText(allTexts);
        navigate("/CharacterMaking");
        setIsChosen(false);
    }
    return (
        <Stack
            direction="column"
            spacing={5}
            sx={{
                width: "100vw",
                height: "100vh",
                backgroundColor: "#1a1a1a",
            }}
        >
            <Box
                sx={{
                    width: "100vw",
                    height: "70px",
                    backgroundColor: "#333333",
                    paddingTop: "8px",
                    paddingLeft: "25px",
                }}
            >
                <Stack direction={"row"} spacing={3}>
                    <ImageToButton
                        src={photos.back}
                        alt={"home"}
                        onClick={home}
                        height={60}
                        width={60}
                    />
                    <Box fontSize={30} paddingTop={0.8}>
                        キャラ作成
                    </Box>
                </Stack>
            </Box>

            <Stack direction={"row"} spacing={"0px"}>
                <Stack direction={"column"} spacing={"10px"}>
                    {features.map((feature, index) => {
                        // 条件に基づいて <Box> 要素を生成するかどうかを決定
                        const shouldRenderBox = feature === features[choiceIndex];

                        return (
                            <Box key={index}>
                                <Stack direction={"row"}>
                                    <Button
                                        sx={{
                                            ...choicesBoxStyle2,
                                            color: shouldRenderBox ? "#4DC2B1" : choicesBoxStyle2,
                                            fontSize: shouldRenderBox ? "38px" : "30px",
                                            textAlign: "center",
                                        }}
                                        onClick={() => handleFeatureClick(index)}
                                    >
                                        {feature}
                                    </Button>
                                    {shouldRenderBox && (
                                        <Box marginTop={1.5}>
                                            {" "}
                                            <img src={photos.left} alt={"left"} width={"25"} />
                                        </Box>
                                    )}
                                </Stack>
                            </Box>
                        );
                    })}
                </Stack>

                <Stack direction={"column"} spacing={"30px"}>
                    <Box
                        width={800}
                        height={500}
                        sx={{ border: "2px solid #666666", padding: "16px" }}
                    >
                        <Grid container spacing={5}>
                            {" "}
                            {/* Gridコンポーネントをcontainerとして追加する */}
                            {choices[choiceIndex].map((choice, index) => (
                                // ボタンをマップで生成する
                                <Grid item xs={4}>
                                    {" "}
                                    {/* Gridコンポーネントをitemとして追加し、xsプロップスで幅を指定する */}
                                    <Button
                                        key={index}
                                        sx={{
                                            ...choicesBoxStyle1,
                                            background: selected[choiceIndex].includes(index)
                                                ? "#4DC2B1"
                                                : "#666666", // 選択されているボタンだけ青色にする
                                            textAlign: "center",
                                            width: "100%",
                                        }}
                                        onClick={() => handleClick(choiceIndex, index)} // クリックイベントを設定する
                                    >
                                        {choice}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                        <Stack direction={"row"} marginTop={2}>
                            <Box
                                sx={{ ...choicesBoxStyle1, paddingTop: "30px", width: "200px" }}
                            >
                                自由記述
                            </Box>
                            <ThemeProvider theme={theme}>
                                <TextField
                                    id="outlined-basic"
                                    variant="outlined"
                                    label=""
                                    sx={{ mt: 3, width: "100%" }}
                                    InputProps={{
                                        style: {
                                            color: "white",
                                            borderWidth: "5px",
                                            borderColor: "white",
                                        },
                                    }}
                                    inputProps={{
                                        style: {
                                            color: "white",
                                            borderWidth: "5px",
                                        },
                                    }}
                                    value={inputText} // TextFieldの値をステートと連動させる
                                    onChange={(e) => setInputText(e.target.value)} // TextFieldの値が変わったときにステートを更新する
                                />
                            </ThemeProvider>
                            <ImageToButton
                                src={photos.back}
                                alt={"home"}
                                onClick={clickReset}
                                height={60}
                                width={60}
                            />
                            <ImageToButton
                                src={photos.btn2}
                                alt={"文字を加える"}
                                onClick={clickAdd}
                                height={60}
                                width={60}
                            />
                            <ImageToButton
                                src={photos.btn3}
                                alt={"AI生成ボタン"}
                                onClick={AIbuttonClick}
                                height={60}
                                width={60}
                            />
                        </Stack>
                    </Box>
                    <div>{choiceRef.current.join(", ")}</div>
                </Stack>
                <Box width={50}></Box>
                <Stack>
                    <Box height={434}></Box>
                    <Button
                        sx={{
                            ...choicesBoxStyle2,
                            background: "#FFFFFF",
                            textAlign: "center",
                            width: "250px",
                            height: "100px",
                            fontSize: "30px",
                            color: "#4DC2B1",
                        }}
                        onClick={() => decide()} // クリックイベントを設定する
                    >
                        これで行く！
                    </Button>
                </Stack>
            </Stack>
            <Stack></Stack>
            <Stack></Stack>
        </Stack>
    );
}

export default PlayerChoice;
