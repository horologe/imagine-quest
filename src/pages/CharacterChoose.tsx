import React, {
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react"; // useEffectをインポートする import ChatArea from “…/components/ChatArea”; import { useNavigate } from “react-router-dom”; import Title from “./ImagineQuestWord.png”; import { Box, Button, Stack } from “@mui/material”; import { doc, getDocs, collection, query, where, } from “firebase/firestore”; import { db } from “…/firebase/firebase”;
import { useNavigate } from "react-router-dom";
import Title from "./ImagineQuestWord.png";
import { Box, Button, Stack, Grid } from "@mui/material";
import {
  getDocs,
  collection,
  query,
  where,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { emailContext } from "../App";
import { useCharacterContext } from "../App";
import { PlayCharacterContext } from "../App";
import { playCharacterImgContext } from "../App";
import { useCharacterIndexContext } from "../App";
import * as photos from "../screenPicture";
import { ImageToButton } from "./ImageToButton";

type charaProps = {
  playerName: string | null;
  setPlayerName: Dispatch<SetStateAction<string | null>>;
};
function CharacterChoose({ playerName, setPlayerName }: charaProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [characterArray, setCharacterArray] = useState<DocumentData[] | null>(
    null
  );
  const { saveEmail, setSaveEmail } = useContext(emailContext);
  const { useCharacter, setUseCharacter } = useContext(useCharacterContext);
  const { PlayCharacterSaveText, setPlayCharacterSaveText } =
    useContext(PlayCharacterContext);
  const { PlayerCharacterImg, setPlayerCharacterImg } = useContext(
    playCharacterImgContext
  );

  const { useCharacterIndex, setUseCharacterIndex } = useContext(
    useCharacterIndexContext
  );
  const [characterIndex, setCharacterIndex] = useState(0);
  const prevCharacter = () => {
    if (characterIndex > 0) {
      setCharacterIndex(characterIndex - 1);
    } else {
      return;
    }
    const newIndex = characterIndex - 1;
    const fetchGames = async () => {
      const characterRef = collection(db, "character");
      const q3 = query(characterRef, where("email", "==", saveEmail));
      const querySnapshot3 = await getDocs(q3);
      const characters = querySnapshot3.docs.map((doc) => doc.data());

      console.log(characters); // コンソールにデータを出力する
      setCharacterArray(characters); // stateを更新する
      const gameRef = collection(db, "game");
      if (characterArray != null) {
        const q = query(
          gameRef,
          where("charaName", "==", characterArray[newIndex].charaName)
        );

        const querySnapshot = await getDocs(q);
        // gamesの型をDocumentData[]にキャストする
        const games = querySnapshot.docs.map(
          (doc) => doc.data() as DocumentData
        );

        // gamesの中の日付が一番短い順にソートする
        games.sort((a, b) => a.date - b.date);

        // gamesの中のdetailIDと一緒な名前を持つgame_detailの中のドキュメント名だけを取り出す
        const detailRef = collection(db, "game_detail");
        // gamesの中のdetailIDを配列にする
        const detailIds = games.map((game) => game.detailID);
        // detailRefからdetailIdsに含まれるドキュメント名だけをクエリする
        const q2 = query(detailRef, where("detailID", "in", detailIds));
        const querySnapshot2 = await getDocs(q2);
        // ドキュメント名だけを配列にする
        // detailNamesの型をstring[]にキャストする
        const detailNames = querySnapshot2.docs.map(
          (doc) => doc.data() as DocumentData
        );
        console.log(detailIds);
        console.log(detailNames); // コンソールにデータを出力する
        // gamesとdetailNamesというstateを更新する
        setGames(games);
        setDetailNames(detailNames);
      }
    };
    fetchGames(); // 関数を呼び出す
  };

  // 次のキャラクターを表示する関数を定義
  const nextCharacter = () => {
    if (characterArray && characterIndex < characterArray.length - 1) {
      setCharacterIndex(characterIndex + 1);
    } else {
      return;
    }
    const newIndex = characterIndex + 1;
    const fetchGames = async () => {
      const characterRef = collection(db, "character");
      const q3 = query(characterRef, where("email", "==", saveEmail));
      const querySnapshot3 = await getDocs(q3);
      const characters = querySnapshot3.docs.map((doc) => doc.data());

      console.log(characters); // コンソールにデータを出力する
      setCharacterArray(characters); // stateを更新する
      const gameRef = collection(db, "game");
      if (characterArray != null) {
        const q = query(
          gameRef,
          where("charaName", "==", characterArray[newIndex].charaName)
        );

        const querySnapshot = await getDocs(q);
        // gamesの型をDocumentData[]にキャストする
        const games = querySnapshot.docs.map(
          (doc) => doc.data() as DocumentData
        );

        // gamesの中の日付が一番短い順にソートする
        games.sort((a, b) => a.date - b.date);

        // gamesの中のdetailIDと一緒な名前を持つgame_detailの中のドキュメント名だけを取り出す
        const detailRef = collection(db, "game_detail");
        // gamesの中のdetailIDを配列にする
        const detailIds = games.map((game) => game.detailID);
        // detailRefからdetailIdsに含まれるドキュメント名だけをクエリする
        const q2 = query(detailRef, where("detailID", "in", detailIds));
        const querySnapshot2 = await getDocs(q2);
        // ドキュメント名だけを配列にする
        // detailNamesの型をstring[]にキャストする
        const detailNames = querySnapshot2.docs.map(
          (doc) => doc.data() as DocumentData
        );
        console.log(detailIds);
        console.log(detailNames); // コンソールにデータを出力する
        // gamesとdetailNamesというstateを更新する
        setGames(games);
        setDetailNames(detailNames);
      }
    };
    fetchGames(); // 関数を呼び出す
  };

  // gamesとdetailNamesという変数をuseStateで宣言する
  // 初期値として空の配列を渡す
  const [games, setGames] = useState<DocumentData[]>([]);
  const [detailNames, setDetailNames] = useState<DocumentData[]>([]);

  useEffect(() => {
    // useEffectを使ってデータを取得する
    setCharacterIndex(useCharacterIndex);
    const fetchGames = async () => {
      console.log({useCharacterIndex, characterIndex})
      const characterRef = collection(db, "character");
      const q3 = query(characterRef, where("email", "==", saveEmail));
      const querySnapshot3 = await getDocs(q3);
      const characters = querySnapshot3.docs.map((doc) => doc.data());

      console.log(characters); // コンソールにデータを出力する
      setCharacterArray(characters); // stateを更新する
      const gameRef = collection(db, "game");
      if (characters.length) {
        const q = query(
          gameRef,
          where("charaName", "==", characters[0].charaName)
        );

        const querySnapshot = await getDocs(q);
        // gamesの型をDocumentData[]にキャストする
        const games = querySnapshot.docs.map(
          (doc) => doc.data() as DocumentData
        );

        // gamesの中の日付が一番短い順にソートする
        games.sort((a, b) => a.date - b.date);

        // gamesの中のdetailIDと一緒な名前を持つgame_detailの中のドキュメント名だけを取り出す
        const detailRef = collection(db, "game_detail");
        // gamesの中のdetailIDを配列にする
        const detailIds = games.map((game) => game.detailID);
        // detailRefからdetailIdsに含まれるドキュメント名だけをクエリする
        const q2 = query(detailRef, where("detailID", "in", detailIds));
        const querySnapshot2 = await getDocs(q2);
        // ドキュメント名だけを配列にする
        // detailNamesの型をstring[]にキャストする
        const detailNames = querySnapshot2.docs.map(
          (doc) => doc.data() as DocumentData
        );
        console.log(detailIds);
        console.log(detailNames); // コンソールにデータを出力する
        // gamesとdetailNamesというstateを更新する
        setGames(games);
        setDetailNames(detailNames);
      }
    };
    fetchGames(); // 関数を呼び出す
  }, []); // 空の配列を渡して最初のレンダリング時にのみ実行する
  const changeCharaLoading = (index: number) => {
    setCharacterIndex(index);
    const fetchGames = async () => {
      const characterRef = collection(db, "character");
      const q3 = query(characterRef, where("email", "==", saveEmail));
      const querySnapshot3 = await getDocs(q3);
      const characters = querySnapshot3.docs.map((doc) => doc.data());

      console.log(characters); // コンソールにデータを出力する
      // 非同期関数をsetCharacterArrayの外に移動する
      // characterArrayがnullでない場合
      if (characters != null) {
        const gameRef = collection(db, "game");
        const q = query(
          gameRef,
          where("charaName", "==", characters[index].charaName)
        );

        const querySnapshot = await getDocs(q);
        // gamesの型をDocumentData[]にキャストする
        const games = querySnapshot.docs.map(
          (doc) => doc.data() as DocumentData
        );

        // gamesの中の日付が一番短い順にソートする
        games.sort((a, b) => a.date - b.date);

        // gamesの中のdetailIDと一緒な名前を持つgame_detailの中のドキュメント名だけを取り出す
        const detailRef = collection(db, "game_detail");
        // gamesの中のdetailIDを配列にする
        const detailIds = games.map((game) => game.detailID);
        // detailRefからdetailIdsに含まれるドキュメント名だけをクエリする
        const q2 = query(detailRef, where("detailID", "in", detailIds));
        const querySnapshot2 = await getDocs(q2);
        // ドキュメント名だけを配列にする
        // detailNamesの型をstring[]にキャストする
        const detailNames = querySnapshot2.docs.map(
          (doc) => doc.data() as DocumentData
        );
        console.log(detailIds);
        console.log(detailNames); // コンソールにデータを出力する
        // gamesとdetailNamesというstateを更新する
        setGames(games);
        setDetailNames(detailNames);
      }
      // setCharacterArrayを呼び出す
      setCharacterArray(characters);
    };
    fetchGames(); // 関数を呼び出す
  };

  //Styles
  const primaryText = {
    fontSize: "30px",
    color: "#FFFFFF",
  };

  const seconderyText = {
    fontSize: "20px",
    color: "#9D9D9D",
  };
  const navigate = useNavigate();

  const adventureChoice = () => {
    if (characterArray != null) {
      setPlayCharacterSaveText(characterArray[characterIndex].charaName);
      setPlayerName(characterArray[characterIndex].charaName);
      setPlayerCharacterImg(characterArray[characterIndex].chara_imgURL);
      navigate("/WorldMaking");
    }
  };
  const characterChoice = () => navigate("/characterChoose");
  const home = () => navigate("/");

  return (
    <Stack
      direction="column"
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
          height: "80px",
          backgroundColor: "#333333",
          paddingTop: "8px",
          paddingLeft: "25px",
        }}
      >
        <Stack direction={"row"} justifyContent="space-between">
          <Stack direction={"row"} spacing={"50px"} marginTop={1}>
            <img src={photos.logo} alt={"logo"} height={60} />
            <Box>
              <ImageToButton
                src={photos.header_home}
                alt={"home"}
                onClick={home}
                height={36}
                width={95}
              />
            </Box>
            <Box>
              <Stack alignItems={"center"} spacing={1}>
                <ImageToButton
                  src={photos.header_charactar}
                  alt={"character"}
                  onClick={characterChoice}
                  height={36}
                  width={142}
                />
                <ImageToButton
                  src={photos.header_bar}
                  alt={"bar"}
                  onClick={home}
                  height={5}
                />
              </Stack>
            </Box>
          </Stack>
          <Box textAlign={"center"} marginRight={"80px"} marginTop={"15px"}>
            <Button
              style={{
                backgroundColor: "white",
                color: "black",
                fontSize: "15px",
                width: "120px",
                height: "80",
              }}
            >
              SignOut
            </Button>
          </Box>
        </Stack>
      </Box>
      <Stack
        paddingLeft={2}
        direction="row"
        spacing={2}
        sx={{ width: "100vw", height: "100vh", backgroundColor: "#4D4D4D" }}
      >
        {characterArray && characterArray.length > 0 && (
          <Stack
            direction="column"
            spacing={4}
            sx={{ width: 350, height: 450 }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "left",
                alignItems: "left",
                marginTop: "15px",
                height: "150px",
              }}
            >
              <Box paddingTop={2}>
                <ImageToButton
                  src={photos.sankaku2}
                  alt="left"
                  onClick={prevCharacter}
                  width={30}
                  height={90}
                />
              </Box>
              <Box>
                <img
                  src={characterArray[characterIndex].chara_imgURL}
                  alt="キャラクター画像"
                  width={140}
                  height={140}
                />
              </Box>
              <Box paddingTop={2}>
                <ImageToButton
                  src={photos.sankaku1}
                  alt="right"
                  onClick={nextCharacter}
                  width={30}
                  height={90}
                />{" "}
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
              }}
            >
              <Stack direction={"column"} spacing={2}>
                <CharaInfoText
                  label="NAME"
                  detail={characterArray[characterIndex].charaName}
                />
                <CharaInfoText label="冒険回数" detail="６回" />
                <CharaInfoText label="クリア回数" detail="４回" />
                <Box>
                  <Box sx={{ ...seconderyText }}>
                    <span style={{ marginLeft: "40px" }}>アイテム</span>
                  </Box>
                  <Box sx={{ ...primaryText }}>
                    <span style={{ marginLeft: "60px" }}>アイテムが並ぶ</span>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Stack>
        )}
        <Box
          sx={{ backgroundColor: "#1a1a1a", width: "100vw", height: "100vh" }}
        >
          <Stack
            direction="column"
            spacing={5}
            sx={{ width: 1000, height: 450 }}
          >
            <Box
              sx={{
                width: "80vw",
                height: "100%",
                backgroundColor: "#4D4D4D",
                padding: "15px 15px 15px 30px",
              }}
            >
              <Grid container spacing={2}>
                {characterArray &&
                  characterArray.map((character, index) => (
                    <Grid item key={index}>
                      <Box
                        bgcolor={
                          index === characterIndex ? "#4B5855" : undefined
                        }
                        paddingTop={2}
                        paddingLeft={2}
                        paddingRight={2}
                      >
                        <ImageToButton
                          src={character.chara_imgURL}
                          alt={`キャラクター ${index}`}
                          onClick={() => changeCharaLoading(index)}
                          width={60}
                          height={60}
                        />
                        <Box textAlign={"center"}>{character.charaName}</Box>
                      </Box>
                    </Grid>
                  ))}
              </Grid>
            </Box>

            <Stack
              direction="row"
              spacing={2}
              sx={{ width: 1000, height: 450 }}
            >
              <ImageToButton
                src={photos.inner2}
                alt="right"
                onClick={adventureChoice}
                width={200}
                height={200}
              />{" "}
              {/* ゲーム履歴*/}
              {games &&
                games.map((game) => (
                  <Box
                    sx={{
                      bgcolor: "#666666",
                      width: "182px",
                      height: "197px",
                      marginTop: "8px",
                      marginLeft: "58px",
                      borderRadius: "20px",
                    }}
                  >
                    <Stack
                      key={game.id}
                      direction="column"
                      spacing={0}
                      sx={{ width: 200, height: 200 }}
                    >
                      <Box
                        sx={{
                          height: "90px",
                          width: "182px",
                          backgroundColor: "brown",
                          borderTopLeftRadius: "20px",
                          borderTopRightRadius: "20px",
                        }}
                      ></Box>
                      {detailNames && <Box>{"タイトル"}</Box>}
                      <Box>{new Date(game.date).toLocaleDateString()}</Box>
                    </Stack>
                  </Box>
                ))}
              <Box
                sx={{
                  width: "182px",
                  height: "200px",
                  marginLeft: "20px",
                }}
              ></Box>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
}

export default CharacterChoose;

function CharaInfoText({ label, detail }: { label: string; detail: string }) {
  return (
    <Box>
      <Box sx={{ fontSize: "20px", color: "#B3B3B3" }}>
        <span style={{ marginLeft: "40px" }}>{label}</span>
      </Box>
      <Box sx={{ fontSize: "30px", color: "#FFFFFF" }}>
        <span style={{ marginLeft: "60px" }}>{detail}</span>
      </Box>
    </Box>
  );
}
