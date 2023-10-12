import { useParams } from "react-router-dom"
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
    }
    type gameType = {
        charaName: string;
        Title: string;
        title_imgURL: string;
        date: Timestamp;
    }
    type charaType = {
        chara_imgURL: string;
        clearCount: number;
    }
    const [detail, setDetail] = useState<DetailType | null>(null);
    const [game, setGame] = useState<gameType | null>(null);
    const [character, setCharacter] = useState<charaType | null>(null);
    const [dateString, setDateString] = useState<string>("");
    useEffect(() => {
        const detailRef = collection(db, "game_detail");
        const gameRef = collection(db, "game");
        const characterRef = collection(db, "character");
        getDocs(query(detailRef, where("detailID", "==", id)))
            .then(querySnapshot => {
                const detailNames = querySnapshot.docs.map((doc) => doc.data() as DocumentData);
                setDetail((detailNames as any)[0]);
            })
        getDocs(query(gameRef, where("detailID", "==", id)))
            .then(querySnapshot2 => {
                const games = querySnapshot2.docs.map((doc) => doc.data() as DocumentData);
                setGame((games as any)[0]);
            })
        if (game != null) {
            getDocs(query(characterRef, where("charaName", "==", game.charaName)))
                .then(querySnapshot3 => {
                    const characters = querySnapshot3.docs.map((doc) => doc.data() as DocumentData);
                    setCharacter((characters as any)[0]);
                })
        }
    }, [])

    return detail == null ? <>loading..</> :
        (<div key="log">
            <Box sx={{ width: "965px", bgcolor: "#333333" }}>
                <Box height={2}></Box>
                <a href={window.location.host + "/proof/" + id}>共有用アドレス</a>
                {/*ここからが新しいデータ */}
                <Box>キャラ名：{game?.charaName}</Box><Box>クリア回数：{character?.clearCount}</Box>
                <img src={character?.chara_imgURL} width="256" height="256" alt="キャラ画像"></img>
                <Box>タイトル名；{game?.Title}</Box>
                <img src={game?.title_imgURL} width="600" height="400" alt="タイトル画像"></img>
                {/*ここまでが新しいデータ */}
                <Stack>
                    <Box fontSize={25} color="white" textAlign={"start"} pt={5} pb={5}>
                        プロローグ：
                        <br />
                        {detail.Prologue}
                    </Box>
                </Stack>
                {detail?.gamePictures.map((picture, index) => (
                    <Stack spacing={2}>
                        <Stack direction={"row"} spacing={2}>
                            <img src={picture} alt="画像" width="400px" height="auto" />
                            <Typography variant="body1" color={"white"}>
                                {detail.gameTexts[index]}
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
                                {detail.gameChoices[index]}
                            </Box>
                        </Stack>

                        <Box height={10}></Box>
                    </Stack>
                ))}
            </Box>
        </div>)
}