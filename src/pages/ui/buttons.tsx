import { Button, Box } from "@mui/material";
import React, { useState } from "react";

export function DecideButton({
  tag,
  onClickHandler,
}: {
  tag: string;
  onClickHandler: () => void;
}) {
  return (
    <Button
      sx={{
        background: "#FFFFFF",
        textAlign: "center",
        width: "250px",
        height: "100px",
        fontSize: "30px",
        color: "#4DC2B1",
      }}
      onClick={() => onClickHandler()}
    >
      {tag}
    </Button>
  );
}

export function RightGreenButton({
  tag,
  onClickHandler,
}: {
  tag: string;
  onClickHandler: () => void;
}) {
  return (
    <Button
      onClick={onClickHandler}
      variant="contained"
      sx={{
        fontSize: "30px",
        mt: 2,
        backgroundColor: "#4DC2B1",
        "&:hover": {
          backgroundColor: "#4B5855",
        },
      }}
    >
      {tag}
    </Button>
  );
}

export function LogInButton({
  tag,
  bgColor,
}: {
  tag: string;
  bgColor: string;
}) {
  return (
    <Button
      type="submit"
      sx={{
        width: "100%",
        height: "55px",
        bgcolor: bgColor,
        textAlign: "center",
        "&:hover": {
          bgcolor: bgColor,
        },
      }}
    >
      <Box fontSize={20} color={"white"} textAlign={"center"}>
        {tag}
      </Box>
    </Button>
  );
}

export function MiniButton({
  bgColor,
  tag,
  onClickHandler,
}: {
  bgColor: string;
  tag: string;
  onClickHandler: () => void;
}) {
  return (
    <Box paddingTop={3}>
      <Button
        sx={{
          background: bgColor,
          textAlign: "center",
          width: "100px",
          height: "50px",
          fontSize: "20px",
          color: "#FFFFFF",
        }}
        onClick={() => onClickHandler()}
      >
        {tag}
      </Button>
    </Box>
  );
}

export function IconButton({
  src,
  width,
  height,
  bgColor,
  tag,
  tag2,
  onClickHandler,
}: {
  src: string;
  width: string;
  height: string;
  bgColor: string;
  tag: string;
  tag2?: string;
  onClickHandler: () => void;
}) {
  return (
    <Box
      sx={{
        mt: 3,
        backgroundColor: bgColor,
        borderRadius: "20%",
        textAlign: "center",
        padding: "10px 30px 10px 30px",
        "&:hover": {
          backgroundColor: bgColor,
          opacity: [0.9, 0.8, 0.7],
        },
      }}
    >
      <Box onClick={onClickHandler}>
        <img src={src} alt={tag} width={width} height={height} />
        <Box>{tag}</Box>
        <Box>{tag2}</Box>
      </Box>
    </Box>
  );
}
