//#region import

import React, { useEffect, useState } from 'react';
import '../App.css';
import '../GameScreen.css';
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

} from "@mui/material";//ReactのUI使えるライブラリ
import ExampleImage from "./exampleImage.png";//写真。
import { useDialog } from "../dialog";
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
function ContactAlpha({ preview, playerName }: AboutProps) {
    //#region useState
    const { Dialog, open: openDialog, close: closeDialog } = useDialog();
    const [choices, setChoices] = useState<string[]>(['(choices1)画面二つ目になったよー', '(choices2)あ、chatGPTのリアルタイムで文字出るオプション', '(choices3)つけておいてーあれあったらだいぶ助かる', '(choice4)']);
    const [content, setContent] = useState<string>("多分背景描写？");//chatGPTから来た背景描写がここに入るんかな?と思ったのでBoxの中に書かれるようにしてます
    const [inputText, setInputText] = useState<string>("");//このinputTextに打ち込まれた文字が入る
    const [pictureBase64, setPictureBase64] = useState<string>(""); //ここにpictureBase64のString入れてください
    const [choicesNumber, setChoicesNumber] = useState<number>(0);
    const [isGameClear, setIsGameClear] = useState<boolean>(false);
    //#endregion
    /*
    useEffect(() => {
        getAiMessage([
            { role: "system", content: "hello" }
        ]).then(setContent)
    }, [])
*/
    // #region Text&BoxStyles

    const outerBoxStyle = {
        height: 480,
        color: "white",
        background: "black",
    };
    const outerBoxStyle2 = {
        height: 250,
        color: 'white',
        background: 'black',
        display: 'flex',
        flexDirection: 'row'
    }

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
    const playerNameBox = {
        width: 120,
        height: 50,
        color: 'white',
        background: 'black',
        border: 2,
    }
    const playerBoxStyle = {
        mt: 8,
        ml: 17,
        width: 200,
        height: 200,
        color: 'white',
        background: 'black',
        border: 2
    }
    const choicesBoxStyle = {
        mt: 8,
        ml: 7.1,
        width: 250,
        height: 100,
        color: 'white',
        background: 'black',
        border: 2
    }
    const choicesBoxStyle2 = {
        mt: 8,
        ml: 12.25,
        width: 250,
        height: 100,
        color: 'white',
        background: 'black',
        border: 2
    }
    const textFieldBox = {
        mt: -9.5,
        ml: 54.5,
        width: 875,
        height: 90,
        color: 'black',
        background: 'white',
        label: "Standard",
        variant: "standard",
        display: "flex",
        border: 2
    }
    // #endregion
    //#region handle操作

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
    };//テキストフィールドの入力を検知してテキストフィールドの中身をsetTextする

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(inputText);
        openDialog();
        setChoices(
            choices.map((createText: string, index: number) => (index === 3 ? inputText : createText))
        );
    };//コンソール画面でtextが変更されてることを確認可能
    const navigate = useNavigate();
    const handleDecision = (e: React.MouseEvent<HTMLButtonElement>) => {//この関数がユーザーが選択肢を決定した時に動く関数です。
        //プロンプト例:"私は${choices[choicesNumber]}を選びます。次の描写および3つの選択肢をJSON形式で出力してください。(ここFunction Calling使ったら文面変わるかも?)
        /*chatGPTにメッセージ送るのが多分この部分かな。choices[choicesNumber]にプレイヤーの選択肢が入ってます。*/

        navigate("/contact");
    }
    // #endregion

    return (
        <div className="background" style={{ height: "100vh" }}>
            <Container maxWidth="xl" sx={{ display: "flex", justifyContent: "center" }}>
                <Stack direction="row" sx={outerBoxStyle}>
                    <Box sx={pictureBoxStyle}>
                        <Box sx={pictureStyle}>Picture</Box>
                        <Box component="img" sx={imageStyle} alt="写真の説明" src={pictureBase64} />
                        {/* <Box component="img" sx={imageStyle} alt="写真の説明" src={ExampleImage} />*/}
                    </Box>
                    <Box sx={gameTextStyle}>
                        <div id="gameText">{content}</div>
                    </Box>
                </Stack>
            </Container>
            <Container maxWidth="xl">
                <Box sx={outerBoxStyle2}>

                    <Box sx={playerBoxStyle}>
                        <Box sx={{ ...playerNameBox, fontSize: 15, textAlign: "center" }}>{playerName}</Box><Box
                            sx={{
                                ml: 3,
                                width: 145,
                                height: 145,
                                backgroundImage: `url(${preview})`,
                                backgroundSize: "cover",
                            }}
                        /></Box>
                    <section>

                        <Box
                            onClick={openDialog}
                            sx={choicesBoxStyle2}>
                            選択肢1
                            <div onMouseEnter={() => setChoicesNumber(0)}>
                                <Grid container>
                                    <Grid item xs={3}>
                                        {(choicesNumber == 0 && <TriangleIcon sx={{ fontSize: 35, ml: 1.5, mt: 2 }} />)}
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography color="white">
                                            {choices[0]}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </div>

                        </Box>

                    </section>
                    <Box sx={choicesBoxStyle}
                        onClick={openDialog}>
                        選択肢2
                        <div onMouseEnter={() => setChoicesNumber(1)}>
                            <Grid container>
                                <Grid item xs={3}>
                                    {(choicesNumber == 1 && <TriangleIcon sx={{ fontSize: 35, ml: 1.5, mt: 2 }} />)}
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography color="white">
                                        {choices[1]}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                    </Box>
                    <Box
                        sx={choicesBoxStyle}
                        onClick={openDialog}>
                        選択肢3
                        <div onMouseEnter={() => setChoicesNumber(2)}>
                            <Grid container>
                                <Grid item xs={3}>
                                    {(choicesNumber == 2 && <TriangleIcon sx={{ fontSize: 35, ml: 1.5, mt: 2 }} />)}
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography color="white">
                                        {choices[2]}
                                    </Typography>
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
                            required multiline sx={{
                                display: "flex",
                                color: "white",
                                maxWidth: 700,
                                flexGrow: 1,
                                '& .MuiInput-underline:before': {
                                    borderBottomColor: '#ffffff', // 通常時のボーダー色
                                },
                                backgroundColor: "black", borderColor: "white", borderWidth: 2, borderStyle: "solid"
                            }}
                            inputProps={{ style: { color: "white", borderWidth: "3px" } }}
                            FormHelperTextProps={{ style: { color: "white", fontSize: 15 } }}
                        />
                        <Button
                            onClick={handleClick}
                            color="primary"
                            sx={{ mr: "2", height: 80, display: "flex", alignSelf: "center", border: "0.5px solid white" }}
                            style={{ color: 'white', backgroundColor: 'black' }}
                        >作成</Button>

                    </Box>
                </div>
            </Container >

            <Dialog>

                <Box
                    sx={{
                        width: 400,
                        height: 270
                    }}
                >
                    <Typography variant="h5" align="left">
                        {`あなたは選択肢${choicesNumber + 1}`}
                    </Typography>
                    <Typography variant="h5" align="center" sx={{ mt: 3 }}>
                        {`『${choices[choicesNumber]}』`}
                    </Typography>
                    <Typography variant="h5" align="left" sx={{ mt: 3 }}>
                        {`を選んでいます。 `}
                    </Typography>
                    <Typography variant="h5" align="left" >
                        {`その選択でよろしいですか？`}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-around", mt: 4 }}>
                        <Button variant="contained" color="error" onClick={handleDecision} sx={{ width: 100 }}>
                            はい
                        </Button>
                        <Button variant="contained" color="primary" onClick={closeDialog} sx={{ width: 100 }}>
                            いいえ
                        </Button>
                    </Box>
                </Box>

            </Dialog>
        </div>
    );
}
export default ContactAlpha;
