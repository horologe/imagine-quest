import React, { useState, useEffect, useRef, useContext, FC } from "react";
import ChatArea from "../components/ChatArea";
import { useNavigate } from "react-router-dom";
import Title from "./ImagineQuestWord.png";
import {
  Box,
  Button,
  Grid,
  MenuList,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { getAiMessage, jp2en, generateImage } from "../lib/api";
import * as OpenAIEnv from "../lib/apienv";
import * as photos from "../screenPicture";
import { ImageToButton } from "./ImageToButton";
import { DecideButton } from "./buttons";

function WorldMaking() {
  const [isChosen, setIsChosen] = useState<boolean>(false);
  const choiceRef = useRef<string[]>([]); // 選択されたテキストを保持する参照（配列）
  const navigate = useNavigate() as (path: string) => void; // useNavigateの戻り値を型アサーションで指定
  const [mainGenre, setMainGenre] = useState<number>(0);
  const [subGenre, setSubGenre] = useState<number>(0);

  const [showAbout, setShowAbout] = useState(false);

  const handleGenre = (mainGenreNumber: number, subGenreNumber: number) => {
    setMainGenre(mainGenreNumber);
    setSubGenre(subGenreNumber);
  };
  const handleCharacterChoose = () => {
    navigate("/characterChoose");
  };

  const handleShowAbout = () => {
    console.log(mainGenre);
    console.log(subGenre);
    OpenAIEnv.gameChoice(mainGenre, subGenre);
    setShowAbout(true);
    navigate("/about");
    console.log("進むで");
  };

  const choicesBoxStyle2 = {
    background: "#000000",
    textAlign: "center",
    width: "250px",
    height: "60px",
    fontSize: "30px",
    color: "#FFFFFF",
    "&:hover": {
      background: "#333333",
    },
  };
  const choicesBoxStyle2Clicked = {
    background: "#FFFFFF",
    textAlign: "center",
    width: "250px",
    height: "60px",
    fontSize: "30px",
    color: "#000000",
    "&:hover": {
      background: "#CCCCCC",
    },
  };

  useEffect(() => {}, []); // isChosenが変化したときに実行されるようにする

  return (
    <>
      <Stack
        direction="column"
        spacing={5}
        sx={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#4D4D4D",
          overflowX: "hidden",
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
              onClick={handleCharacterChoose}
              height={60}
              width={60}
            />
            <Box fontSize={30} paddingTop={0.8}>
              ジャンル選択
            </Box>
          </Stack>
        </Box>
        <Box padding={"0px 150px 0 150px"}>
          <Stack direction="row" justifyContent="space-between">
            {/*ファンタジー*/}
            <Box sx={{ position: "relative" }}>
              <img src={photos.fantagy_bg} alt="fantagy" width="300px" />
              <Stack
                sx={{ position: "absolute", top: 0, left: 0 }}
                padding={"80px 20px 0 20px"}
                spacing={10}
              >
                <img src={photos.fantagy_logo} alt="fantagy" height={58} />
                <Stack spacing={2}>
                  <Button
                    sx={
                      mainGenre == 0 && subGenre == 0
                        ? choicesBoxStyle2Clicked
                        : choicesBoxStyle2
                    }
                    onClick={() => handleGenre(0, 0)}
                  >
                    ダンジョン
                  </Button>
                  <Button
                    sx={
                      mainGenre == 0 && subGenre == 1
                        ? choicesBoxStyle2Clicked
                        : choicesBoxStyle2
                    }
                    onClick={() => handleGenre(0, 1)}
                  >
                    終末の世界
                  </Button>
                  <Button
                    sx={
                      mainGenre == 0 && subGenre == 2
                        ? choicesBoxStyle2Clicked
                        : choicesBoxStyle2
                    }
                    onClick={() => handleGenre(0, 2)}
                  >
                    魔法の世界
                  </Button>
                </Stack>
                {mainGenre == 0 && (
                  <DecideButton
                    tag="次に進む！"
                    onClickHandler={() => handleShowAbout()}
                  />
                )}
              </Stack>
            </Box>

            {/*SF*/}
            <Box sx={{ position: "relative" }}>
              <img src={photos.sf_bg} alt="fantagy" width="300px" />
              <Stack
                sx={{ position: "absolute", top: 0, left: 0 }}
                padding={"80px 20px 0 20px"}
                spacing={10}
                alignItems={"center"}
              >
                <img src={photos.sf_logo} alt="sf" height={"58px"} />
                <Stack spacing={2}>
                  <Button
                    sx={
                      mainGenre == 1 && subGenre == 0
                        ? choicesBoxStyle2Clicked
                        : choicesBoxStyle2
                    }
                    onClick={() => handleGenre(1, 0)}
                  >
                    宇宙
                  </Button>
                  <Button
                    sx={
                      mainGenre == 1 && subGenre == 1
                        ? choicesBoxStyle2Clicked
                        : choicesBoxStyle2
                    }
                    onClick={() => handleGenre(1, 1)}
                  >
                    サイバーパンク
                  </Button>
                  <Button
                    sx={
                      mainGenre == 1 && subGenre == 2
                        ? choicesBoxStyle2Clicked
                        : choicesBoxStyle2
                    }
                    onClick={() => handleGenre(1, 2)}
                  >
                    近未来
                  </Button>
                </Stack>
                {mainGenre == 1 && (
                  <DecideButton
                    tag="次に進む！"
                    onClickHandler={() => handleShowAbout()}
                  />
                )}
              </Stack>
            </Box>

            {/*現代*/}
            <Box sx={{ position: "relative" }}>
              <img src={photos.social_bg} alt="social" width="300px" />
              <Stack
                sx={{ position: "absolute", top: 0, left: 0 }}
                padding={"80px 20px 0 20px"}
                spacing={10}
                alignItems={"center"}
              >
                <img src={photos.social_logo} alt="social" height={"58px"} />
                <Stack spacing={2}>
                  <Button
                    sx={
                      mainGenre == 2 && subGenre == 0
                        ? choicesBoxStyle2Clicked
                        : choicesBoxStyle2
                    }
                    onClick={() => handleGenre(2, 0)}
                  >
                    ブラック企業
                  </Button>
                  <Button
                    sx={
                      mainGenre == 2 && subGenre == 1
                        ? choicesBoxStyle2Clicked
                        : choicesBoxStyle2
                    }
                    onClick={() => handleGenre(2, 1)}
                  >
                    小中学校
                  </Button>
                  <Button
                    sx={
                      mainGenre == 2 && subGenre == 2
                        ? choicesBoxStyle2Clicked
                        : choicesBoxStyle2
                    }
                    onClick={() => handleGenre(2, 2)}
                  >
                    高専
                  </Button>
                </Stack>
                {mainGenre == 2 && (
                  <DecideButton
                    tag="次に進む！"
                    onClickHandler={() => handleShowAbout()}
                  />
                )}
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </>
  );
}

export default WorldMaking;
