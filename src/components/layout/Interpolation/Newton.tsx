import React from "react";
import {
  Box,
  Button,
  Container,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useDisclosure,
  // AlertDialog,
  // AlertDialogOverlay,
  // AlertDialogContent,
  // AlertDialogHeader,
  // AlertDialogBody,
  // AlertDialogFooter,
  Text,
  Stack,
  Input,
  HStack,
} from "@chakra-ui/react";
import { MathJax } from "better-react-mathjax";

function Newton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [size, setSize] = React.useState(0);
  const [X, setX] = React.useState<number[]>([]);
  const [fx, setFx] = React.useState<number[]>([]);
  const [Xinput, setXinput] = React.useState(0);

  const Showmatrix = (valueAsNumber: number) => {
    if (valueAsNumber < 2) {
      alert("Please input number of points more than 2");
      return;
    }
    if (valueAsNumber > 20) {
      return;
    }
    setSize(valueAsNumber);

    const newMatrix = Array.from({ length: valueAsNumber }, () =>
      Array(valueAsNumber).fill(0)
    );

    setX(newMatrix[0]);
    setFx(newMatrix[0]);
    console.log(X);
  };

  const recursivenewton = (Xvalue: number[], Fx: number) => {
    const n = Xvalue.length;
  };

  const calNewton = () => {
    const point = size;
    const Xcal = [...X];
    const Fxcal = [...fx];
    const Xvalue = Xinput;
  };

  const calroot = () => {
    calNewton();
  };

  return (
    <>
      <Container maxW="2xl" centerContent mt={30}>
        <Box
          padding="4"
          color="white"
          fontWeight={"bold"}
          fontSize="xl"
          maxW="md"
        >
          <MathJax>Number of points</MathJax>
          <NumberInput
            m={2}
            mt={3}
            defaultValue={0}
            min={0}
            max={7}
            variant="filled"
            size="md"
            _placeholder={{ opacity: 1, color: "gray.500" }}
            onChange={(valueAsString, valueAsNumber) => {
              Showmatrix(valueAsNumber);
              console.log(valueAsNumber);
            }}
          >
            <NumberInputField borderColor={"gray.500"} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <Text p={2}>X : Value</Text>

          <NumberInput
            m={2}
            defaultValue={0}
            min={0}
            max={7}
            variant="filled"
            size="md"
            _placeholder={{ opacity: 1, color: "gray.500" }}
            onChange={(valueAsString, valueAsNumber) => {
              setXinput(valueAsNumber);
              console.log(valueAsNumber);
            }}
          >
            <NumberInputField borderColor={"gray.500"} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Box>
        <Box p={2}>
          <Button
            variant="outline"
            borderColor={"gray.500"}
            fontWeight="bold"
            fontSize={"lg"}
            onClick={calroot}
          >
            Calculate
          </Button>
        </Box>
        <Box p={2}>
          {size > 0 &&
            X.map((col, j) => (
              <HStack key={j}>
                <MathJax>{"`X$ :`".replaceAll("$", j.toString())}</MathJax>
                <NumberInput
                  key={j}
                  defaultValue="0"
                  m={2}
                  onChange={(valueAsString, valueAsNumber) => {
                    const newMatrix = [...X];
                    newMatrix[j] = valueAsNumber;
                    setX(newMatrix);
                  }}
                >
                  <NumberInputField borderColor={"gray.500"} borderRadius={5} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <MathJax>{"`F(X$) : `".replaceAll("$", j.toString())}</MathJax>
                <NumberInput
                  key={j}
                  defaultValue="0"
                  m={2}
                  onChange={(valueAsString, valueAsNumber) => {
                    const newMatrix = [...fx];
                    newMatrix[j] = valueAsNumber;
                    setFx(newMatrix);
                  }}
                >
                  <NumberInputField borderColor={"gray.500"} borderRadius={5} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </HStack>
            ))}
        </Box>
      </Container>
      <Container
        maxW="2xl"
        fontSize={"xl"}
        borderColor={"white"}
        fontWeight={"bold"}
        centerContent
        mt={5}
      >
        <Box p={2}>
          <Text fontSize="xl" fontWeight="bold" color="white">
            Result
          </Text>
          <Box padding={2}></Box>
        </Box>
        <Text p={2}>Step Calculate</Text>
        <Box bg={"white"} w={800} h={500}>
          {" "}
        </Box>
      </Container>
    </>
  );
}

export default Newton;
