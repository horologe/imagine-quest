import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { Box, Button, Stack, TextField } from "@mui/material";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase/firebase";
import { UserCredential } from "firebase/auth";

import { emailContext } from "../App";
import * as photos from "../screenPicture";

import { createTheme, ThemeProvider } from "@mui/material";
import { LogInButton } from "./ui/buttons";

type LoginProps = {
    setIsAuth: (isAuth: boolean) => void;
};

const theme = createTheme({
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderWidth: "3px",
                    color: "white",
                },
                input: {
                    fontWeight: "bold",
                    borderWidth: "3px",
                    color: "white",
                },
                notchedOutline: {
                    borderWidth: "3px",
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
        signInWithEmailAndPassword(auth, loginEmail, loginPassword)
            .then((result: UserCredential) => {
                console.log(result);
                localStorage.setItem("isAuth", "true");
                localStorage.setItem("email", saveEmail)
                setIsAuth(true);
                console.log(saveEmail);
                navigate("/");
            })
            .catch((error: Error) => {
                setError("メールアドレスまたはパスワードが違います。");
            });
    };

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
                console.log(result);
                localStorage.setItem("isAuth", "true");
                setIsAuth(true);
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
                        {/* メールとパスワードを入力させるためのフォーム */}
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
                                    <LogInButton tag="ログイン" bgColor="#A8BF54" />
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
                                    <LogInButton tag="新規登録" bgColor="#5AC4CC" />
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
