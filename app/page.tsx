import Webring from "./components/webring";
import Lastfm from "./components/lastfm";
import AgeTimer from "./components/agetimer";
import FunFact from "./components/funfact";
import Contacts from "./components/contacts";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-xs flex-col items-stretch space-y-4">
        <section>
          <h1 className="text-xl tracking-tight text-text">мурчиков</h1>
          <AgeTimer />
          <p className="mt-1 text-sm text-muted">Россия, Комсомольск-на-Амуре</p>
          <p className="mt-1 text-sm">
            я мурчиков, я люблю что-то делать :P
            <br />
            я не знаю, что я хочу ещё тут написать
          </p>
          <p className="mt-1 text-sm">
            рандомный факт: <FunFact />
          </p>
        </section>

        <Contacts />
        <Lastfm />
        <Webring />
      </main>
    </div>
  );
}
