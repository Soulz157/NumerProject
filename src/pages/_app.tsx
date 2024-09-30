import React from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { MathJaxContext } from "better-react-mathjax";
import theme from "./theme";
import Navbar from "../components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Navbar></Navbar>
      <MathJaxContext
        config={{
          loader: { load: ["input/asciimath"] },
          asciimath: {
            displaystyle: true,
          },
        }}
      >
        <Component {...pageProps} />
      </MathJaxContext>
    </ChakraProvider>
  );
}
