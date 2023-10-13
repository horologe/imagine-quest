import { useParams } from "react-router-dom";
import { Button, Box, Stack, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
  getDocs,
  collection,
  query,
  where,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { gameChoice } from "../lib/apienv";
import * as photos from "../screenPicture";

export default function ProofDetail() {
  const { id } = useParams();
  type DetailType = {
    Prologue: string;
    gameChoices: string[];
    gamePictures: string[];
    gameTexts: string[];
  };
  type gameType = {
    charaName: string;
    Title: string;
    title_imgURL: string;
    date: Timestamp;
  };
  type charaType = {
    chara_imgURL: string;
    clearCount: number;
  };
  const [detail, setDetail] = useState<DetailType | null>(null);
  const [game, setGame] = useState<gameType | null>(null);
  const [character, setCharacter] = useState<charaType | null>(null);
  const [dateString, setDateString] = useState<string>("");
  useEffect(() => {
    const detailRef = collection(db, "game_detail");
    const gameRef = collection(db, "game");
    const characterRef = collection(db, "character");
    getDocs(query(detailRef, where("detailID", "==", id))).then(
      (querySnapshot) => {
        const detailNames = querySnapshot.docs.map(
          (doc) => doc.data() as DocumentData
        );
        setDetail((detailNames as any)[0]);
      }
    );
    getDocs(query(gameRef, where("detailID", "==", id))).then(
      (querySnapshot2) => {
        const games = querySnapshot2.docs.map(
          (doc) => doc.data() as DocumentData
        );
        setGame((games as any)[0]);
      }
    );
    if (game != null) {
      getDocs(
        query(characterRef, where("charaName", "==", game.charaName))
      ).then((querySnapshot3) => {
        const characters = querySnapshot3.docs.map(
          (doc) => doc.data() as DocumentData
        );
        setCharacter((characters as any)[0]);
      });
    }
  }, []);

  return detail == null ? (
    <>loading..</>
  ) : (
    <div key="log">
      <Box sx={{ width: "100%", bgcolor: "#333333" }}>
        <Box padding={10}>
          <Stack spacing={4} alignItems={"center"}>
            {/*ここからが新しいデータ */}
            <Stack direction={"row"} spacing={15}>
              <Title />
              <Box textAlign={"left"}>
                <Stack direction={"column"} spacing={2}>
                  <a href={window.location.host + "/proof/" + id}>
                    <Box
                      bgcolor={"#A8BF54"}
                      padding={2}
                      textAlign={"center"}
                      fontSize={20}
                    >
                      リンクを取得
                    </Box>
                  </a>
                  <Box fontSize={30}>プレイヤー情報</Box>
                  <img
                    src={character?.chara_imgURL}
                    width="250"
                    height="250"
                    alt="キャラ画像"
                  ></img>
                  <Box fontSize={20}>プレイキャラ：{game?.charaName}</Box>
                  <Box fontSize={20}>クリア回数　：{character?.clearCount}</Box>
                </Stack>
              </Box>
            </Stack>
            {/*ここまでが新しいデータ */}
            <Box fontSize={25} color="white" textAlign={"start"} pt={5} pb={5}>
              プロローグ：
              <br />
              {detail.Prologue}
            </Box>
            {detail?.gamePictures.map((picture, index) => (
              <Stack spacing={2}>
                <Stack direction={"row"} spacing={2}>
                  <img src={picture} alt="画像" width="400px" height="auto" />
                  <Typography variant="body1" color={"white"}>
                    {detail.gameTexts[index]}
                  </Typography>
                </Stack>
                {detail.gameChoices[index] ? (
                  <Box paddingTop={4}>
                    <Stack direction={"row"}>
                      <CharaBox />
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
                        {detail.gameChoices[index]}
                      </Box>
                    </Stack>
                  </Box>
                ) : (
                  <></>
                )}
                <Box height={10}></Box>
              </Stack>
            ))}{" "}
          </Stack>
        </Box>
      </Box>
    </div>
  );

  function CharaBox() {
    return (
      <Box textAlign={"center"}>
        <img
          src={character?.chara_imgURL}
          width="100"
          height="100"
          alt="キャラ画像"
        ></img>
        <Box>キャラ名：{game?.charaName}</Box>
      </Box>
    );
  }
  function Title() {
    return (
      <Stack spacing={4}>
        <Box textAlign={"center"} fontSize={40}>
          ~{game?.Title}~
        </Box>
        <img
          src={game?.title_imgURL}
          width="600"
          height="400"
          alt="タイトル画像"
        ></img>
      </Stack>
    );
  }
}
