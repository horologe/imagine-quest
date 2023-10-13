import { Box, Button, Stack } from "@mui/material";
import { ImageToButton } from "./ImageToButton";
import * as photos from "../../screenPicture";
import { useNavigate } from "react-router-dom";

export function HomeHeader({ isHome }: { isHome: boolean }) {
  const navigate = useNavigate();

  const home = () => {
    navigate("/");
  };

  const characterChoice = () => {
    navigate("/characterChoose");
  };

  return (
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
              {isHome ? (
                <ImageToButton
                  src={photos.header_bar}
                  alt={"bar"}
                  onClick={home}
                  height={5}
                  width={95}
                />
              ) : (
                <></>
              )}
            </Stack>
          </Box>
          <Box>
            <Stack alignItems={"center"} spacing={1}>
              <ImageToButton
                src={photos.header_character}
                alt={"character"}
                onClick={characterChoice}
                height={36}
                width={142}
              />
              {isHome ? (
                <></>
              ) : (
                <ImageToButton
                  src={photos.header_bar}
                  alt={"bar"}
                  onClick={home}
                  height={5}
                  width={142}
                />
              )}
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
            onClick={() => navigate("/logout")}
          >
            SignOut
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

export function NomalHeader({
  navigateTo,
  pageName,
}: {
  navigateTo: () => void;
  pageName: string;
}) {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "70px",
        backgroundColor: "#333333",
        paddingTop: "8px",
        paddingLeft: "25px",
      }}
    >
      <Stack direction={"row"} spacing={3}>
        <ImageToButton
          src={photos.back}
          alt={"home"}
          onClick={navigateTo}
          height={60}
          width={60}
        />
        <Box fontSize={30} paddingTop={0.8}>
          {pageName}
        </Box>
      </Stack>
    </Box>
  );
}
