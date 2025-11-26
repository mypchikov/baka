import Image from "next/image";
import Webring from "./components/webring";
import Lastfm from "./components/lastfm";
import AgeTimer from "./components/timer";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full flex-col items-center space-y-4">
        <div className="flex flex-col items-start space-y-4">
          <Image
            src="https://avatars.githubusercontent.com/u/142986663"
            alt="murchikov's profile"
            width={128}
            height={128}
            className="h-32 w-32 rounded-full border border-neutral-500/50"
          />
          <div>
            <h2 className="text-3xl font-italic">murchikov</h2>
            <AgeTimer />
            <p className="text-xl text-gray-400">
              frontend, music - Khabarovsk, Ru
            </p>
          </div>
        </div>
        <p className="font-medium text-lg">
          hello world!
          <br />
          my site is comming out!
          <br />
          i dont know what i want to type here
        </p>
        <Lastfm />
        <Webring />
      </main>
    </div>
  );
}
