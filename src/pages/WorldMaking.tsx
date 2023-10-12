import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack } from "@mui/material";
import * as OpenAIEnv from "../lib/apienv";
import * as photos from "../screenPicture";
import { ImageToButton } from "./ui/ImageToButton";
import { DecideButton } from "./ui/buttons";
import { NomalHeader } from "./ui/headers";

function WorldMaking() {
    const [isChosen, setIsChosen] = useState<boolean>(false);
    const choiceRef = useRef<string[]>([]);
    const navigate = useNavigate() as (path: string) => void;
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

    useEffect(() => { }, []); // isChosenが変化したときに実行されるようにする

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
                <NomalHeader
                    navigateTo={handleCharacterChoose}
                    pageName="ジャンル選択"
                />
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
                                    <WorldMakingButton
                                        mainGener={0}
                                        subGener={0}
                                        tag="ダンジョン"
                                    />
                                    <WorldMakingButton
                                        mainGener={0}
                                        subGener={1}
                                        tag="終末の世界"
                                    />
                                    <WorldMakingButton
                                        mainGener={0}
                                        subGener={2}
                                        tag="魔法の世界"
                                    />
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
                                    <WorldMakingButton mainGener={1} subGener={0} tag="宇宙" />
                                    <WorldMakingButton
                                        mainGener={1}
                                        subGener={1}
                                        tag="サイバーパンク"
                                    />
                                    <WorldMakingButton mainGener={1} subGener={2} tag="海洋" />
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
                                    <WorldMakingButton
                                        mainGener={2}
                                        subGener={0}
                                        tag="ブラック企業"
                                    />
                                    <WorldMakingButton
                                        mainGener={2}
                                        subGener={1}
                                        tag="廃校"
                                    />
                                    <WorldMakingButton mainGener={2} subGener={2} tag="高専" />
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
    function WorldMakingButton({
        mainGener,
        subGener,
        tag,
    }: {
        mainGener: number;
        subGener: number;
        tag: string;
    }) {
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

        return (
            <Box paddingTop={1}>
                <Button
                    sx={
                        mainGenre == mainGener && subGenre == subGener
                            ? choicesBoxStyle2Clicked
                            : choicesBoxStyle2
                    }
                    onClick={() => handleGenre(mainGener, subGener)}
                >
                    {tag}
                </Button>
            </Box>
        );
    }
}

export default WorldMaking;
