type WelcomeMessageProps = {
    message: string;
};

export default function WelcomeMessage({
                                           message,
                                       }: WelcomeMessageProps) {
    return (
        <p className="text-xl text-gray-300 mb-8">
            {message}
        </p>
    );
}