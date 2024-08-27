import Head from "next/head";
import Header from "@/components/Header/Header";
import HomePage from "@/components/HomePage/HomePage";

export default function Home() {
  return (
    <>
      <Head>
        <title>Sport Wizzard</title>
        <meta name="description" content="Sport Wizzard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/sport-wizzard-icon.ico" />
      </Head>
      <main className="flex flex-col">
        <Header />
        <HomePage />
      </main>
    </>
  );
}
