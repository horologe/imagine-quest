//#region import

import React, { useEffect, useState, useContext } from "react";

import "../GameScreen.css";
//import { getAiMessage, getChoices } from "../lib/api";

import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Stack,
} from "@mui/material"; //ReactのUI使えるライブラリ
import hagurumaImage from "./haguruma.png"; //写真。
import ForwardPicture from "./yajirusiForward.png";
import ReturnPicture from "./yajirusiReturn.png";
import button1 from "../screenPicture/btn1.png";
import headerImage from "../screenPicture/header.png";
import homeIcon from "../screenPicture/home_icon.png";
import log_Icon from "../screenPicture/log_icon.png";
import { useDialog } from "../dialog";
import { getAiMessage, jp2en, generateImage } from "../lib/api";
import * as OpenAIEnv from "../lib/apienv";
import * as photos from "../screenPicture";
import { PrologueContext, playCharacterImgContext } from "../App";
import { gameContext } from "../App";
import { base64Context } from "../App";
import { choiceContext } from "../App";
import { ImageToButton } from "./ImageToButton";
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
  const [content, setContent] = useState<string>("多分背景描写？"); //chatGPTから来た背景描写がここに入るんかな?と思ったのでBoxの中に書かれるようにしてます
  const [pictureBase64, setPictureBase64] = useState<string>(""); //ここにpictureBase64のString入れてください
  const [inputText, setInputText] = useState<string>(""); //このinputTextに打ち込まれた文字が入る
  const [choicesNumber, setChoicesNumber] = useState<number>(0);
  const [clickCount, setClickCount] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const { PlayerCharacterImg, setPlayerCharacterImg } = useContext(
    playCharacterImgContext
  );
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
      const newImage = await generateImage(
        "{master piece:1.2}" + (await jp2en(aiMessage.background)),
        768,
        512
      );
      setPictureBase64(newImage);
      setPreservePictureBase64([...preservePictureBase64, newImage]); // ここまで修正
      setChoices([
        aiMessage.choice1,
        aiMessage.choice2,
        aiMessage.choice3,
        inputText,
      ]);
      setContent(aiMessage.background);
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

  //#region Box&TextStyle
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
      const newImage = await generateImage(
        "{master piece:1.2}" + (await jp2en(aiMessage.background)),
        768,
        512
      );
      setPictureBase64(newImage);
      setPreservePictureBase64([...preservePictureBase64, newImage]); // ここまで修正
      setChoices([
        aiMessage.choice1,
        aiMessage.choice2,
        aiMessage.choice3,
        inputText,
      ]);
      setContent(aiMessage.background);
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
  const choicesBoxStyle = {
    mt: 8,
    ml: 7.1,
    width: 250,
    height: 100,
    color: "white",
    background: "black",
    border: 2,
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
    ml: 50.5,
    width: 875,
    height: 90,
    color: "black",
    background: "white",
    label: "Standard",
    variant: "standard",
    display: "flex",
    border: 2,
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
  const choiceClick = () => {
    openDialog();
    const newChoices = [...choices];
    newChoices[3] = inputText;
    setChoices(newChoices);
    setDialogWidth(400);
    setDialogheight(270);
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
    setDialogWidth(450);
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
    setDialogWidth(600);
    setDialogheight(400);
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
    dialogContent = (
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
  } else if (isLog) {
    dialogContent = (
      <div key="log">
        <Box sx={{ width: "100%", height: "100%" }}>
          <Typography variant="h3" align="center">
            ゲームの進行状況
          </Typography>
          <Grid container spacing={2} sx={{ margin: 2 }}>
            {preservePictureBase64.map((picture, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Stack spacing={2}>
                  <img src={picture} alt="画像" width="100%" height="auto" />
                  <Typography variant="body1">{preserveText[index]}</Typography>
                  <Typography variant="button">
                    {preserveChoices[index]}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    );
  } else if (isChoice) {
    dialogContent = (
      <div key="default">
        <Typography variant="h5" align="left">
          {`あなたは選択肢${choicesNumber + 1}`}
        </Typography>{" "}
        <Typography variant="h5" align="center" sx={{ mt: 3 }}>
          {`『${choices[choicesNumber]}』`}
        </Typography>{" "}
        <Typography variant="h5" align="left" sx={{ mt: 3 }}>
          {"を選んでいます。 "}
        </Typography>{" "}
        <Typography variant="h5" align="left">
          {"その選択でよろしいですか？"}
        </Typography>{" "}
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
  } else if (isDoor) {
    dialogContent = (
      <div key="default">
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
  } else if (isHome) {
    dialogContent = (
      <div key="default">
        <Typography variant="h5" align="left">
          {`ここがホームに戻るかの確認`}
        </Typography>{" "}
        <Typography variant="h5" align="center" sx={{ mt: 3 }}>
          {`『${choices[choicesNumber]}』`}
        </Typography>{" "}
        <Typography variant="h5" align="left" sx={{ mt: 3 }}>
          {"を選んでいます。 "}
        </Typography>{" "}
        <Typography variant="h5" align="left">
          {"ホームに戻っても大丈夫ですか？"}
        </Typography>{" "}
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
  return (
    <div className="background" style={{ height: "100vh" }}>
      <Container
        maxWidth="xl"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Stack direction="row" sx={outerBoxStyle}>
          <Box sx={pictureBoxStyle}>
            <Box sx={pictureStyle}>Picture</Box>
            <Box
              component="img"
              sx={imageStyle}
              alt="写真の説明"
              src={pictureBase64}
            />
            {/* <Box component="img" sx={imageStyle} alt="写真の説明" src={ExampleImage} />*/}
          </Box>
          <Box sx={gameTextStyle}>
            <div id="gameText">{content}</div>
          </Box>
          <Stack>
            <Box
              component="img"
              padding={2}
              src={photos.door}
              sx={{
                width: 64,
                height: 64,
                mt: 3,
                backgroundColor: "#57584b",
                borderRadius: "20%",
                "&:hover": {
                  backgroundColor: "#57584b",
                  opacity: [0.9, 0.8, 0.7],
                },
              }}
              onClick={doorClick}
            ></Box>
            <Box
              component="img"
              padding={2}
              src={photos.log_icon}
              sx={{
                width: 64,
                height: 64,
                mt: 3,
                backgroundColor: "#57584b",
                borderRadius: "20%",
                "&:hover": {
                  backgroundColor: "#57584b",
                  opacity: [0.9, 0.8, 0.7],
                },
              }}
              onClick={logClick}
            ></Box>
            <Box
              component="img"
              padding={2}
              src={photos.arrow_left}
              sx={{
                width: 64,
                height: 50,
                mt: 3,
                pt: 1,
                pb: 1,
                backgroundColor: "#4B5855",
                borderRadius: "20%",
                "&:hover": {
                  backgroundColor: "#4B5855",
                  opacity: [0.9, 0.8, 0.7],
                },
              }}
              onClick={handleReturn}
            ></Box>
            <Box
              component="img"
              padding={2}
              src={photos.arrow_right}
              sx={{
                width: 64,
                height: 50,
                mt: 3,
                pt: 1,
                pb: 1,
                backgroundColor: "#4B5855",
                borderRadius: "20%",
                "&:hover": {
                  backgroundColor: "#4B5855",
                  opacity: [0.9, 0.8, 0.7],
                },
              }}
              onClick={handleForward}
            ></Box>
          </Stack>
        </Stack>
      </Container>
      <Container maxWidth="xl">
        <Box sx={outerBoxStyle2}>
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
          <section>
            <Box onClick={choiceClick} sx={choicesBoxStyle2}>
              選択肢1
              <div onMouseEnter={() => setChoicesNumber(0)}>
                <Grid container>
                  <Grid item xs={3}>
                    {choicesNumber == 0 && (
                      <TriangleIcon sx={{ fontSize: 35, ml: 1.5, mt: 2 }} />
                    )}
                  </Grid>
                  <Grid item xs={9}>
                    <Typography color="white">{choices[0]}</Typography>
                  </Grid>
                </Grid>
              </div>
            </Box>
          </section>
          <Box sx={choicesBoxStyle} onClick={choiceClick}>
            選択肢2
            <div onMouseEnter={() => setChoicesNumber(1)}>
              <Grid container>
                <Grid item xs={3}>
                  {choicesNumber == 1 && (
                    <TriangleIcon sx={{ fontSize: 35, ml: 1.5, mt: 2 }} />
                  )}
                </Grid>
                <Grid item xs={9}>
                  <Typography color="white">{choices[1]}</Typography>
                </Grid>
              </Grid>
            </div>
          </Box>
          <Box sx={choicesBoxStyle} onClick={choiceClick}>
            選択肢3
            <div onMouseEnter={() => setChoicesNumber(2)}>
              <Grid container>
                <Grid item xs={3}>
                  {choicesNumber == 2 && (
                    <TriangleIcon sx={{ fontSize: 35, ml: 1.5, mt: 2 }} />
                  )}
                </Grid>
                <Grid item xs={9}>
                  <Typography color="white">{choices[2]}</Typography>
                </Grid>
              </Grid>
            </div>
          </Box>
        </Box>
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
                display: "flex",
                color: "white",
                maxWidth: 700,
                flexGrow: 1,
                "& .MuiInput-underline:before": {
                  borderBottomColor: "#ffffff", // 通常時のボーダー色
                },
                backgroundColor: "black",
                borderColor: "white",
                borderWidth: 2,
                borderStyle: "solid",
              }}
              inputProps={{ style: { color: "white", borderWidth: "3px" } }}
              FormHelperTextProps={{
                style: { color: "white", fontSize: 15 },
              }}
            />
            <Button
              onClick={choiceClick}
              color="primary"
              sx={{
                mr: "2",
                height: 80,
                display: "flex",
                alignSelf: "center",
                border: "0.5px solid white",
              }}
              style={{ color: "white", backgroundColor: "black" }}
            >
              作成
            </Button>
          </Box>
        </div>
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
}

export default Contact;
