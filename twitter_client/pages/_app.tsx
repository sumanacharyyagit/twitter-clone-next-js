import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div className={inter.className}>
            <GoogleOAuthProvider clientId="264426182433-160m3a1h0duibs8smv205cj9ufcacjc1.apps.googleusercontent.com">
                <Component {...pageProps} />
            </GoogleOAuthProvider>
        </div>
    );
}
