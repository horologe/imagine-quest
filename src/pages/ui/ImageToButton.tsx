import React, { FC, useState } from "react";
import { Button } from "@mui/material";
type ImageToButtonProps = {
  src: string;
  alt: string;
  onClick: () => void;
  width?: number;
  height?: number;
  changeColor?: boolean | undefined;
};
export const ImageToButton: FC<ImageToButtonProps> = ({
  src,
  alt,
  onClick,
  width = 150,
  height = 50,
  changeColor = false,
}) => {
  const [buttonColor, setButtonColor] = useState("");
  const handleClick = () => {
    if (changeColor) {
      const colors = "#4682b4";
      setButtonColor(colors);
    }
    onClick();
  };

  return (
    <Button
      onClick={handleClick}
      style={{
        backgroundColor: buttonColor,
        width: width,
        height: height,
        zIndex: 0,
      }}
    >
      {" "}
      <img src={src} alt={alt} width={width} height={height} />{" "}
    </Button>
  );
};
