import { useEffect, useState, useContext } from "react";

import { Button, Box, Stack, Grid, TextField, Typography } from "@mui/material";

import { db } from "../firebase/firebase";
import { useDialog } from "../dialog";
import { useNavigate } from "react-router-dom";
import {
    doc,

    setDoc,

    addDoc,

    collection,

    serverTimestamp,

    query,

    where,

    getDocs,

    DocumentData,

    updateDoc,

    increment,

} from "firebase/firestore";

import { gameContext } from "../App";

import { PlayCharacterContext } from "../App";

import { PrologueContext } from "../App";

import { base64Context } from "../App";

import { choiceContext } from "../App";

import { playCharacterImgContext } from "../App";

import { emailContext } from "../App";

import { getAiMessage, jp2en, generateImage } from "../lib/api";

import * as OpenAIEnv from "../lib/apienv";

import { DecideButton } from "./ui/buttons";

import * as photos from "../screenPicture";

import CircularProgress from "@mui/material/CircularProgress";



type AboutProps = {

    file: File | null;

    gameFile: File[] | null;

    preview: string | null;

    playerName: string | null;

};

function GameProof({ file, preview, gameFile, playerName }: AboutProps) {
    const { Dialog, open: openDialog, close: closeDialog } = useDialog();
    const { PrologueSaveText, setPrologueSaveText } = useContext(PrologueContext);

    const { gameSaveText, setGameSaveText } = useContext(gameContext);

    const { base64SaveText, setbase64SaveText } = useContext(base64Context);

    const { PlayerChoiceText, setPlayerChoiceText } = useContext(choiceContext);

    const { PlayerCharacterImg, setPlayerCharacterImg } = useContext(

        playCharacterImgContext

    );

    const { PlayCharacterSaveText, setPlayCharacterSaveText } =

        useContext(PlayCharacterContext);

    const { saveEmail, setSaveEmail } = useContext(emailContext);

    const usersCollectionName = "users";

    const gameDetailCollectionName = "game_detail";

    const gameCollectionName = "game";

    const characterCollectionName = "character";

    const [characterArray, setCharacterArray] = useState<DocumentData[] | null>(

        null

    );

    const [sent, setSent] = useState<boolean>(false);

    const [title, setTitle] = useState("Adventure");

    const [title_imgURL, setTitle_imgURL] = useState<string>("aa");

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const gameTextStyle = {

        m: 2,

        ml: 8.3,

        p: 2,

        width: 1300,

        color: "white",

        background: "black",

        border: 2,

    };

    const gameText2Style = {

        ml: 8.3,

        p: 2,

        width: 800,

        height: 360,

        color: "white",

        background: "black",

        border: 2,

    };

    const imageStyle = {

        ml: 10,

        height: 600,

        width: 400,

        maxWidth: 600,

        maxHeight: 400,

    };

    useEffect(() => {

        console.log(gameSaveText);

        console.log(

            PrologueSaveText +

            gameSaveText[1] +

            PlayerChoiceText[1] +

            gameSaveText[gameSaveText.length - 2] +

            PlayerChoiceText[gameSaveText.length - 2] +

            gameSaveText[gameSaveText.length - 1] +

            gameSaveText[gameSaveText.length - 1]

        );

    });

    // 画像ファイルをStorageにアップロードする関数



    const homeFinalClick = () => {
        navigate("/");
    };
    const homeFinalCancel = () => {
        closeDialog();

    };

    const titleMaking = async (e: React.MouseEvent<HTMLButtonElement>) => {

        console.log(gameSaveText);

        setIsLoading(true);

        const response = JSON.parse(

            (

                await getAiMessage(

                    [

                        {

                            role: "system",

                            content:

                                "You are the writer who gives the title to the story. I write the story and you give the title in one word.",

                        },

                        {

                            role: "user",

                            content:

                                PrologueSaveText +

                                gameSaveText[1] +

                                PlayerChoiceText[1] +

                                gameSaveText[gameSaveText.length - 2] +

                                PlayerChoiceText[gameSaveText.length - 2] +

                                gameSaveText[gameSaveText.length - 1] +

                                gameSaveText[gameSaveText.length - 1],

                        },

                    ],

                    OpenAIEnv.TitleMaking

                )

            ).data.choices[0].message?.function_call?.arguments as string

        );



        console.log(response);

        console.log(response.Title);



        setTitle(response.Title);

        setTitle_imgURL(

            await generateImage(

                response.Describing_the_scenery_that_represents_the_story,

                768,

                512

            )

        );

        setIsLoading(false);

    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setTitle(e.target.value);

    };

    /*ここまでがタイトル作成の関数です。*/

    // データを送る関数

    const onClickAdd = async () => {

        if (title != "" && title_imgURL != "") {
            if (!sent) {
                try {

                    console.log(base64SaveText);

                    const idLength = 20;



                    // 生成するIDに含める文字

                    const idChars =

                        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";



                    let randomId = "";



                    for (var i = 0; i < idLength; i++) {

                        var randomChar = idChars.charAt(

                            Math.floor(Math.random() * idChars.length)

                        );

                        randomId += randomChar;

                    }

                    await setDoc(doc(db, usersCollectionName, saveEmail), {

                        email: saveEmail,

                        date: serverTimestamp(),

                    }); //ユーザーの情報

                    await setDoc(doc(db, gameDetailCollectionName, randomId), {

                        gameChoices: PlayerChoiceText,

                        gamePictures: base64SaveText,

                        gameTexts: gameSaveText,

                        Prologue: PrologueSaveText,

                        detailID: randomId,

                    });

                    await addDoc(collection(db, "game"), {

                        Title: title,

                        title_imgURL: title_imgURL,

                        charaName: playerName,

                        email: saveEmail,

                        date: serverTimestamp(),

                        detailID: randomId,

                    });



                    const querySnapshot = await getDocs(

                        query(

                            collection(db, "character"),

                            where("charaName", "==", playerName)

                        )

                    );



                    if (!querySnapshot.empty) {

                        const docId = querySnapshot.docs[0].id;

                        await updateDoc(doc(db, "character", docId), {

                            clearCount: increment(1),

                        });

                    } else {

                        await addDoc(collection(db, "character"), {

                            charaName: playerName,

                            chara_imgURL: PlayerCharacterImg,

                            prompt: PlayCharacterSaveText,

                            email: saveEmail,

                            clearCount: 1,

                        });

                    }
                    setSent(true);
                    openDialog();
                } catch (e) {

                    console.error("Error adding document: ", e);

                }
            } else {
                openDialog();
            }
        } else {

            alert("タイトルまたは、タイトルイメージがセットされていません。");

        }

    };

    const items = [];

    for (let i = 0; i < base64SaveText.length; i++) {

        items.push({

            type: "image",

            image: base64SaveText[i],

            text: gameSaveText[i],

        });

        items.push({ type: "choice", choice: PlayerChoiceText[i] });

    }

    return (

        <>

            <Box padding={10}>

                <Stack direction={"column"} spacing={5}>

                    <Box textAlign={"center"} fontSize={100}>

                        冒険の証

                    </Box>

                    <Stack>

                        <Box fontSize={25} textAlign={"start"} pt={5} pb={5}>

                            プロローグ：

                            <br />

                            {PrologueSaveText}

                        </Box>

                    </Stack>

                    {items.map((item, index) =>

                        // 配列の要素のタイプに応じて表示するコンポーネントを変える

                        item.type === "image" ? (

                            <Stack direction="row" key={index}>

                                <img src={item.image} alt="画像" width="400px" height="auto" />

                                <Box sx={gameText2Style} fontSize={20}>

                                    {item.text}

                                </Box>

                            </Stack>

                        ) : ( item.choice ? 

                            <Stack direction="row" key={index}>

                                <img

                                    src={PlayerCharacterImg}

                                    alt="character"

                                    width={100}

                                    height={100}

                                />

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

                                    {item.choice}

                                </Box>

                            </Stack>

                        : <></>)

                    )}

                </Stack>

                <Box fontSize={50} textAlign={"start"} paddingTop={25}>

                    ゲームタイトル作成：

                </Box>

                <Stack direction={"row"}>

                    <Box

                        sx={{

                            display: "flex",

                            alignItems: "center",

                            justifyContent: "center",

                            width: 650,

                            height: 560,

                            mt: 5,

                        }}

                    >

                        {isLoading ? (

                            <CircularProgress />

                        ) : (

                            <Box sx={{ width: "650px", height: "100%" }}>

                                {title_imgURL && <img src={title_imgURL} />}

                            </Box>

                        )}

                    </Box>

                    <Box padding={20}>

                        <Stack direction={"column"} spacing={5}>

                            <Button

                                sx={{

                                    width: "100",

                                    fontSize: "20px",

                                    bgcolor: "#4DC2B1",

                                    color: "white",

                                }}

                                onClick={titleMaking}

                            >

                                タイトル画像作成

                            </Button>

                            <TextField

                                label="タイトル"

                                variant="outlined"

                                onChange={handleChange}

                                sx={{

                                    width: 512,

                                    mr: 1,

                                    bgcolor: "white",

                                    borderRadius: "5px",

                                }}

                            />

                            <DecideButton tag="送信!" onClickHandler={() => onClickAdd()} />

                        </Stack>

                    </Box>

                </Stack>

            </Box>
            <Dialog>
                <RetireDialog></RetireDialog>
            </Dialog>
            <div className="App"></div>

        </>

    );
    function RetireDialog() {
        return (
            <div key="default">
                <Typography variant="h5" align="center" sx={{ mt: 3 }}>
                    {"ホームに戻りますか？"}
                </Typography>
                <Typography variant="h6" align="left" sx={{ mt: 3 }} color={""}>
                    {"※ 今回の冒険はすでに記録されています。"}
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

export default GameProof;


