import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {NextUIProvider} from "@nextui-org/react";
import AuthProvider from "@/component/AuthProvider";

export default function App({ Component, pageProps }: AppProps) {
  return <NextUIProvider><AuthProvider><Component {...pageProps} /></AuthProvider></NextUIProvider>;
}
