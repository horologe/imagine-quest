import { useEffect, useState, useContext } from "react";
import { Button, Box, Stack, Grid } from "@mui/material";
import { db } from "../firebase/firebase";
import { doc, setDoc, addDoc, collection, serverTimestamp, query, where, getDocs, DocumentData, updateDoc, increment } from "firebase/firestore";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { gameContext } from '../App';
import { PlayCharacterContext } from '../App';
import { PrologueContext } from "../App";
import { base64Context } from "../App";
import { choiceContext } from "../App";
import { playCharacterImgContext } from '../App';
import { emailContext } from "../App";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Storage用モジュール
import pica from 'pica';
import imageCompression from 'browser-image-compression';
import { getAiMessage, jp2en, generateImage } from '../lib/api';
import * as OpenAIEnv from "../lib/apienv"
import * as photos from "../screenPicture";
import { ImageToButton } from "./ImageToButton";
type AboutProps = {
    file: File | null;
    gameFile: File[] | null; // File[]に変更
    preview: string | null;
    playerName: string | null;
};
function GameProof({ file, preview, gameFile, playerName }: AboutProps) {
    const { PrologueSaveText, setPrologueSaveText } = useContext(PrologueContext);
    const { gameSaveText, setGameSaveText } = useContext(gameContext);
    const { base64SaveText, setbase64SaveText } = useContext(base64Context);
    const { PlayerChoiceText, setPlayerChoiceText } = useContext(choiceContext);
    const { PlayerCharacterImg, setPlayerCharacterImg } = useContext(playCharacterImgContext);
    const { PlayCharacterSaveText, setPlayCharacterSaveText } = useContext(PlayCharacterContext);
    const { saveEmail, setSaveEmail } = useContext(emailContext);
    const usersCollectionName = "users"; // usersコレクション名
    const gameDetailCollectionName = "game_detail"; // game_detailコレクション名
    const gameCollectionName = "game";
    const characterCollectionName = "character";
    const [characterArray, setCharacterArray] = useState<DocumentData[] | null>(
        null
    );
    const [email, setEmail] = useState('');
    const [nameText, setNameText] = useState<string>();
    const [gameChoices, setGameChoices] = useState<string[]>([]); // gameChoicesステート
    const [gamePictures, setGamePictures] = useState<string[]>([]); // gamePicturesステート
    const [gameTexts, setGameTexts] = useState<string[]>([]); // gameTextsステート
    const [charaName, setCharaName] = useState<string>('');
    const [chara_imgURL, setChara_imgURL] = useState<string>();
    const [title, setTitle] = useState('Adventure'); // Titleステート
    const [title_imgURL, setTitle_imgURL] = useState<string>('aa');
    const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); }
    const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => { setNameText(e.target.value); }
    const gameTextStyle = {
        m: 2,
        ml: 8.3,
        p: 2,
        width: 1300,
        height: 300,
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
    const pictureBoxStyle = {
        width: 450,
        height: 300,
    }
    const pictureStyle = {
        top: 0,
        left: 0,
        m: 2,
        p: 2,
        width: 450,
        height: 300,
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
        console.log(gameSaveText)
        console.log(PrologueSaveText + gameSaveText[1] + PlayerChoiceText[1] + gameSaveText[gameSaveText.length - 2] + PlayerChoiceText[gameSaveText.length - 2] + gameSaveText[gameSaveText.length - 1] + gameSaveText[gameSaveText.length - 1])

    })
    // 画像ファイルをStorageにアップロードする関数


    /*ここから*/
    const titleMaking = async (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(gameSaveText);
        const response = JSON.parse(((await getAiMessage([{
            role: "system",
            content: "You are the writer who gives the title to the story. I write the story and you give the title in one word."
        }, {
            role: "user",
            content: PrologueSaveText + gameSaveText[1] + PlayerChoiceText[1] + gameSaveText[gameSaveText.length - 2] + PlayerChoiceText[gameSaveText.length - 2] + gameSaveText[gameSaveText.length - 1] + gameSaveText[gameSaveText.length - 1]
        },], OpenAIEnv.TitleMaking)).data.choices[0].message?.function_call?.arguments as string));

        console.log(response);
        console.log(response.Title);

        setTitle(response.Title);
        setTitle_imgURL(await generateImage(response.Title, 768, 512))
    }

    /*ここまでがタイトル作成の関数です。Titleにはただのタイトル、["Describing the scenery that represents the story"]にゲームの概要の画像のプロンプト(日本語)が入ってると思うのでgenerateImage(768,512)もお願いします。適当な場所に表示させといて。*/
    // データを送る関数
    const onClickAdd = async () => {
        try {
            console.log(base64SaveText);
            const idLength = 20;

            // 生成するIDに含める文字
            const idChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            // 空のIDを用意
            let randomId = "";

            // IDの長さ分だけループ
            for (var i = 0; i < idLength; i++) {
                // 文字列からランダムな位置の文字を取得
                var randomChar = idChars.charAt(Math.floor(Math.random() * idChars.length));
                // IDに追加
                randomId += randomChar;
            }
            // usersコレクションにデータを送る
            await setDoc(doc(db, usersCollectionName, email), { name: nameText, date: serverTimestamp() });//ユーザーの情報
            // gamePicturesステートにURLをセット
            // ランダムなIDのドキュメントにデータを送る
            await setDoc(doc(db, gameDetailCollectionName, randomId), { Title: title, title_ImgURL: title_imgURL, gameChoices: PlayerChoiceText, gamePictures: base64SaveText, gameTexts: gameSaveText, Prologue: PrologueSaveText, detailID: randomId });//
            await addDoc(collection(db, "game"), { charaName: playerName, email: email, date: serverTimestamp(), detailID: randomId });
            // characterコレクションからcharaNameが一致するドキュメントを検索する
            const querySnapshot = await getDocs(query(collection(db, "character"), where("charaName", "==", playerName)));

            // ドキュメントが存在すれば、そのドキュメントのIDを取得する
            if (!querySnapshot.empty) {
                const docId = querySnapshot.docs[0].id;

                // updateDoc()メソッドを使って、そのドキュメントにclearCountというフィールドを追加または更新する
                // clearCountの値は任意ですが、ここではインクリメントする例を示します
                await updateDoc(doc(db, "character", docId), {
                    clearCount: increment(1)
                });
            } else {
                // ドキュメントが存在しなければ、addDoc()メソッドを使って、新しいドキュメントを作成する
                await addDoc(collection(db, "character"), {
                    charaName: playerName,
                    chara_imgURL: PlayerCharacterImg,
                    prompt: PlayCharacterSaveText,
                    email: saveEmail,
                    clearCount: 1
                });
            }
        }
        catch (e) { console.error("Error adding document: ", e); }
    }
    const items = [];
    for (let i = 0; i < base64SaveText.length; i++) {
        items.push({ type: "image", image: base64SaveText[i], text: gameSaveText[i] });
        items.push({ type: "choice", choice: PlayerChoiceText[i] });
    }
    return (
        <>
            <Stack>
                <Box sx={gameTextStyle} fontSize={20}>{PrologueSaveText}</Box>
                {items.map((item, index) => (
                    // 配列の要素のタイプに応じて表示するコンポーネントを変える
                    item.type === "image" ? (
                        <Stack direction="row" key={index}>
                            <Box component="img" sx={imageStyle} src={item.image} />
                            <Box sx={gameText2Style} fontSize={35}>{item.text}</Box>
                        </Stack>
                    ) : (
                        <Stack direction="row" key={index}>
                            <Box component="img" sx={{
                                ml: 10,
                                width: 400,
                                height: 350,
                                backgroundImage: `url(${preview})`,
                                backgroundSize: "cover",
                            }} src={PlayerCharacterImg} />
                            <Box sx={gameText2Style} fontSize={35}>{item.choice}</Box>
                        </Stack>
                    )
                ))}
            </Stack>
            <div className="App">
                <input type="text" value={email} onChange={onChangeEmail} placeholder="email" />
                <input type="text" value={nameText} onChange={onChangeName} placeholder="name" />
                <Button sx={gameTextStyle} onClick={titleMaking}>タイトル作成</Button>
                <Button sx={gameTextStyle} onClick={onClickAdd}>送信</Button>
                <Box>{title}</Box>
            </div>
            {title_imgURL && <img src={title_imgURL} />}

        </>

    );

}
export default GameProof;
