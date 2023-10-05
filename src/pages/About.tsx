import React, { useEffect, useState, useContext } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { MuiFileInput } from "mui-file-input";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Stack,
} from "@mui/material"; //ReactのUI使えるライブラリ
import { PrologueContext } from "../App";
import { playCharacterImgContext } from "../App";
import { getAiMessage } from "../lib/api";
import * as OpenAIEnv from "../lib/apienv";

type AboutProps = {
  file: File | null;
  preview: string | null;
  playerName: string | null;
  handleChangeFile: (newFile: File | null) => void;
  handleChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
function About({
  file,
  preview,
  handleChangeFile,
  handleChangeName,
}: AboutProps) {
  const [squareText, setsquareText] = useState("Generating..");
  const { PrologueSaveText, setPrologueSaveText } = useContext(PrologueContext);
  const { PlayerCharacterImg, setPlayerCharacterImg } = useContext(
    playCharacterImgContext
  );
  useEffect(() => {
    console.log("generating..");
    getAiMessage(
      [
        { role: "system", content: OpenAIEnv.SYSTEM_PROMPT() },
        { role: "user", content: "GAME START 日本語でお願いします" },
      ],
      OpenAIEnv.STORY_PROLOGUE_DESCRIPTION
    )
      .then((res) => {
        console.log(
          JSON.parse(
            res.data.choices[0].message?.function_call?.arguments as string
          )["Story Prologue to the Adventure"]
        );

        setsquareText(
          JSON.parse(
            res.data.choices[0].message?.function_call?.arguments as string
          )["Story Prologue to the Adventure"]
        );
        setPrologueSaveText(
          JSON.parse(
            res.data.choices[0].message?.function_call?.arguments as string
          )["Story Prologue to the Adventure"]
        );
        // setsquareText(res.data.choices[0].message);
      })
      .catch((e) => setsquareText("an error happened"));
  }, []);
  const [isStarted, setIsStarted] = useState(false);
  const firstLine = squareText.split("\n")[0];
  const restText = squareText.split("\n").slice(1).join("\n");
  const navigate = useNavigate();
  const handleStart = () => {
    setIsStarted(true);
    navigate("/contact");
  };
  return (
    // Gridコンテナの親要素に高さを指定する場合
    <div style={{ height: "100vh" }}>
      <Stack direction={"column"}>
        <Box padding={10}>
          <Box textAlign={"center"} fontSize={50} paddingBottom={1}>
            プロローグ
          </Box>
          <Box
            className="black-square"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <pre className="square-text">
              <span className="square-text-first-line">{firstLine}</span>
              {restText}
            </pre>
          </Box>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Box></Box>
            <Button
              onClick={handleStart}
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#4DC2B1",
                "&:hover": {
                  backgroundColor: "#4B5855",
                },
              }}
            >
              <Box fontSize={30}> 次へ</Box>
            </Button>
          </Stack>
        </Box>
      </Stack>
    </div>
  );
}

export default About;
