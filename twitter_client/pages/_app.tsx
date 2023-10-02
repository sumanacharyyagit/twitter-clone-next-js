import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div className={inter.className}>
            <QueryClientProvider client={queryClient}>
                <GoogleOAuthProvider clientId="264426182433-160m3a1h0duibs8smv205cj9ufcacjc1.apps.googleusercontent.com">
                    <Component {...pageProps} />
                    <Toaster />
                    <ReactQueryDevtools />
                </GoogleOAuthProvider>
            </QueryClientProvider>
        </div>
    );
}
