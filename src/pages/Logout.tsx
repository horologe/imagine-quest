import { signOut } from "firebase/auth";
import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
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
import * as photos from "../screenPicture";

type LogoutProps = {
    setIsAuth: (isAuth: boolean) => void;
};
const Logout = ({ setIsAuth }: LogoutProps) => {
    const navigate = useNavigate();
    const logout = () => {
        // ログアウト
        signOut(auth).then(() => {
            // ローカルストレージからisAuth削除
            localStorage.clear();
            setIsAuth(false); //状態を変更
        });
        // ログインにとばす
        navigate("/login");
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
            <p>ログアウトしますか？</p>
            {/* メールとパスワードを入力させるためのフォームを作る */}
              <form onSubmit={logout}>
                <Stack direction={"column"} spacing={1}>
                  <Box height={55} bgcolor={"#A8BF54"} textAlign={"center"}>
                    <Button type="submit">
                      <Box fontSize={20} color={"white"} textAlign={"center"}>
                        ログアウト
                      </Box>
                    </Button>
                  </Box>
                </Stack>
              </form>
          </Stack>
        </Box>
      </Stack>
    </div>
    );
};

export default Logout;