import { AppProps } from "next/app";
import { SessionProvider as NextAuthProvider } from "next-auth/react";

import "../styles/global.scss";
import { Header } from "../components/Header";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <NextAuthProvider session={session}>
      <Header />
      <Component {...pageProps} />
    </NextAuthProvider>
  );
}

export default MyApp;
