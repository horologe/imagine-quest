import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, TextField, Grid } from "@mui/material";
import { chatGPT } from "../lib/api";
import * as OpenAIEnv from "../lib/apienv";
import { createTheme, ThemeProvider } from "@mui/material";
import { PlayCharacterContext } from "../App";
import * as photos from "../screenPicture";
import { ImageToButton } from "./ui/ImageToButton";
import { DecideButton } from "./ui/buttons";
import { MiniButton } from "./ui/buttons";
import { NomalHeader } from "./ui/headers";
import CircularProgress from "@mui/material/CircularProgress";

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderWidth: "3px",
          color: "white",
          borderColor: "white",
        },
        input: {
          fontWeight: "bold",
          borderWidth: "3px",
          color: "white",
          borderColor: "white",
          "&:hover": {
            borderColor: "#4DC2B1",
          },
        },
        notchedOutline: {
          borderWidth: "3px",
          color: "white",
          borderColor: "white",
          "&:hover": {
            borderColor: "#4DC2B1",
          },
        },
      },
    },
  },
});

function PlayerChoice() {
  const [isLoading, setIsLoading] = useState(false);
  const [isChosen, setIsChosen] = useState<boolean>(false);
  const [selected, setSelected] = useState<number[][]>(
    Array.from({ length: 8 }, () => [])
  );
  const choiceRef = useRef<string[]>([]);
  const [choiceIndex, setChoiceIndex] = useState<number>(0);
  const [inputText, setInputText] = useState<string>("");
  const [inputTextEng, setInputTextEng] = useState<string>("");
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
    ["男(成人)", "女(成人)", "男の子", "女の子"],
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
    ["天使", "妖精", "悪魔"],
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
      "positive",
    ],
    ["knight", "warrior", "explorer", "writer", "wizard"],
    ["angel", "fairy", "devil"],
  ]; // 参照にセットするテキストを英語で管理する
  const features = [
    "性別",
    "髪色",
    "髪型",
    "目の色",
    "目の形",
    "性格",
    "職業",
    "その他",
  ];
  const example = [
    "elderly woman",
    "white hair",
    "semi long",
    "pink eye",
    "drooping eyes",
    "funny",
    "programmer",
  ];
  const handleClick = (choiceIndex: number, index: number) => {
    // ボタンがクリックされたときの処理
    const updatedSelected = [...selected];

    if (updatedSelected[choiceIndex].includes(index)) {
      updatedSelected[choiceIndex] = updatedSelected[choiceIndex].filter(
        (i) => i !== index
      );
      choiceRef.current = choiceRef.current.filter(
        (c) => c !== texts[choiceIndex][index]
      );
    } else {
      updatedSelected[choiceIndex] = [...updatedSelected[choiceIndex], index];
      choiceRef.current = [...choiceRef.current, texts[choiceIndex][index]];
    }

    setSelected(updatedSelected);
  };

  const handleFeatureClick = (index: number) => {
    setIsChosen(true);
    setChoiceIndex(index);
    clearTextField();
  };

  function clickReset() {
    choiceRef.current = [];
    const updatedSelected = selected.map(() => []);
    setSelected(updatedSelected);
  }
  const clearTextField = () => {
    setInputText("");
    setInputTextEng("");
  };
  function clickAdd() {
    const newText = inputTextEng;
    choiceRef.current = [...choiceRef.current, newText];
    setInputTextEng("");
  }
  async function AIbuttonClick() {
    const newInputText = inputText;
    console.log("AIボタンクリックされたよ!!");
    setIsLoading(true);
    const AIMessage = await chatGPT(
      OpenAIEnv.CHARAMAKING_SYSTEM_PROMPT,
      "",
      newInputText
    );
    if (AIMessage != undefined) {
      const newText = JSON.stringify(AIMessage);
      choiceRef.current = [...choiceRef.current, newText];
      setIsLoading(false);
    }
    setInputText("");
  }
  function decide() {
    console.log(choiceRef);
    const allTexts = choiceRef.current.join(",");
    console.log(allTexts);
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
      <NomalHeader navigateTo={home} pageName="キャラ作成" />

      <Stack direction={"row"} spacing={"0px"}>
        <Stack direction={"column"}>
          {features.map((feature, index) => {
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
                    <Box marginTop={1.4}>
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
            height={480}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #666666",
              pt: "16px",
              pb: "16px",
            }}
          >
            {isLoading ? (
              <CircularProgress />
            ) : (
              <>
                <Box
                  width={800}
                  height={480}
                  sx={{ border: "2px solid #666666", padding: "16px" }}
                >
                  <Grid container spacing={5}>
                    {choices[choiceIndex].map((choice, index) => (
                      <Grid item xs={4}>
                        <Button
                          key={index}
                          sx={{
                            ...choicesBoxStyle1,
                            background: selected[choiceIndex].includes(index)
                              ? "#4DC2B1"
                              : "#666666",
                            textAlign: "center",
                            width: "100%",
                            "&:hover": {
                              bgcolor: selected[choiceIndex].includes(index)
                                ? "#4DC2B1"
                                : "#666666",
                            },
                          }}
                          onClick={() => handleClick(choiceIndex, index)}
                        >
                          {choice}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                  <Stack direction={"row"} marginTop={2} spacing={2}>
                    <ThemeProvider theme={theme}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={
                          "入力された文字がそのまま追加されます ※英語で書いてください。 例：" +
                          example[choiceIndex]
                        }
                        sx={{ mt: 3, width: "100%" }}
                        InputLabelProps={{ style: { color: "#bdc6c9" } }}
                        InputProps={{
                          style: {
                            color: "white",
                            borderWidth: "5px",
                            borderColor: "white",
                          },
                        }}
                        value={inputTextEng}
                        onChange={(e) => setInputTextEng(e.target.value)}
                      />
                    </ThemeProvider>
                    <MiniButton
                      bgColor="#A8BF54"
                      tag="追加"
                      onClickHandler={() => clickAdd()}
                    />
                  </Stack>
                  <Stack direction={"row"} marginTop={2} spacing={2}>
                    <ThemeProvider theme={theme}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={
                          "入力された文字をAIが画像生成用に改善してくれます。 例：" +
                          example[choiceIndex]
                        }
                        sx={{ mt: 3, width: "100%" }}
                        InputLabelProps={{ style: { color: "#bdc6c9" } }}
                        InputProps={{
                          style: {
                            color: "white",
                            borderWidth: "5px",
                            borderColor: "white",
                          },
                        }}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                      />
                    </ThemeProvider>
                    <MiniButton
                      bgColor="#5AC4CC"
                      tag="AI生成"
                      onClickHandler={() => AIbuttonClick()}
                    />
                  </Stack>
                </Box>
              </>
            )}
          </Box>
          <Box width={800}>
            <Stack direction={"row"} spacing={5}>
              <Stack>
                <Box fontSize={30} width={400}>
                  現在の選択一覧↓↓
                </Box>
                <Box fontSize={20}>{choiceRef.current.join(", ")}</Box>
              </Stack>

              <Box
                bgcolor={"#4DC2B1"}
                padding={2}
                width={65}
                height={60}
                borderRadius={"10%"}
              >
                <ImageToButton
                  src={photos.reload}
                  alt={"home"}
                  onClick={clickReset}
                  height={50}
                  width={50}
                />
                リセット
              </Box>
              <Box>
                <DecideButton
                  tag="生成してみる!"
                  onClickHandler={() => decide()}
                />
              </Box>
            </Stack>
          </Box>
        </Stack>
        <Box width={50} />
        <Stack justifyContent={"start"}>
          <Box height={435} />
        </Stack>
      </Stack>
    </Stack>
  );
}

export default PlayerChoice;
