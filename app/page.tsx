import Webring from "./components/webring";
import Lastfm from "./components/lastfm";
import AgeTimer from "./components/agetimer";
import FunFact from "./components/funfact";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full flex-col items-center space-y-4">
        <div className="relative z-10 w-full max-w-xs">
          <div>
            <h1 className="text-xl tracking-tight text-text">murchikov</h1>
            <AgeTimer />
            <p className="mt-1 text-sm text-muted">builds things</p>
          
        <p className="mt-1 text-sm">
          я мурчиков , я люблю что-то делать :P <br/>
          я не знаю, что я хочу ещё тут написать<br/>
          
          <span >рандомный факт: <FunFact /></span>
        </p>
        </div>
      </div>
        <Lastfm />
        <Webring />
      </main>
    </div>
  );
}
