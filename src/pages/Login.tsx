import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  Box,
  Button,
  ButtonBase,
  Stack,
  TextField,
  Grid,
  Typography,
  Fab,
} from "@mui/material";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase/firebase";
import { UserCredential } from "firebase/auth";

import { emailContext } from "../App";
import * as photos from "../screenPicture";

import { createTheme, ThemeProvider } from "@mui/material";
// propsの型を定義する
type LoginProps = {
  setIsAuth: (isAuth: boolean) => void;
};

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // ルート要素のスタイル
          borderWidth: "3px",
          color: "white",
        },
        input: {
          fontWeight: "bold",
          borderWidth: "3px",
          color: "white",
        },
        notchedOutline: {
          // 枠線要素のスタイル
          borderWidth: "3px", // 枠線の太さを3pxにする
          color: "white",
        },
      },
    },
  },
});

const Login = ({ setIsAuth }: LoginProps) => {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [signupEmail, setSignupEmail] = useState<string>("");
  const [signupPassword, setSignupPassword] = useState<string>("");
  const { saveEmail, setSaveEmail } = useContext(emailContext);
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const handleLoginEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginEmail(e.target.value);
  };

  const handleLoginPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoginPassword(e.target.value);
  };

  const handleSignupEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupEmail(e.target.value);
  };

  const handleSignupPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSignupPassword(e.target.value);
  };

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ページ遷移を防ぐ

    if (!loginEmail && !loginPassword) {
      setError("メールアドレスとパスワードを入力してください。");
      return;
    } else {
      if (!loginEmail) {
        setError("メールアドレスを入力してください。");
        return;
      }
      if (!loginPassword) {
        setError("パスワードを入力してください。");
        return;
      }
    }

    setSaveEmail(loginEmail);
    // FirebaseのAuthenticationにメールとパスワードを渡してログインする
    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      .then((result: UserCredential) => {
        // ログイン成功時の処理
        console.log(result);
        // ローカルストレージに状態を保持
        localStorage.setItem("isAuth", "true");
        setIsAuth(true); //ログインしたらtrueにする
        // homeにとばす
        navigate("/");
      })
      .catch((error: Error) => {
        // ログイン失敗時の処理
        setError("メールアドレスまたはパスワードが違います。");
      });
  };
  // FirebaseのAuthenticationでメールとパスワードを使って新規登録するための関数を作る
  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!signupEmail && !signupPassword) {
      setError("メールアドレスとパスワードを入力してください。");
      return;
    } else {
      if (!signupEmail) {
        setError("メールアドレスを入力してください。");
        return;
      }
      if (!signupPassword) {
        setError("パスワードを入力してください。");
        return;
      }
    }
    createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      .then((result: UserCredential) => {
        // 新規登録成功時の処理
        console.log(result);
        // ローカルストレージに状態を保持
        localStorage.setItem("isAuth", "true");
        setIsAuth(true); //ログインしたらtrueにする
        // homeにとばす
        navigate("/");
      })
      .catch((error: Error) => {
        alert(error);
      });
  };

  return (
    <div>
      <Stack
        direction="column"
        alignItems={"center"}
        justifyContent={"center"}
        sx={{
          width: "100vw",
          height: "100vh",
          backgroundImage: `url(${photos.background2})`,
          backgroundSize: "cover",
          overflow: "hidden",
        }}
      >
        <Box bgcolor={"#333333"} padding={"20px"}>
          <Stack direction={"column"}>
            <Box paddingLeft={5}>
              <img src={photos.logo} alt="title" width="500" />
            </Box>
            {/* メールとパスワードを入力させるためのフォームを作る */}
            {isLogin ? (
              <form onSubmit={handleSubmit}>
                <Stack direction={"column"} spacing={1}>
                  <CustomInputBox
                    label="メールアドレス"
                    type="email"
                    id="email"
                    value={loginEmail}
                    onChange={handleLoginEmailChange}
                  />
                  <CustomInputBox
                    label="パスワード"
                    type="password"
                    id="password"
                    value={loginPassword}
                    onChange={handleLoginPasswordChange}
                  />
                  {error && (
                    <Box mt={2} textAlign="center" style={{ color: "#e04736" }}>
                      {error}
                    </Box>
                  )}
                  <Box height={40}></Box>
                  <Box height={55} bgcolor={"#A8BF54"} textAlign={"center"}>
                    <Button type="submit">
                      <Box fontSize={20} color={"white"} textAlign={"center"}>
                        ログイン
                      </Box>
                    </Button>
                  </Box>
                  <Box height={55} textAlign={"center"}>
                    <Button onClick={handleToggleForm}>
                      <Box fontSize={20} color={"white"} textAlign={"center"}>
                        新規登録
                      </Box>
                    </Button>
                  </Box>
                </Stack>
              </form>
            ) : (
              <form onSubmit={handleSignUp}>
                <Stack direction={"column"} spacing={1}>
                  <CustomInputBox
                    label="メールアドレス"
                    type="email"
                    id="email"
                    value={signupEmail}
                    onChange={handleSignupEmailChange}
                  />
                  <CustomInputBox
                    label="パスワード"
                    type="password"
                    id="password"
                    value={signupPassword}
                    onChange={handleSignupPasswordChange}
                  />
                  {error && (
                    <Box mt={2} textAlign="center" style={{ color: "#e04736" }}>
                      {error}
                    </Box>
                  )}
                  <Box height={40}></Box>
                  <Box height={55} bgcolor={"#5AC4CC"} textAlign={"center"}>
                    <Button type="submit">
                      <Box fontSize={20} color={"white"} textAlign={"center"}>
                        新規登録
                      </Box>
                    </Button>
                  </Box>
                  <Box height={55} textAlign={"center"}>
                    <Button onClick={handleToggleForm}>
                      <Box fontSize={20} color={"white"} textAlign={"center"}>
                        ログイン
                      </Box>
                    </Button>
                  </Box>
                </Stack>
              </form>
            )}
          </Stack>
        </Box>
      </Stack>
    </div>
  );
};

export default Login;

function CustomInputBox({
  label,
  type,
  id,
  value,
  onChange,
}: {
  label: string;
  type: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Box>
      <Box fontSize={20}>{label}</Box>
      <ThemeProvider theme={theme}>
        <TextField
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          fullWidth
          margin="normal"
          variant="outlined"
          InputProps={{
            style: {
              backgroundColor: "#1a1a1a",
              borderRadius: "0px",
            },
          }}
        />
      </ThemeProvider>
    </Box>
  );
}
