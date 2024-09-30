import * as React from "react";
import { ChakraProvider, Box, Button, ButtonGroup } from "@chakra-ui/react";
import theme from "./theme";
import Rootofequations from "./Root-of-Equations";
import LinearAlgebra from "./Linear-Algebra";

function Main() {
  const [Head, setHead] = React.useState(" ");

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl" padding={5} h={"max-content"}>
        <Box
          textAlign="center"
          fontSize="xl"
          marginBottom={15}
          fontWeight="bold"
        >
          <ButtonGroup gap={5}>
            <Button
              colorScheme="cyan"
              variant="ghost"
              borderRadius={15}
              value=" "
              isActive={Head === " "}
              onClick={(e) => setHead((e.target as HTMLButtonElement).value)}
            >
              ::
            </Button>
            <Button
              colorScheme="cyan"
              variant="ghost"
              borderRadius={15}
              value="Rootofequations"
              isActive={Head === "Rootofequations"}
              onClick={(e) => setHead((e.target as HTMLButtonElement).value)}
            >
              Root of Equations
            </Button>
            <Button
              colorScheme="cyan"
              variant="ghost"
              borderRadius={15}
              value="LinearAlgebra"
              isActive={Head === "LinearAlgebra"}
              onClick={(e) => setHead((e.target as HTMLButtonElement).value)}
            >
              Linear Algebra
            </Button>
            {/* <Button colorScheme="teal" variant="ghost" borderRadius={15}>
              -
            </Button>
            <Button colorScheme="teal" variant="ghost" borderRadius={15}>
              -
            </Button> */}
          </ButtonGroup>
        </Box>
      </Box>
      <Box textAlign="center" fontSize="xl" padding={5} position="relative">
        {Head === "Rootofequations" && <Rootofequations />}
        {Head === "LinearAlgebra" && <LinearAlgebra />}
      </Box>
    </ChakraProvider>
  );
}

export default Main;
