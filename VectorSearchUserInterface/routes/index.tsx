import { Head } from "$fresh/runtime.ts";
import Search from "../islands/Search.tsx";

export default function Home() {
  return (
    <div class="bg-white dark:bg-zinc-900 min-h-screen transition-colors duration-300">
      <Head>
        <title>Movie Poster App</title>
      </Head>
      <div class="container mx-auto p-4">
        <Search />
      </div>
    </div>
  );
}