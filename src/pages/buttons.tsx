import { Button } from "@mui/material";

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
      onClick={() => onClickHandler()} // クリックイベントを設定する
    >
      {tag}
    </Button>
  );
}
