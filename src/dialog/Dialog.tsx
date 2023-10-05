import { useCallback, useEffect, useRef } from "react";
import { RemoveScroll } from "react-remove-scroll";

import classes from "./Dialog.module.css";

type Props = {
    isOpen: boolean;
    children: React.ReactNode | React.ReactNodeArray;
    onClose: VoidFunction;
    width?: number; // ダイアログの幅 
    height?: number; // ダイアログの高さ
};

export const Dialog: React.FC<Props> = ({
    isOpen,
    children,
    onClose, width, height,
}): React.ReactElement | null => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect((): void => {
        const dialogElement = dialogRef.current;
        if (!dialogElement) {
            return;
        }
        if (isOpen) {
            if (dialogElement.hasAttribute("open")) {
                return;
            }
            dialogElement.showModal();
        } else {
            if (!dialogElement.hasAttribute("open")) {
                return;
            }
            dialogElement.close();
        }
    }, [isOpen]);

    const handleClickDialog = useCallback(
        (): void => {
            onClose();
        },
        [onClose]
    );

    const handleClickContent = useCallback(
        (event: React.MouseEvent<HTMLDivElement>): void => {
            // clickイベントの伝搬を止める。
            event.stopPropagation();
        },
        []
    );

    // styleオブジェクトを作成する
    const style: React.CSSProperties = {
        width, // widthのpropsを設定する
        height, // heightのpropsを設定する
    };

    return (
        <RemoveScroll removeScrollBar enabled={isOpen}>
            <dialog
                className={classes["dialog"]}
                ref={dialogRef}
                onClick={handleClickDialog}
                style={style} // style属性にstyleオブジェクトを渡す
            >
                <div className={classes["content"]} onClick={handleClickContent}>
                    {children}
                </div>
            </dialog>
        </RemoveScroll>
    );

};
