import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, createContext, useContext, useEffect } from "react";
// 各ページコンポーネントをインポート
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ContactAlpha from "./pages/ContactAlpha";
import GameProof from "./pages/GameProof";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login"; // Loginコンポーネントをインポートする
import PlayerChoice from "./pages/PlayerChoice";
import CharacterMaking from "./pages/CharacterMaking";
import CharacterChoose from "./pages/CharacterChoose";
import WorldMaking from "./pages/WorldMaking";
import { Navigate } from "react-router-dom"; // Navigateコンポーネントをインポートする
import Logout from "./pages/Logout";
import ProofDetail from "./pages/ProofDetail";
import * as firebase from "./firebase/firebase";

// contextの型を定義する
type PromptContextType = {
  PromptSaveText: string;
  setPromptSaveText: (text: string) => void;
};
type base64ContextType = {
  base64SaveText: string[];
  setbase64SaveText: (value: string[]) => void;
};
type PrologueContextType = {
  PrologueSaveText: string;
  setPrologueSaveText: (text: string) => void;
};

type gameContextType = {
  gameSaveText: string[];
  setGameSaveText: (value: string[]) => void;
};
type PlayerChoiceContextType = {
  PlayerChoiceText: string[];
  setPlayerChoiceText: (value: string[]) => void;
};
type PlayCharacterContextType = {
  PlayCharacterSaveText: string;
  setPlayCharacterSaveText: (text: string) => void;
};
type PlayCharacterImgContextType = {
  PlayerCharacterImg: string;
  setPlayerCharacterImg: (text: string) => void;
};
type emailContextType = {
  saveEmail: string;
  setSaveEmail: (text: string) => void;
};
type useCharacterContextType = {
  useCharacter: string;
  setUseCharacter: (text: string) => void;
};
type useCharacterIndexContextType = {
  useCharacterIndex: number;
  setUseCharacterIndex: (text: number) => void;
};

export const PlayCharacterPromptContext = createContext<PromptContextType>({
  PromptSaveText: "",
  setPromptSaveText: () => { },
});
export const PlayCharacterContext = createContext<PlayCharacterContextType>({
  PlayCharacterSaveText: "",
  setPlayCharacterSaveText: () => { },
});
// contextオブジェクトを作成するときに型とデフォルト値を渡す
export const PrologueContext = createContext<PrologueContextType>({
  PrologueSaveText: "",
  setPrologueSaveText: () => { },
});
export const choiceContext = createContext<PlayerChoiceContextType>({
  PlayerChoiceText: [],
  setPlayerChoiceText: () => { },
});
export const gameContext = createContext<gameContextType>({
  gameSaveText: [],
  setGameSaveText: () => { },
});
export const base64Context = createContext<base64ContextType>({
  base64SaveText: [],
  setbase64SaveText: () => { },
});
export const playCharacterImgContext =
  createContext<PlayCharacterImgContextType>({
    PlayerCharacterImg: "",
    setPlayerCharacterImg: () => { },
  });
export const emailContext = createContext<emailContextType>({
  saveEmail: "",
  setSaveEmail: () => { },
});
export const useCharacterContext = createContext<useCharacterContextType>({
  useCharacter: "",
  setUseCharacter: () => { },
});
export const useCharacterIndexContext =
  createContext<useCharacterIndexContextType>({
    useCharacterIndex: 0,
    setUseCharacterIndex: () => { },
  });
