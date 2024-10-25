import React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Text,
  Box,
  Container,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import { MathJax } from "better-react-mathjax";

function Spline() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [size, setSize] = React.useState(0);
  const [X, setX] = React.useState<number[]>([]);
  const [Fx, setFx] = React.useState<number[]>([]);
  const [Xinput, setXinput] = React.useState(0);
  const [result, setResult] = React.useState(0);

  const Showmatrix = (valueAsNumber: number) => {
    if (valueAsNumber > 20) {
      return;
    }

    setSize(valueAsNumber);

    const newMatrix = Array.from({ length: valueAsNumber }, () =>
      Array(valueAsNumber).fill(0)
    );

    setX(newMatrix[0]);
    setFx(newMatrix[0]);
  };

  //   cosnt recursiveslope = (X: number[], Fx: number[]) => {
  //       const slope = Array.from({ length: size }, () => Array(size).fill(0));
  //       const x = [...X];
  //     const fx = [...Fx];

  //     }

  const calspline = () => {
    const x = [...X];
    const fx = [...Fx];

    for (let i = 0; i < size - 1; i++) {
      if (Xinput >= x[i] && Xinput <= x[i + 1]) {
        const m = (fx[i + 1] - fx[i]) / (x[i + 1] - x[i]);
        const result = fx[i] + m * (Xinput - x[i]);
        setResult(result);
        break;
      }
    }
  };

  const calroot = () => {
    if (size < 2) {
      onOpen();
    }
    calspline();
  };

  return (
    <>
      {
        <>
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Error!!
                </AlertDialogHeader>

                <AlertDialogBody>
                  <Text>Please input Number of point more than 2</Text>
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button colorScheme="red" onClick={onClose} ml={3}>
                    Close
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </>
      }
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
            max={5}
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
                    const newMatrix = [...Fx];
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

          <HStack padding={2}>
            <MathJax>
              {"`F($)`".replaceAll("$", Xinput ? Xinput.toString() : "x")}
            </MathJax>
            <MathJax>{"`=`"}</MathJax>
            <Input
              variant="filled"
              width={"max-content"}
              size="sm"
              value={result}
              placeholder={"-"}
              _placeholder={{ opacity: 1, color: "gray.500" }}
              isReadOnly
              errorBorderColor="gray.500"
            />
          </HStack>
        </Box>
        <Text p={2}>Step Calculate</Text>
        <Box bg={"white"} w={800} h={500}>
          {" "}
        </Box>
      </Container>
    </>
  );
}

export default Spline;
