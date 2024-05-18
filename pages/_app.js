import "@/styles/globals.css";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function App({ Component, pageProps }) {
  return (
    <main className={raleway.className}>
      <Component {...pageProps} />;
    </main>
  )
}
