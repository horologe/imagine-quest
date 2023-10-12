//#region import

import React, { useEffect, useState, useContext } from "react";

import "../GameScreen.css";

import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { useDialog } from "../dialog";
import { getAiMessage, jp2en, generateImage } from "../lib/api";
import * as OpenAIEnv from "../lib/apienv";
import * as photos from "../screenPicture";
import { PrologueContext, playCharacterImgContext } from "../App";
import { gameContext } from "../App";
import { base64Context } from "../App";
import { choiceContext } from "../App";
import { IconButton } from "./ui/buttons";

//#endregion
//#region triangle
const trianglePath = "M0 0 L50 25 L0 50 Z";
function TriangleIcon(props: SvgIconProps) {
  return (
    // SvgIconコンポーネントでパスを描画する
    <SvgIcon {...props} viewBox="0 0 50 50">
      <path d={trianglePath} fill="black" stroke="white" strokeWidth="2.5" />
    </SvgIcon>
  );
}

const choicesBoxStyle = {
  mt: 8,
  ml: 7.1,
  width: 250,
  height: 100,
  color: "white",
  background: "black",
  border: 2,
};

//#endregion
type AboutProps = {
  preview: string | null;
  playerName: string | null;
};
function Contact({ preview, playerName }: AboutProps) {
  //#region useState
  const { Dialog, open: openDialog, close: closeDialog } = useDialog();

  const [choices, setChoices] = useState<string[]>([
    "前に進む",
    "上を見上げる",
    "辺りを調べる",
    "(choice4)",
  ]);
  const [content, setContent] = useState<string>(""); //chatGPTから来た背景描写がここに入るんかな?と思ったのでBoxの中に書かれるようにしてます
  const [pictureBase64, setPictureBase64] = useState<string>(""); //ここにpictureBase64のString入れてください
  const [inputText, setInputText] = useState<string>(""); //このinputTextに打ち込まれた文字が入る
  const [choicesNumber, setChoicesNumber] = useState<number>(0);
  const [clickCount, setClickCount] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const { PlayerCharacterImg, setPlayerCharacterImg } = useContext(
    playCharacterImgContext
  );
  const [pageBackNum, setPageBackNum] = useState<number>(0);
  //保持のために使ってるuseState
  const [preserveIndex, setPreserveIndex] = useState<number>(0);
  type Array2D = string[][];
  const [preserveArray, setPreserveChoicesArray] = useState<Array2D>([
    ["a", "b", "c"],
  ]);

  const addArray = (newArray: string[]) => {
    setPreserveChoicesArray([...preserveArray, newArray]);
  };
  const [isSetting, setIsSetting] = useState<boolean>(false);
  const [isLog, setIsLog] = useState<boolean>(false);
  const [isChoice, setIsChoice] = useState<boolean>(false);
  const [isDoor, setIsDoor] = useState<boolean>(false);
  const [isHome, setIsHome] = useState<boolean>(false);
  const [preserveText, setPreserveText] = useState<string[]>([]);
  const [preserveChoices, setPreserveChoices] = useState<string[]>([]);
  const [preservePictureBase64, setPreservePictureBase64] = useState<string[]>(
    []
  );
  const { PrologueSaveText, setPrologueSaveText } = useContext(PrologueContext); //About.tsxのプロローグを残すために使っているコンテキスト
  //ここまで保持
  const { gameSaveText, setGameSaveText } = useContext(gameContext); //他のページに引き渡す時に使うコンテキスト
  const { base64SaveText, setbase64SaveText } = useContext(base64Context);
  const { PlayerChoiceText, setPlayerChoiceText } = useContext(choiceContext);
  const [dialogWidth, setDialogWidth] = useState<number>(450);
  const [dialogHeight, setDialogheight] = useState<number>(270);
  //#endregion
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [animatedText, setAnimatedText] = useState<string>("");
  const [isTextCreating, setTextCreating] = useState(false);

  useEffect(() => {
    (async () => {
      setContent("generating…");
      setChoices(
        choices.map((choice, index: number) =>
          index < 3 ? "generating…" : choice
        )
      );
      setPictureBase64("generating…");
      const aiMessage = JSON.parse(
        (
          await getAiMessage(
            [
              { role: "system", content: OpenAIEnv.SYSTEM_PROMPT() },
              //
              { role: "user", content: choices[choicesNumber] },
              { role: "assistant", content: PrologueSaveText },
              { role: "user", content: OpenAIEnv.FIRST_CONTACT_PROMPT },
            ],
            OpenAIEnv.GAME_FUNCTION
          )
        ).data.choices[0].message?.function_call?.arguments as string
      );
      console.log(aiMessage);

      addArray([aiMessage.choice1, aiMessage.choice2, aiMessage.choice3]);
      setPreserveText([...preserveText, aiMessage.background]); // ここから修正
      setIsLoading(true);
      const newImage = await generateImage(
        "{master piece:1.2}" + (await jp2en(aiMessage.background)),
        768,
        512
      );
      setIsLoading(false);
      setPictureBase64(newImage);
      setPreservePictureBase64([...preservePictureBase64, newImage]); // ここまで修正
      setChoices([
        aiMessage.choice1,
        aiMessage.choice2,
        aiMessage.choice3,
        inputText,
      ]);
      setContent(aiMessage.background);
      startTextAnimation(content);
      setPreserveIndex((oldPreserveIndex) => oldPreserveIndex + 1);
      setPreserveIndex((oldPreserveIndex) => {
        return oldPreserveIndex;
      });
      console.log("preserveIndex:" + preserveIndex);
      const newIndex = preserveIndex + 1;
      console.log("preserveIndex + 1:" + preserveIndex + 1);
      console.log("newIndex:" + newIndex);
    })();
  }, []);
  const headerStyle = {
    width: "15%",
    height: "auto",
  };

  const headerIconStyle = {
    position: "absolute",
    top: "2px",
    left: "-50px",
  };
  const headerIcon2Style = {
    width: "50px",
    height: "50px",
    position: "absolute",
    top: "5px",
    left: "60px",
  };
  const outerBoxStyle = {
    height: 480,
    color: "white",
    background: "black",
  };
  const outerBoxStyle2 = {
    ml: -4,
    height: 250,
    color: "white",
    background: "black",
    display: "flex",
    flexDirection: "row",
  };

  const pictureBoxStyle = {
    ml: 7,
    position: "relative",
    width: 720,
    height: 480,
  };

  const pictureStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    m: 2,
    p: 2,
    width: 720,
    height: 480,
    color: "white",
    background: "black",
    border: 2,
  };

  const imageStyle = {
    position: "absolute",
    top: 18,
    left: 17.5,
    height: 512,
    width: 753,
    maxWidth: 768,
    maxHeight: 512,
  };

  const gameTextStyle = {
    m: 2,
    ml: 8.3,
    p: 2,
    width: 370,
    height: 480,
    color: "white",
    background: "black",
    border: 2,
  };
  const playerBoxStyle = {
    mt: 8,
    ml: 17,
    width: 200,
    height: 200,
    color: "white",
    background: "black",
    border: 0,
  };
  const choicesBoxStyle2 = {
    mt: 8,
    ml: 12.25,
    width: 250,
    height: 100,
    color: "white",
    background: "black",
    border: 2,
  };
  const playerNameBox = {
    color: "white",
    background: "black",
    border: 0,
  };
  const textFieldBox = {
    mt: -9.5,
    ml: 7,
    width: 875,
    height: 90,
    color: "black",
    background: "white",
    label: "Standard",
    variant: "standard",
    display: "flex",
    border: 2,
  };
  const textFieldStyle = {
    display: "flex",
    color: "white",
    flexGrow: 1,
    "& .MuiInput-underline:before": {
      borderBottomColor: "#ffffff", // 通常時のボーダー色
    },
    backgroundColor: "black",
    borderColor: "white",
    borderWidth: 2,
    borderStyle: "solid",
  };

  const inputStyle = {
    color: "white",
    borderWidth: "3px",
  };

  const helperTextStyle = {
    color: "white",
    fontSize: 15,
  };

  //#endregion
  //#region handle操作
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  }; //テキストフィールドの入力を検知してテキストフィールドの中身をsetTextする
  const handleSceneChange = () => {
    setGameSaveText(preserveText);
    setbase64SaveText(preservePictureBase64);
    setPlayerChoiceText(preserveChoices);
    navigate("/GameProof");
  };

  if (progressPercent === 100) {
    setGameSaveText(preserveText);
  }
  const handleDecision = async (e: React.MouseEvent<HTMLButtonElement>) => {
    //ユーザーが選択肢を決定した時に動く関数
    setIsLoading(true);
    setIsChoice(false);
    closeDialog();
    setContent("generating..");
    setChoices(
      choices.map((choice, index: number) =>
        index < 3 ? "generating..." : choice
      )
    );
    const aiMessage = JSON.parse(
      (
        await getAiMessage(
          [
            { role: "system", content: OpenAIEnv.SYSTEM_PROMPT() },
            // { role: "user", content: choices[choicesNumber]}
            { role: "assistant", content: PrologueSaveText },
            {
              role: "assistant",
              content:
                preserveIndex < 5
                  ? preserveText.slice(0, preserveIndex + 1).join("") +
                    preserveChoices
                  : preserveText
                      .slice(preserveIndex - 3, preserveIndex + 1)
                      .join("") + preserveChoices,
            },
            {
              role: "user",
              content:
                choices[choicesNumber] +
                "を選択します。次の描写と3つの選択肢を出力して。日本語でお願いします。",
            },
          ],
          OpenAIEnv.GAME_FUNCTION
        )
      ).data.choices[0].message?.function_call?.arguments as string
    );
    console.log(aiMessage);
    console.log("preserveIndex:" + preserveIndex);
    addArray([aiMessage.choice1, aiMessage.choice2, aiMessage.choice3]);
    setPreserveText([...preserveText, aiMessage.background]);
    setPreserveChoices([...preserveChoices, choices[choicesNumber]]);
    setContent(aiMessage.background);
    startTextAnimation(aiMessage.background);
    setChoices([
      aiMessage.choice1,
      aiMessage.choice2,
      aiMessage.choice3,
      inputText,
    ]);
    setInputText("");
    const newImage = await generateImage(
      "{master piece:1.2}" + (await jp2en(aiMessage.background)),
      768,
      512
    );

    setIsLoading(false);
    setPictureBase64(newImage);
    setPreservePictureBase64([...preservePictureBase64, newImage]);
    setPreserveIndex((oldPreserveIndex) => oldPreserveIndex + 1);
    setPreserveIndex((oldPreserveIndex) => {
      return oldPreserveIndex;
    });
    console.log("preserveIndex:" + preserveIndex);
    const newIndex = preserveIndex + 1;
    console.log("preserveIndex + 1:" + preserveIndex + 1);
    console.log("newIndex:" + newIndex);
  };
  const startTextAnimation = (text: string) => {
    setTextCreating(true);
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < text.length) {
        setAnimatedText(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(intervalId); // アニメーション終了
        setTextCreating(false);
      }
    }, 100); // 100ミリ秒ごとに一文字ずつ表示
  };

  const choiceClick = () => {
    openDialog();
    const newChoices = [...choices];
    newChoices[3] = inputText;
    setChoices(newChoices);
    setPageBackNum(0);
    setDialogWidth(450);
    setDialogheight(300);
    setIsLog(false);
    setIsSetting(false);
    setIsChoice(true);
  };
  const choiceCancel = () => {
    closeDialog();
    setIsChoice(false);
  };
  const handleReturn = () => {
    if (preserveIndex > 0) {
      setPreserveIndex(preserveIndex - 1);
      setPageBackNum(pageBackNum + 1);
      const newIndex = preserveIndex - 1;
      console.log(preserveIndex);
      console.log(newIndex);
      // preserveIndexが0より大きい場合のみ、配列にアクセスする
      if (newIndex > 0) {
        setContent(preserveText[newIndex]);
        setChoices([
          preserveArray[newIndex][0],
          preserveArray[newIndex][1],
          preserveArray[newIndex][2],
          inputText,
        ]);
        setPictureBase64(preservePictureBase64[newIndex]);
      }
    }
  };

  const handleForward = () => {
    if (clickCount < 3) {
      if (preserveIndex + 1 < preserveArray.length) {
        setPreserveIndex(preserveIndex + 1);
        setPageBackNum(pageBackNum - 1);
        const newIndex = preserveIndex + 1;
        console.log(preserveIndex);
        console.log(newIndex);
        setContent(preserveText[newIndex]);
        setChoices([
          preserveArray[newIndex][0],
          preserveArray[newIndex][1],
          preserveArray[newIndex][2],
          inputText,
        ]);
        setPictureBase64(preservePictureBase64[newIndex]);
      }
    } else {
      alert("制限回数に達しました。");
    }
  };
  const hagurumaClick = () => {
    setIsSetting(true);
    setDialogWidth(450); //歯車クリックした時の
    setDialogheight(300);
    openDialog();
  };
  const hagurumaCancel = () => {
    setIsSetting(false);
    closeDialog();
  };
  const homeClick = () => {
    openDialog();
    setIsSetting(false);
    setIsHome(true);
    setIsChoice(false);
    setIsDoor(false);
    setIsLog(false);
  };
  const homeFinalClick = () => {
    navigate("/");
  };
  const homeFinalCancel = () => {
    closeDialog();
    setIsHome(false);
  };
  const doorClick = () => {
    setDialogWidth(450);
    setDialogheight(400);
    setIsDoor(true);
    setIsLog(false);
    setIsChoice(false);
    setIsSetting(false);
    openDialog();
  };
  const doorCancel = () => {
    setIsDoor(false);
    closeDialog();
  };
  const logClick = () => {
    setIsLog(true);
    setDialogWidth(1000);
    setDialogheight(700);
    openDialog();
  };
  const logCancel = () => {
    setIsLog(false);
    closeDialog();
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(inputText);
    setDialogWidth(450);
    setDialogheight(300);
    openDialog();
    setIsChoice(true);
    setChoices(
      choices.map((createText: string, index: number) =>
        index === 3 ? inputText : createText
      )
    );
  }; //コンソール画面でtextが変更されてることを確認可能

  var dialogContent = null;
  if (isSetting) {
    dialogContent = <ClearGameDialog />;
  } else if (isLog) {
    dialogContent = <LogDialog />;
  } else if (isChoice) {
    dialogContent = <ChoiceDetermineDialog />;
  } else if (isDoor) {
    dialogContent = <FinishDialog />;
  } else if (isHome) {
    dialogContent = <RetireDialog />;
  }
  return (
    <div className="background" style={{ height: "100vh" }}>
      <Container
        maxWidth="xl"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Stack direction="row" sx={outerBoxStyle}>
          <StoryImgBox />
          <Box sx={gameTextStyle}>
            <div id="gameText">{isTextCreating ? animatedText : content}</div>
          </Box>
          <SidBers />
        </Stack>
      </Container>
      <Container maxWidth="xl">
        <Stack direction={"row"}>
          <PlayerBox />
          <Stack direction={"column"} spacing={10} justifyContent={"start"}>
            <SuggestedChoiceBox />
            <Box>
              <div onMouseEnter={() => setChoicesNumber(3)}>
                <Box sx={textFieldBox}>
                  <TextField
                    onChange={handleChange}
                    helperText="選択肢4:あなたの新たな選択肢を作成できます。"
                    id="demo-helper-text-misaligned"
                    label=""
                    variant="filled"
                    color="primary"
                    required
                    multiline
                    sx={{
                      ...textFieldStyle,
                    }}
                    inputProps={{
                      style: inputStyle,
                    }}
                    FormHelperTextProps={{
                      style: helperTextStyle,
                    }}
                  />
                  <ChoiceSubmitButton />
                </Box>
              </div>
            </Box>
          </Stack>
        </Stack>
      </Container>

      <Dialog width={dialogWidth} height={dialogHeight}>
        <Box
          sx={{
            width: 400,
            height: 270,
          }}
        >
          {dialogContent}
        </Box>
      </Dialog>
    </div>
  );

  {
    /**Components */
  }
  function ChoiceBox({
    text,
    index,
    choicesNumber,
    choices,
  }: {
    text: string;
    index: number;
    choicesNumber: number;
    choices: string;
  }) {
    return (
      <div onMouseEnter={() => setChoicesNumber(index)}>
        <Box onClick={choiceClick} sx={choicesBoxStyle}>
          {text}

          <Grid container>
            <Grid item xs={3}>
              {choicesNumber === index && (
                <TriangleIcon sx={{ fontSize: 35, ml: 1.5, mt: 2 }} />
              )}
            </Grid>
            <Grid item xs={9}>
              <Typography color="white">{choices}</Typography>
            </Grid>
          </Grid>
        </Box>
      </div>
    );
  }

  function ChoiceSubmitButton() {
    return (
      <Button
        onClick={choiceClick}
        color="primary"
        sx={{
          mr: "2",
          height: 80,
          display: "flex",
          alignSelf: "center",
          border: "0.5px solid white",
          fontSize: "24px",
        }}
        style={{ color: "white", backgroundColor: "black" }}
      >
        作成
      </Button>
    );
  }

  function SuggestedChoiceBox() {
    return (
      <Box>
        <Stack direction={"row"}>
          <ChoiceBox
            text="選択肢１"
            index={0}
            choicesNumber={choicesNumber}
            choices={isTextCreating ? "generating..." : choices[0]}
          />
          <ChoiceBox
            text="選択肢２"
            index={1}
            choicesNumber={choicesNumber}
            choices={isTextCreating ? "generating..." : choices[1]}
          />
          <ChoiceBox
            text="選択肢３"
            index={2}
            choicesNumber={choicesNumber}
            choices={isTextCreating ? "generating..." : choices[2]}
          />
        </Stack>
      </Box>
    );
  }

  function SidBers() {
    return (
      <Stack>
        <IconButton
          src={photos.door}
          onClickHandler={doorClick}
          width="64px"
          height="64px"
          bgColor="#57584b"
          tag="冒険の証"
          tag2="（終了）"
        />
        <IconButton
          src={photos.log_icon}
          onClickHandler={logClick}
          width="64px"
          height="64px"
          bgColor="#57584b"
          tag="ログ"
        />
        {preserveIndex > 1 ? (
          <IconButton
            src={photos.arrow_left}
            onClickHandler={handleReturn}
            width="64px"
            height="40px"
            bgColor="#4B5855"
            tag="戻る"
          />
        ) : (
          <></>
        )}

        {pageBackNum > 0 ? (
          <IconButton
            src={photos.arrow_right}
            onClickHandler={handleForward}
            width="64px"
            height="40px"
            bgColor="#4B5855"
            tag="進む"
          />
        ) : (
          <></>
        )}
      </Stack>
    );
  }

  function PlayerBox() {
    return (
      <Box sx={playerBoxStyle} pt={2}>
        <Box
          component="img"
          sx={{
            ml: 3,
            width: 145,
            height: 145,
            backgroundSize: "cover",
          }}
          src={PlayerCharacterImg}
        />
        <Box sx={{ ...playerNameBox, fontSize: 25, textAlign: "center" }}>
          {playerName}
        </Box>
      </Box>
    );
  }

  function StoryImgBox() {
    return (
      <Box
        sx={{
          ...pictureBoxStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading ? (
          isTextCreating ? (
            <img
              src={photos.nowLoading}
              alt="nowLoading"
              width={"500px"}
              height={"auto"}
            />
          ) : (
            <CircularProgress />
          )
        ) : (
          // 画像を表示
          <>
            <Box sx={pictureStyle}>Picture</Box>
            <Box
              component="img"
              sx={imageStyle}
              alt="写真の説明"
              src={pictureBase64}
            />
          </>
        )}
      </Box>
    );
  }

  function ClearGameDialog() {
    return (
      <div key="setting">
        <Typography variant="h5" align="center" sx={{ mt: 3 }}>
          {"今の状況で満足しましたか？"}
        </Typography>
        <Typography variant="h6" align="left" sx={{ mt: 3 }} color={""}>
          {"※ 冒険の証を発行するともうこの物語で遊ぶことはできません。"}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-around", mt: 4 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleSceneChange}
            sx={{ width: 100, backgroundColor: "#a11f13" }}
          >
            はい
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={hagurumaCancel}
            sx={{ width: 100, backgroundColor: "#4484bd" }}
          >
            いいえ
          </Button>
        </Box>
      </div>
    );
  }

  function LogDialog() {
    return (
      <div key="log">
        <Box sx={{ width: "965px", bgcolor: "#333333" }}>
          <Box height={2}></Box>
          <Typography variant="h3" align="center" margin={5} color={"white"}>
            ゲームの進行状況
          </Typography>
          <Stack>
            <Box fontSize={25} color="white" textAlign={"start"} pt={5} pb={5}>
              プロローグ：
              <br />
              {PrologueSaveText}
            </Box>
          </Stack>
          {preservePictureBase64.map((picture, index) => (
            <Stack spacing={2}>
              <Stack direction={"row"} spacing={2}>
                <img src={picture} alt="画像" width="400px" height="auto" />
                <Typography variant="body1" color={"white"}>
                  {preserveText[index]}
                </Typography>
              </Stack>
              <Stack direction={"row"}>
                <Box paddingTop={4}>
                  <img
                    src={photos.vector}
                    alt="vector"
                    width={35}
                    height={40}
                  />
                </Box>

                <Box
                  sx={{
                    fontSize: "25px",
                    color: "black",
                    bgcolor: "white",
                    padding: "20px",
                    borderRadius: "10px",
                  }}
                >
                  {preserveChoices[index]}
                </Box>
              </Stack>

              <Box height={10}></Box>
            </Stack>
          ))}
        </Box>
      </div>
    );
  }

  function ChoiceDetermineDialog() {
    return (
      <div key="default">
        <Box>
          <Typography variant="h5" align="left">
            {`あなたは選択肢${choicesNumber + 1}`}
          </Typography>{" "}
          <Typography variant="h5" align="center" sx={{ mt: 3 }}>
            {`”${choices[choicesNumber]}”`}
          </Typography>{" "}
          <Typography variant="h5" align="left" sx={{ mt: 3 }}>
            {"を選んでいます。 "}
            <Typography variant="h5" align="left"></Typography>
            {"その選択でよろしいですか？"}
          </Typography>{" "}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-around", mt: 4 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDecision}
            sx={{ width: 100 }}
          >
            はい
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={choiceCancel}
            sx={{ width: 100 }}
          >
            いいえ
          </Button>
        </Box>
      </div>
    );
  }

  function FinishDialog() {
    return (
      <div key="default">
        <Typography variant="h6" align="left" sx={{ mt: 3 }} color={""}>
          {"冒険の証発行：この物語を保存し終了"}
        </Typography>
        <Typography variant="h6" align="left" sx={{ mt: 3 }} color={""}>
          {"リタイア：保存せずに終了，ホームへ戻る"}
        </Typography>
        <Box paddingTop={6}>
          <Stack direction={"column"} spacing={2} alignItems={"center"}>
            <Button
              variant="contained"
              onClick={hagurumaClick}
              color="primary"
              sx={{ width: 400, backgroundColor: "#594612" }}
            >
              <Box fontSize={20}> 冒険の証発行</Box>
            </Button>
            <Box fontSize={20}>or</Box>
            <Button
              variant="contained"
              color="error"
              onClick={homeClick}
              sx={{ width: 400, backgroundColor: "#4B5855" }}
            >
              <Box fontSize={20}> リタイアする </Box>
            </Button>
          </Stack>
        </Box>
      </div>
    );
  }

  function RetireDialog() {
    return (
      <div key="default">
        <Typography variant="h5" align="center" sx={{ mt: 3 }}>
          {"リタイアしますか？"}
        </Typography>
        <Typography variant="h6" align="left" sx={{ mt: 3 }} color={""}>
          {"※ リタイアするとこの冒険は無かったことになり、ホームへ戻ります。"}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-around", mt: 4 }}>
          <Button
            variant="contained"
            color="error"
            onClick={homeFinalClick}
            sx={{ width: 100 }}
          >
            はい
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={homeFinalCancel}
            sx={{ width: 100 }}
          >
            いいえ
          </Button>
        </Box>
      </div>
    );
  }
}

export default Contact;
