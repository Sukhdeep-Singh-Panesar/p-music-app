"use client";

import { useUser } from "@clerk/nextjs";

type WelcomeMessageProps = {
    message: string;
};

export default function WelcomeMessage({
                                           message,
                                       }: WelcomeMessageProps) {
    const { isLoaded, isSignedIn, user } = useUser();
    return (
        <div>
            {isLoaded && isSignedIn && user ? (
                <p className="text-xs leading-[1.4] text-secondary sm:self-end">
                    {user.firstName
                        ? `Welcome back, ${user.firstName}!`
                        : "Welcome back!"}
                </p>
            ) : (
                <p className="text-xs leading-[1.4] text-secondary sm:self-end">
                    {message}
                </p>
            )}
        </div>
    );
}