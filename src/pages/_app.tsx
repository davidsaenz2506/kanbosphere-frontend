import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { WspProvider } from "@/context/usersWorkSpaces/wsp.provider";
import { NextUIProvider } from "@nextui-org/react";
import { CurrentWorkSpaceProvider } from "@/context/currentWorkSpace/currentWsp.provider";
import { CurrentUserProvider } from "@/context/currentUser/currentUser.provider";
import { CurrentContactProvider } from "@/context/currentContacts/currentContacts.provider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CurrentContactProvider>
      <CurrentUserProvider>
        <CurrentWorkSpaceProvider>
          <NextUIProvider>
            <WspProvider>
              <ChakraProvider>
                <Component {...pageProps} />
              </ChakraProvider>
            </WspProvider>
          </NextUIProvider>
        </CurrentWorkSpaceProvider>
      </CurrentUserProvider>
    </CurrentContactProvider>
  );
}
