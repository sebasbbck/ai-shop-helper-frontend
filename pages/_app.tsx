import type { AppProps } from "next/app";
import "../styles/globals.css";
import "../lib/init-api-client"; // Initialize API client with correct baseURL

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;