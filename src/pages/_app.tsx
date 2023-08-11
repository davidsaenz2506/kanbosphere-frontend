import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { WspProvider } from "@/context/usersWorkSpaces/wsp.provider";
import { NextUIProvider } from "@nextui-org/react";
import { CurrentWorkSpaceProvider } from "@/context/currentWorkSpace/currentWsp.provider";
import { CurrentUserProvider } from "@/context/currentUser/currentUser.provider";
import { CurrentContactProvider } from "@/context/currentContacts/currentContacts.provider";
import { LoadingChunkProvider } from "@/context/loadingChunks/loadingChunk.provider";

const theme = extendTheme({
  colors: {
    customColor: {
      50: "#f0f9ff",
      100: "#c2e2ff",
      200: "#91c1ff",
      300: "#60a0ff",
      400: "#2f80ff",
      500: "#005fff",
      600: "#0046cc",
      700: "#002e99",
      800: "#001966",
      900: "#000833",
    },
  },
  styles: {
    global: {
      "--toast-z-index": 1000,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LoadingChunkProvider>
      <CurrentContactProvider>
        <CurrentUserProvider>
          <CurrentWorkSpaceProvider>
            <NextUIProvider>
              <WspProvider>
                <ChakraProvider theme={theme}>
                  <Component {...pageProps} />
                </ChakraProvider>
              </WspProvider>
            </NextUIProvider>
          </CurrentWorkSpaceProvider>
        </CurrentUserProvider>
      </CurrentContactProvider>
    </LoadingChunkProvider>
  );
}
