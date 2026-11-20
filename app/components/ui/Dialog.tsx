"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import Image from "next/image";
import IconButton from "./IconButton";

type DialogProps = {
    open: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
};

export default function Dialog({
                                   open,
                                   title,
                                   onClose,
                                   children,
                               }: DialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) return;

        if (open && !dialog.open) {
            dialog.showModal();
        } else if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={titleId}
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
            className="m-auto w-[calc(100%_-_2rem)]
                max-w-[494px] max-h-[90dvh]
                overflow-y-auto rounded-hero
                border border-border bg-surface
                p-7 text-foreground backdrop:bg-black/60"
        >
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h2
                        id={titleId}
                        className="text-2xl font-semibold leading-[1.25]"
                    >
                        {title}
                    </h2>

                    <IconButton
                        aria-label="Close dialog"
                        onClick={onClose}
                    >
                        <Image
                            src="/icons/close.svg"
                            alt=""
                            width={20}
                            height={20}
                        />
                    </IconButton>
                </div>

                {children}
            </div>
        </dialog>
    );
}