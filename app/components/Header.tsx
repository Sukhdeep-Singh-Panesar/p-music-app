import {
    Show,
    SignInButton,
    SignUpButton,
    UserButton,
} from "@clerk/nextjs";

import { Suspense } from "react";
import SearchForm from "./SearchForm";

export default function Header() {
    return (
        <header
            className="flex min-h-desktop-header flex-wrap
                items-center justify-between gap-4
                px-4 py-4 md:px-desktop-gutter
                lg:flex-nowrap"
        >
            <SearchForm initialQuery="" variant="header" />

            <div className="flex shrink-0 items-center gap-4">
                <Suspense>
                    <Show when="signed-out">
                        <SignInButton />
                        <SignUpButton />
                    </Show>

                    <Show when="signed-in">
                        <UserButton />
                    </Show>
                </Suspense>
            </div>
        </header>
    );
}