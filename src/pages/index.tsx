import React from "react";
import {
  Box,
  Button,
  ChakraProvider,
  Link,
  Container,
  Heading,
} from "@chakra-ui/react";
import theme from "./theme";

export default function Home() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign={"center"} alignItems={"center"} padding={5}>
        <Container mt={"10vh"}>
          <Heading as="h1" size="xl">
            Welcome to Numerical Method!
            <Box alignItems={"center"}></Box>
          </Heading>
          <Link href="/_mainpage">
            <Button
              mt={"2vh"}
              colorScheme="teal"
              variant={"ghost"}
              borderRadius={10}
            >
              Get Start
            </Button>
          </Link>
        </Container>
      </Box>
    </ChakraProvider>
  );
}
