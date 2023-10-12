import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack, TextField } from "@mui/material";
import { PlayCharacterContext } from "../App";
import { playCharacterImgContext } from "../App";
import { generateImage } from "../lib/api";
import { ImageToButton } from "./ui/ImageToButton";
import * as photos from "../screenPicture";
import { DecideButton } from "./ui/buttons";
import CircularProgress from "@mui/material/CircularProgress";
import { NomalHeader } from "./ui/headers";

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
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const handleStart = () => {
        if (playerName != "" && pictureBase64 != "") {
            setPlayCharacterSaveText(playerFeaturesText);
            setPlayerCharacterImg(pictureBase64);
            navigate("/WorldMaking");
        } else {
            alert("キャラ名、またはキャラの写真がセットされていません。");
        }
    };
    const handlerPlayerChoice = () => {
        navigate("/PlayerChoice");
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        console.log("クリックされた!");
        const picture = await generateImage(
            "{master piece:1.2}," + PlayCharacterSaveText,
            512,
            512
        );
        setPictureBase64(picture);
        setIsLoading(false);
        setPlayerCharacterImg(picture);

        console.log(PlayerCharacterImg);
    };

    useEffect(() => {
        const fetchImage = async () => {
            setIsLoading(true);
            setPictureBase64(
                await generateImage(
                    "{master piece:1.2}," + PlayCharacterSaveText,
                    512,
                    512
                )
            );
            setIsLoading(false);
            setPlayerCharacterImg(pictureBase64);
        };
        fetchImage();
    }, []);
    return (
        <>
            <Stack spacing={2}>
                <NomalHeader navigateTo={handlerPlayerChoice} pageName="キャラ生成" />
                <Box paddingLeft={20}>
                    <Stack direction={"row"} spacing={10}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 512,
                                height: 512,
                            }}
                        >
                            {isLoading ? (
                                <CircularProgress />
                            ) : (
                                // 画像を表示
                                <>
                                    <Box
                                        component="img"
                                        sx={{ width: 512, height: 512 }}
                                        src={pictureBase64}
                                    />
                                </>
                            )}
                        </Box>
                        <Stack direction={"column"} justifyContent="space-between">
                            <Box>{PlayCharacterSaveText}</Box>
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
                                                onClick={handleSubmit}
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
