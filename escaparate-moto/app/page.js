import Muro from "./components/Muro";
import { NOMBRE } from "./config";

export default function Home() {
  return (
    <>
      <header className="cabecera">
        <span className="logo">{NOMBRE}</span>
      </header>
      <main className="principal">
        <Muro />
      </main>
    </>
  );
}
