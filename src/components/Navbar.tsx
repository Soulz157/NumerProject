import React from "react";
import {
  Box,
  Heading,
  Button,
  ButtonGroup,
  Flex,
  Spacer,
  Link,
} from "@chakra-ui/react";
// import { ColorModeSwitcher } from "../ColorModeSwitcher";

function Navbar() {
  return (
    <nav>
      <Flex
        minWidth="max-content"
        alignItems="center"
        gap="2"
        bgGradient="linear(to-r,blue.900,blackAlpha.400, blackAlpha.800)"
      >
        <Box p="2" ml={2}>
          <Heading size="md" fontWeight="BOLD" textColor={"whiteAlpha.800"}>
            Numerical Methods
          </Heading>
        </Box>
        <Spacer />
        <ButtonGroup gap="5" padding={2}>
          <Link href="/">
            <Button
              colorScheme="teal"
              borderRadius={10}
              mr={50}
              width={90}
              variant="ghost"
            >
              Home
            </Button>
          </Link>
          {/* <ColorModeSwitcher justifySelf="flex-end" /> */}
        </ButtonGroup>
      </Flex>
    </nav>
  );
}

export default Navbar;
