import React, { useState, useContext, useEffect } from "react";
import ChatArea from "../components/ChatArea";
import { useNavigate } from "react-router-dom";
import Title from "./ImagineQuestWord.png";
import { Box, Button, Stack, TextField, Grid } from "@mui/material";
import { PlayCharacterContext } from "../App";
import { playCharacterImgContext } from "../App";
import { getAiMessage, jp2en, generateImage } from "../lib/api";
import * as OpenAIEnv from "../lib/apienv";
import { ImageToButton } from "./ImageToButton";
import * as photos from "../screenPicture";
import { DecideButton } from "./buttons";

type CharacterMaking = {
    playerName: string | null;
    handleChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
function CharacterMaking({ playerName, handleChangeName }: CharacterMaking) {
    const [isStarted, setIsStarted] = useState(false);
    const [playerFeaturesText, setPlayerFeaturesText] = useState("");
    const { PlayCharacterSaveText, setPlayCharacterSaveText } =
        useContext(PlayCharacterContext); //プロンプト入ってる
    const { PlayerCharacterImg, setPlayerCharacterImg } = useContext(
        playCharacterImgContext
    );
    const [pictureBase64, setPictureBase64] = useState<string>("");
    const [playerNameText, setPlayerNameText] = useState<string>("");

    const navigate = useNavigate();
    const handleStart = () => {
        setPlayCharacterSaveText(playerFeaturesText);
        setPlayerCharacterImg(pictureBase64);
        navigate("/WorldMaking");
    };
    const handlerPlayerChoice = () => {
        navigate("/PlayerChoice");
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setPlayerCharacterImg("generating...")
        setPictureBase64(
            await generateImage("{master piece:1.2}," + playerFeaturesText, 512, 512)
        );
        setPlayerCharacterImg(pictureBase64);

        console.log(PlayerCharacterImg);
    };
    const choicesBoxStyle2 = {
        mt: 8,
        width: "300",
        height: "400",
        color: "white",
        background: "black",
        border: 2,
        textAlign: "center",
    };
    useEffect(() => { // useEffect内でasync関数を定義する 
        const fetchImage = async () => {
            setPlayerFeaturesText(PlayCharacterSaveText);
            const newPlayerCharacterSaveText = playerFeaturesText; setPictureBase64(await generateImage("{master piece:1.2}," + newPlayerCharacterSaveText, 512, 512));
            setPlayerCharacterImg(pictureBase64);
        }; // 定義したasync関数を呼び出す 
        fetchImage();
    }, []);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlayerFeaturesText(e.target.value);
    };
    return (
        <>
            <Stack spacing={2}>
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
                            onClick={handlerPlayerChoice}
                            height={60}
                            width={60}
                        />
                        <Box fontSize={30} paddingTop={0.8}>
                            キャラ生成
                        </Box>
                    </Stack>
                </Box>
                {/*以下*/}
                <Box paddingLeft={20}>
                    <Stack direction={"row"} spacing={10}>
                        <Stack direction={"column"} spacing={2}>
                            <Box>{PlayCharacterSaveText}</Box>
                            <Box
                                component="img"
                                sx={{ width: 512, height: 512 }}
                                src={pictureBase64}
                            />
                        </Stack>
                        <Stack direction={"column"} justifyContent="space-between">
                            <Box></Box>
                            <Stack>
                                <TextField
                                    label="プレイヤー名"
                                    variant="outlined"
                                    sx={{ width: 512, mr: 1, bgcolor: "white" }}
                                    onChange={handleChangeName}
                                />
                                <Box paddingTop={5}>
                                    <Stack direction={"row"} justifyContent={"space-between"}>
                                        <Box sx={{ bgcolor: "#4DC2B1", borderRadius: "5%" }}>
                                            <ImageToButton
                                                src={photos.reload}
                                                alt={"reload"}
                                                onClick={() => handleSubmit}
                                                width={100}
                                                height={100}
                                            />
                                        </Box>

                                        <DecideButton
                                            tag="これで行く!"
                                            onClickHandler={handleStart}
                                        />
                                    </Stack>
                                </Box>
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </>
    );
}

export default CharacterMaking;
