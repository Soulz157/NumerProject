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
import Rootofequations from "../components/Root-of-Equations";
import LinearAlgebra from "../components/Linear-Algebra";
import Interpolation from "@/components/Interpolation";
import Exterpolation from "@/components/Exterpolation";
import Intergration from "@/components/Intergration";
import Differentiation from "@/components/Differentiation";

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
            <Button
              colorScheme="cyan"
              variant="ghost"
              borderRadius={15}
              value="Interpolation"
              isActive={Head === "Interpolation"}
              onClick={(e) => setHead((e.target as HTMLButtonElement).value)}
            >
              Interpolation
            </Button>
            <Button
              colorScheme="cyan"
              variant="ghost"
              borderRadius={15}
              value="Exterpolation"
              isActive={Head === "Exterpolation"}
              onClick={(e) => setHead((e.target as HTMLButtonElement).value)}
            >
              Exterpolation
            </Button>
            <Button
              colorScheme="cyan"
              variant="ghost"
              borderRadius={15}
              value="Integration"
              isActive={Head === "Integration"}
              onClick={(e) => setHead((e.target as HTMLButtonElement).value)}
            >
              Integration
            </Button>
            <Button
              colorScheme="cyan"
              variant="ghost"
              borderRadius={15}
              value="Differentiation"
              isActive={Head === "Differentiation"}
              onClick={(e) => setHead((e.target as HTMLButtonElement).value)}
            >
              Differentiation
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
      <Box textAlign="center" fontSize="xl" padding={5} position="relative">
        {Head === "Rootofequations" && <Rootofequations />}
        {Head === "LinearAlgebra" && <LinearAlgebra />}
        {Head === "Interpolation" && <Interpolation />}
        {Head === "Exterpolation" && <Exterpolation />}
        {Head === "Integration" && <Intergration />}
        {Head === "Differentiation" && <Differentiation />}
        {Head === " " && (
          <Card m={20}>
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
      </Box>
    </ChakraProvider>
  );
}

export default Main;
