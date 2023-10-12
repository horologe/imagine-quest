import React, {
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react"; // useEffectをインポートする import ChatArea from “…/components/ChatArea”; import { useNavigate } from “react-router-dom”; import Title from “./ImagineQuestWord.png”; import { Box, Button, Stack } from “@mui/material”; import { doc, getDocs, collection, query, where, } from “firebase/firestore”; import { db } from “…/firebase/firebase”;
import { useDialog } from "../dialog";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Grid, Typography } from "@mui/material";
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
import { ImageToButton } from "./ui/ImageToButton";
import { HomeHeader } from "./ui/headers";

type charaProps = {
  playerName: string | null;
  setPlayerName: Dispatch<SetStateAction<string | null>>;
};
function CharacterChoose({ playerName, setPlayerName }: charaProps) {
  const { Dialog, open: openDialog, close: closeDialog } = useDialog();
  const [isStarted, setIsStarted] = useState(false);
  const [characterArray, setCharacterArray] = useState<DocumentData[] | null>(
    null
  );
  const [dialogWidth, setDialogWidth] = useState<number>(0);
  const [dialogHeight, setDialogHeight] = useState<number>(0);
  const [clearCountSave, setClearCount] = useState<string>("");
  const { saveEmail, setSaveEmail } = useContext(emailContext);
  const { useCharacter, setUseCharacter } = useContext(useCharacterContext);
  const { PlayCharacterSaveText, setPlayCharacterSaveText } =
    useContext(PlayCharacterContext);
  const { PlayerCharacterImg, setPlayerCharacterImg } = useContext(
    playCharacterImgContext
  );
  const [preservePictureBase64, setPreservePictureBase64] = useState<string[]>(
    []
  );
  const [preserveText, setPreserveText] = useState<string[]>([]);
  const [preserveChoices, setPreserveChoices] = useState<string[]>([]);
  const [prologueText, setPrologueText] = useState<string>("");
  const { useCharacterIndex, setUseCharacterIndex } = useContext(
    useCharacterIndexContext
  );
  const [detailID, setDetailID] = useState("");
  const handleStart = () => {
    navigate("/PlayerChoice");
  };
  const [characterIndex, setCharacterIndex] = useState(0);
  const dialogContent = (
    <div key="log">
      <Box sx={{ width: "965px", bgcolor: "#333333" }}>
        <Box height={2}></Box>
        <a href={window.location.host + "/proof/" + detailID}>共有用アドレス</a>
        <Stack>
          <Box fontSize={25} color="white" textAlign={"start"} pt={5} pb={5}>
            プロローグ：
            <br />
            {prologueText}
          </Box>
        </Stack>
        {preservePictureBase64.map((picture, index) => (
          <Stack spacing={2}>
            <Stack direction={"row"} spacing={2}>
              <img src={picture} alt="画像" width="400px" height="auto" />
              <Typography variant="body1" color={"white"}>
                {preserveText[index]}
              </Typography>
            </Stack>
            <Stack direction={"row"}>
              <Box paddingTop={4}>
                <img src={photos.vector} alt="vector" width={35} height={40} />
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
                {preserveChoices[index]}
              </Box>
            </Stack>

            <Box height={10}></Box>
          </Stack>
        ))}
      </Box>
    </div>
  );
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

      console.log(characters);
      setCharacterArray(characters);
      const gameRef = collection(db, "game");
      if (characterArray != null) {
        const q = query(
          gameRef,
          where("charaName", "==", characterArray[newIndex].charaName)
        );

        const querySnapshot = await getDocs(q);
        const games = querySnapshot.docs.map(
          (doc) => doc.data() as DocumentData
        );

        const detailRef = collection(db, "game_detail");
        const detailIds = games.map((game) => game.detailID);
        const q2 = query(detailRef, where("detailID", "in", detailIds));
        const querySnapshot2 = await getDocs(q2);
        const detailNames = querySnapshot2.docs.map(
          (doc) => doc.data() as DocumentData
        );
        console.log(detailIds);
        console.log(detailNames);
        setGames(games);
        setDetailNames(detailNames);
        setClearCount(JSON.stringify(characterArray[newIndex].clearCount));
      }
    };
    fetchGames();
  };

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

      console.log(characters);
      setCharacterArray(characters);
      const gameRef = collection(db, "game");
      if (characterArray != null) {
        const q = query(
          gameRef,
          where("charaName", "==", characterArray[newIndex].charaName)
        );

        const querySnapshot = await getDocs(q);
        const games = querySnapshot.docs.map(
          (doc) => doc.data() as DocumentData
        );

        games.sort((a, b) => a.date - b.date);

        const detailRef = collection(db, "game_detail");
        const detailIds = games.map((game) => game.detailID);
        const q2 = query(detailRef, where("detailID", "in", detailIds));
        const querySnapshot2 = await getDocs(q2);
        const detailNames = querySnapshot2.docs.map(
          (doc) => doc.data() as DocumentData
        );
        console.log(detailIds);
        console.log(detailNames);
        setGames(games);
        setDetailNames(detailNames);
        setClearCount(JSON.stringify(characterArray[newIndex].clearCount));
      }
    };
    fetchGames();
  };
  const [games, setGames] = useState<DocumentData[]>([]);
  const [detailNames, setDetailNames] = useState<DocumentData[]>([]);

  useEffect(() => {
    setCharacterIndex(useCharacterIndex);
    const fetchGames = async () => {
      console.log({ useCharacterIndex, characterIndex });
      const characterRef = collection(db, "character");
      const q3 = query(characterRef, where("email", "==", saveEmail));
      const querySnapshot3 = await getDocs(q3);
      const characters = querySnapshot3.docs.map((doc) => doc.data());

      console.log(characters);
      setCharacterArray(characters);
      const gameRef = collection(db, "game");
      if (characters.length) {
        const q = query(
          gameRef,
          where("charaName", "==", characters[0].charaName)
        );

        const querySnapshot = await getDocs(q);
        const games = querySnapshot.docs.map(
          (doc) => doc.data() as DocumentData
        );
        games.sort((a, b) => a.date - b.date);
        const detailRef = collection(db, "game_detail");
        const detailIds = games.map((game) => game.detailID);
        const q2 = query(detailRef, where("detailID", "in", detailIds));
        const querySnapshot2 = await getDocs(q2);
        const detailNames = querySnapshot2.docs.map(
          (doc) => doc.data() as DocumentData
        );
        console.log(detailIds);
        console.log(detailNames);
        setGames(games);
        setDetailNames(detailNames);
        setClearCount(JSON.stringify(characters[0].clearCount));
      } else {
        alert("このアカウントにはキャラクターが記録されていません。");
      }
    };
    fetchGames();
  }, []);
  const changeCharaLoading = (index: number) => {
    setCharacterIndex(index);
    const fetchGames = async () => {
      const characterRef = collection(db, "character");
      const q3 = query(characterRef, where("email", "==", saveEmail));
      const querySnapshot3 = await getDocs(q3);
      const characters = querySnapshot3.docs.map((doc) => doc.data());

      console.log(characters);
      if (characters != null) {
        const gameRef = collection(db, "game");
        const q = query(
          gameRef,
          where("charaName", "==", characters[index].charaName)
        );

        const querySnapshot = await getDocs(q);
        const games = querySnapshot.docs.map(
          (doc) => doc.data() as DocumentData
        );
        games.sort((a, b) => a.date - b.date);
        const detailRef = collection(db, "game_detail");
        const detailIds = games.map((game) => game.detailID);
        const q2 = query(detailRef, where("detailID", "in", detailIds));
        const querySnapshot2 = await getDocs(q2);
        const detailNames = querySnapshot2.docs.map(
          (doc) => doc.data() as DocumentData
        );
        console.log(detailIds);
        console.log(detailNames);
        setGames(games);
        setDetailNames(detailNames);
        setClearCount(JSON.stringify(characters[index].clearCount));
      }
      setCharacterArray(characters);
    };
    fetchGames();
  };
  const handleClick = (detailID: string) => {
    // detailNames配列からdetailIDと一致する要素を探す
    const detail = detailNames.find((d) => d.detailID === detailID);

    // 見つかったらその要素のプロパティを取得する
    if (detail) {
      const prologue = detail.Prologue;
      const gameChoices = detail.gameChoices;
      const gamePictures = detail.gamePictures;
      const gameTexts = detail.gameTexts;

      // 取得したプロパティを表示や処理する
      // 例えば、console.logで確認する
      setDetailID(detailID);
      setPrologueText(prologue);
      setPreservePictureBase64(gamePictures);
      setPreserveText(gameTexts);
      setPreserveChoices(gameChoices);
      console.log(prologue, gameChoices, gamePictures, gameTexts);
      setDialogWidth(1000);
      setDialogHeight(700);
      openDialog();
    }
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

  const background = {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#4D4D4D",
    overflowX: "hidden",
  };

  const RightBar = {
    display: "flex",
    justifyContent: "left",
    alignItems: "left",
    marginTop: "15px",
    height: "150px",
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
        background,
      }}
    >
      <HomeHeader isHome={false} />
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
                <CharaInfoText label="冒険回数" detail={clearCountSave} />
                <Box></Box>
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
              <CharaArray />
            </Box>

            <StoryArray />
          </Stack>
        </Box>
      </Stack>
      <Dialog width={dialogWidth} height={dialogHeight}>
        <Box
          sx={{
            width: 400,
            height: 270,
          }}
        >
          {dialogContent}
        </Box>
      </Dialog>
    </Stack>
  );

  function CharaArray() {
    return (
      <Grid container spacing={2} sx={{ width: 1000 }}>
        {characterArray &&
          characterArray.map((character, index) => (
            <Grid item key={index}>
              <Box
                bgcolor={index === characterIndex ? "#4B5855" : undefined}
                padding={1}
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
        <Box paddingTop={3} paddingLeft={2} paddingRight={2}>
          <ImageToButton
            src={photos.btn_newchar}
            alt={"新キャラ作成"}
            onClick={handleStart}
            height={60}
            width={60}
          />
          <Box textAlign={"center"}>{"新規作成"}</Box>
        </Box>
      </Grid>
    );
  }

  function StoryArray() {
    return (
      <Grid container spacing={2} sx={{ width: 1000, height: 450 }}>
        <Grid item>
          <ImageToButton
            src={photos.inner2}
            alt="right"
            onClick={adventureChoice}
            width={200}
            height={200}
          />
        </Grid>
        {games &&
          games.map((game) => (
            <Grid item key={game.id}>
              <Box
                onClick={() => handleClick(game.detailID)}
                sx={{
                  bgcolor: "#666666",
                  width: "182px",
                  height: "197px",
                  marginTop: "8px",
                  borderRadius: "20px",
                  textAlign: "center",
                }}
              >
                {detailNames && (
                  <>
                    <Box
                      sx={{
                        borderTopLeftRadius: "20px",
                        borderTopRightRadius: "20px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={game.title_imgURL}
                        alt="タイトル画像"
                        width={"100%"}
                      />
                    </Box>
                    <Box>{game.Title}</Box>
                  </>
                )}
              </Box>
            </Grid>
          ))}
        <Grid item sx={{ width: "182px", height: "200px" }} />
      </Grid>
    );
  }
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
