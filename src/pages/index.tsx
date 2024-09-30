import React from "react";
import { Box, Button, ChakraProvider, Link } from "@chakra-ui/react";
import theme from "./theme";

export default function Home() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign={"center"} padding={5}>
        <Link href="/_mainpage">
          <Button colorScheme="teal" variant={"ghost"} borderRadius={10}>
            Get Start
          </Button>
        </Link>
      </Box>
    </ChakraProvider>
  );
}
