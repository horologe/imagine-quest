import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Grid } from "@mui/material";
import * as photos from "../screenPicture";
import { ImageToButton } from "./ImageToButton";

function Home() {
  const navigate = useNavigate();
  const handleStart = () => {
    navigate("/PlayerChoice");
  };
  const characterChoice = () => {
    navigate("/characterChoose");
  };
  const home = () => {
    navigate("/");
  };

  return (
    <>
      {" "}
      <div>
        <Stack
          direction="column"
          sx={{
            width: "100vw",
            height: "100vh",
            backgroundImage: `url(${photos.background2})`,
            backgroundSize: "cover",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "sticky",
              top: 0,
              width: "100vw",
              height: "80px",
              backgroundColor: "#333333",
              padding: "8px 0 0 25px",
              zIndex: 1,
            }}
          >
            <Stack direction={"row"} justifyContent="space-between">
              <Stack direction={"row"} spacing={"50px"} marginTop={1}>
                <img src={photos.logo} alt={"logo"} height={60} />
                <Box>
                  <Stack alignItems={"center"} spacing={1}>
                    <ImageToButton
                      src={photos.header_home}
                      alt={"home"}
                      onClick={home}
                      height={36}
                      width={95}
                    />
                    <ImageToButton
                      src={photos.header_bar}
                      alt={"bar"}
                      onClick={home}
                      height={5}
                    />
                  </Stack>
                </Box>
                <Box>
                  <ImageToButton
                    src={photos.header_charactar}
                    alt={"character"}
                    onClick={characterChoice}
                    height={36}
                    width={142}
                  />
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
                  onClick={() => navigate("/logout")}
                >
                  SignOut
                </Button>
              </Box>
            </Stack>
          </Box>
          <Box marginTop={30}>
            <Stack direction={"row"}>
              <Box
                sx={{
                  width: "50vw",
                  height: "50vw",
                  marginLeft: "88px",
                  paddingTop: "15px",
                }}
              >
                <img src={photos.logo} alt="title" width="600" />
              </Box>
              <Stack direction={"row"} spacing={"50px"}>
                <CustomButton
                  btnName={photos.icon_charactar}
                  btnAlt="icon_character"
                  onClickHandler={characterChoice}
                  imgWidth={120}
                  title="既存のキャラクター"
                  subTitle="で遊ぶ"
                />
                <CustomButton
                  btnName={photos.btn_newchar}
                  btnAlt="newChara"
                  onClickHandler={handleStart}
                  imgWidth={125}
                  title="新規のキャラクター"
                  subTitle="を作成して遊ぶ"
                />
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </div>
    </>
  );
}

export default Home;

function CustomButton({
  btnName,
  btnAlt,
  onClickHandler,
  imgWidth,
  title,
  subTitle,
}: {
  btnName: string;
  btnAlt: string;
  onClickHandler: () => void;
  imgWidth: number;
  title: string;
  subTitle: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleButtonClick = () => {
    onClickHandler();
  };

  const buttonStyle = {
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    backgroundColor: isHovered ? "#4B5855" : "transparent",
  };

  return (
    <Stack direction={"column"} textAlign={"center"}>
      <Box
        style={buttonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        borderRadius="10px 10px 0 0"
        paddingTop={1}
      >
        <ImageToButton
          src={btnName}
          alt={btnAlt}
          onClick={handleButtonClick}
          height={120}
          width={imgWidth}
        />
      </Box>
      <Box
        onClick={handleButtonClick}
        style={buttonStyle}
        padding={1}
        borderRadius="0 0 10px 10px"
      >
        <span style={{ fontSize: "25px" }}>{title}</span>
        <br />
        <span style={{ fontSize: "20px" }}>{subTitle}</span>
      </Box>
    </Stack>
  );
}
