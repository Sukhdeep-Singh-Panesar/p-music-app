"use client";

import Image from "next/image";
import Dialog from "./ui/Dialog";
import Input from "./ui/Input";
import Button from "./ui/Button";

type CreatePlaylistDialogProps = {
    open: boolean;
    name: string;
    onNameChange: (name: string) => void;
    onClose: () => void;
    onCreate: () => void;
    isCreating: boolean;
    error: string;
};

export default function CreatePlaylistDialog({
                                                 open,
                                                 name,
                                                 onNameChange,
                                                 onClose,
                                                 onCreate,
                                                 isCreating,
                                                 error
                                             }: CreatePlaylistDialogProps) {
    return (
        <Dialog
            open={open}
            title="Create playlist"
            onClose={onClose}
        >
            <form
                className="flex flex-col gap-6"
                onSubmit={(event) => {
                    event.preventDefault();
                    onCreate();
                }}
            >
                <p className="text-[13px] leading-[1.4] text-secondary">
                    A new space for the sounds you love.
                </p>

                <div className="flex items-center gap-5">
                    <Image
                        src="/artwork/default-cover.svg"
                        alt=""
                        width={88}
                        height={88}
                        className="rounded-card"
                    />

                    <p className="text-xs text-secondary">
                        Your playlist artwork
                    </p>
                </div>

                <Input
                    label="Playlist name"
                    placeholder="Enter playlist name"
                    value={name}
                    error={error}
                    onChange={(event) =>
                        onNameChange(event.target.value)
                    }
                    required
                />

                <div className="flex justify-end gap-2.5">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={!name.trim() || isCreating}
                    >
                        <Image
                            src="/icons/plus.svg"
                            alt=""
                            width={17}
                            height={17}
                        />
                        {isCreating ? "Creating..." : "Create playlist"}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}