function App() {
  const [file, setFile] = useState<File | null>(null);
  const [gameFile, setGameFile] = useState<File[] | null>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string | null>("");
  const [PrologueSaveText, setPrologueSaveText] = useState<string>("");
  const [gameSaveText, setGameSaveText] = useState<string[]>([]);
  const [base64SaveText, setbase64SaveText] = useState<string[]>([]);
  const [PlayerChoiceText, setPlayerChoiceText] = useState<string[]>([]);
  const [PlayCharacterSaveText, setPlayCharacterSaveText] =
    useState<string>("");
  const [PlayerCharacterImg, setPlayerCharacterImg] = useState<string>("");
  const [useCharacterIndex, setUseCharacterIndex] = useState<number>(0);
  const [PromptSaveText, setPromptSaveText] = useState<string>("");
  const [saveEmail, setSaveEmail] = useState<string>("");
  const [useCharacter, setUseCharacter] = useState<string>("");
  // handleChangeFile関数を作成
  const handleChangeFile = (newFile: File | null) => {
    if (newFile) {
      setFile(newFile);
      setPreview(URL.createObjectURL(newFile));
    }
  };
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
  };

  // ログイン状態を管理する
  const [isAuth, setIsAuth] = useState<boolean>();
  useEffect(() => {
    firebase.auth.onAuthStateChanged(user => {
      setIsAuth(!!user);
      setSaveEmail(user?.email || "");
    })
  }, [])

  // ルート要素を決める)
  const rootElement = (
    <BrowserRouter>
      <useCharacterIndexContext.Provider
        value={{ useCharacterIndex, setUseCharacterIndex }}
      >
        <useCharacterContext.Provider value={{ useCharacter, setUseCharacter }}>
          <emailContext.Provider value={{ saveEmail, setSaveEmail }}>
            <choiceContext.Provider
              value={{ PlayerChoiceText, setPlayerChoiceText }}
            >
              <base64Context.Provider
                value={{ base64SaveText, setbase64SaveText }}
              >
                <PlayCharacterPromptContext.Provider
                  value={{ PromptSaveText, setPromptSaveText }}
                >
                  <playCharacterImgContext.Provider
                    value={{ PlayerCharacterImg, setPlayerCharacterImg }}
                  >
                    <PlayCharacterContext.Provider
                      value={{
                        PlayCharacterSaveText,
                        setPlayCharacterSaveText,
                      }}
                    >
                      <gameContext.Provider
                        value={{ gameSaveText, setGameSaveText }}
                      >
                        <PrologueContext.Provider
                          value={{ PrologueSaveText, setPrologueSaveText }}
                        >
                          <Routes>
                            {/* ログインしていない場合は"/"にアクセスしたときにLoginコンポーネントを表示する */}
                            {!isAuth && (
                              <Route
                                path="/"
                                element={<Login />}
                              />
                            )}
                            {/* ログインしている場合は"/login"にアクセスしたときにホーム画面にリダイレクトする */}
                            {isAuth && (
                              <Route
                                path="/login"
                                element={<Navigate to="/" />}
                              />
                            )}
                            {/* ログインしている場合は他のページコンポーネントを表示する */}
                            {isAuth && (
                              <>
                                <Route path="/" element={<Home />} />
                                <Route
                                  path="CharacterChoose"
                                  element={
                                    <CharacterChoose
                                      playerName={playerName}
                                      setPlayerName={setPlayerName}
                                    />
                                  }
                                />
                                <Route
                                  path="PlayerChoice"
                                  element={<PlayerChoice />}
                                />
                                <Route
                                  path="CharacterMaking"
                                  element={
                                    <CharacterMaking
                                      playerName={playerName}
                                      handleChangeName={handleChangeName}
                                    />
                                  }
                                />
                                <Route
                                  path="WorldMaking"
                                  element={<WorldMaking />}
                                />
                                <Route
                                  path="/about"
                                  element={
                                    <About
                                      file={file}
                                      preview={preview}
                                      playerName={playerName}
                                      handleChangeFile={handleChangeFile}
                                      handleChangeName={handleChangeName}
                                    />
                                  }
                                />
                                <Route
                                  path="/contact"
                                  element={
                                    <Contact
                                      preview={preview}
                                      playerName={playerName}
                                    />
                                  }
                                />
                                <Route
                                  path="/ContactAlpha"
                                  element={
                                    <ContactAlpha
                                      preview={preview}
                                      playerName={playerName}
                                    />
                                  }
                                />
                                <Route
                                  path="/GameProof"
                                  element={
                                    <GameProof
                                      file={file}
                                      preview={preview}
                                      gameFile={gameFile}
                                      playerName={playerName}
                                    />
                                  }
                                />
                                <Route
                                  path="/logout"
                                  element={<Logout setIsAuth={setIsAuth} />}
                                />
                              </>
                            )}
                            {/*<Route path="/proof" element={<Proof />} />*/}
                            <Route
                              path="/proof/:id"
                              element={<ProofDetail />}
                            />
                            <Route path="*" element={<NotFound />} />{" "}
                            {/* 404ページ */}
                          </Routes>
                        </PrologueContext.Provider>
                      </gameContext.Provider>
                    </PlayCharacterContext.Provider>
                  </playCharacterImgContext.Provider>
                </PlayCharacterPromptContext.Provider>
              </base64Context.Provider>
            </choiceContext.Provider>
          </emailContext.Provider>
        </useCharacterContext.Provider>
      </useCharacterIndexContext.Provider>
    </BrowserRouter>
  );

  return rootElement;
}
export default App;
