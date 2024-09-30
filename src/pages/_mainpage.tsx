import * as React from "react";
import {
  ChakraProvider,
  Box,
  Button,
  ButtonGroup,
  Text,
  Stack,
  StackDivider,
  Heading,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import theme from "./theme";
import Rootofequations from "../components/layout/Root-of-Equations";
import LinearAlgebra from "../components/layout/Linear-Algebra";

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
      <Box textAlign="center" fontSize="xl" padding={20} position="relative">
        {Head === " " && (
          <Card>
            <CardHeader>
              <Heading size="md">Client Report</Heading>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Summary
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    View a summary of all your clients over the last month.
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Overview
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    Check out the overview of your clients.
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Analysis
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    See a detailed analysis of all your business clients.
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        )}
        {Head === "Rootofequations" && <Rootofequations />}
        {Head === "LinearAlgebra" && <LinearAlgebra />}
      </Box>
    </ChakraProvider>
  );
}

export default Main;
