import {
    Show,
    SignInButton,
    SignUpButton,
    UserButton,
} from "@clerk/nextjs";

import { Suspense } from "react";
import SearchForm from "./SearchForm";
import Link from "next/link";
import Image from "next/image";
export default function Header() {

    return (
        <header
            className="flex min-h-desktop-header flex-wrap
            items-center justify-between gap-4
            px-4 py-4 md:px-desktop-gutter
            lg:flex-nowrap"
        >
            <div className="order-1 md:hidden">
                <Link
                    href="/"
                    className="order-1 flex items-center gap-2 md:hidden"
                >
                    <Image
                        src="/icons/brand.svg"
                        alt=""
                        width={28}
                        height={28}
                    />

                    <span className="text-lg font-bold text-foreground">
                        P Music<span className="text-primary">.</span>
                    </span>
                </Link>
            </div>

            <div className="order-3 w-full min-w-0
            md:order-1 md:w-auto md:flex-1">
                <SearchForm initialQuery="" variant="header" />
            </div>

            <div className="order-2 flex shrink-0 items-center gap-2">
                <Suspense>

                    <Show when="signed-out">
                        <SignInButton>
                            <button
                                type="button"
                                className="cursor-pointer whitespace-nowrap rounded-full
                                           border border-border px-4 py-2
                                           text-sm font-medium text-foreground
                                           transition-colors duration-200
                                           hover:border-primary hover:bg-raised
                                           focus-visible:outline-2
                                           focus-visible:outline-offset-2
                                           focus-visible:outline-focus"
                                            >
                                Sign In
                            </button>
                        </SignInButton>

                        <SignUpButton>
                            <button
                                type="button"
                                className="cursor-pointer whitespace-nowrap rounded-full
                                           bg-primary px-5 py-2 text-sm font-semibold
                                           text-white shadow-sm shadow-indigo-950/30
                                           transition-colors duration-200
                                           hover:bg-primary-hover
                                           focus-visible:outline-2
                                           focus-visible:outline-offset-2
                                           focus-visible:outline-focus"
                            >
                                Sign Up
                            </button>
                        </SignUpButton>
                    </Show>


                    <Show when="signed-in">
                        <UserButton />
                    </Show>
                </Suspense>
            </div>
        </header>
    );

}