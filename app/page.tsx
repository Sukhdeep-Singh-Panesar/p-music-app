import WelcomeMessage from "./components/WelcomeMessage";

export default function Home() {
    const message = "Discover your next favorite track";
  return (
      <div className="flex flex-col items-center justify-center mt-0 min-h-screen">
        <h1 className="text-6xl font-bold mb-4 text-blue-300">
          P Music App
        </h1>
        <WelcomeMessage message={message} />
        <div className="text-4xl"></div>
      </div>
  );
}




 