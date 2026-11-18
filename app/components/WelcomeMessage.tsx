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
                <p className="text-xl text-gray-300 mb-8">
                    Welcome back, {user.firstName}!
                </p>
            ) : (
                <p className="text-xl text-gray-300 mb-8">
                    {message}
                </p>
            )}
        </div>
    );
}