import { useCallback, useState } from "react";

import { Dialog as Component } from "./Dialog";

type Props = Omit<
    Parameters<typeof Component>[0],
    "isOpen" | "onClose" | "rootElement"
>;

type Result = {
    open: VoidFunction;
    close: VoidFunction;
    Dialog: React.FC<Props>;
};

export const useDialog = (): Result => {
    const [isOpen, setOpen] = useState<boolean>(false);

    const open: VoidFunction = useCallback((): void => {
        setOpen(true);
    }, []);

    const close: VoidFunction = useCallback((): void => {
        setOpen(false);
    }, []);

    const Dialog: React.FC<Props> = useCallback(
        (props: Props): React.ReactElement => {
            return <Component isOpen={isOpen} onClose={close} {...props} />;
        },
        [close, isOpen]
    );

    return { open, close, Dialog };
};
