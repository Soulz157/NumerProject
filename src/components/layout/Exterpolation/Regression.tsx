import React from "react";
import {
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Text,
  Box,
  Input,
  Container,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { MathJax } from "better-react-mathjax";
import { det } from "mathjs";

function Regression() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [size, setSize] = React.useState(0);
  const [X, setX] = React.useState<number[]>([]);
  const [Fx, setFx] = React.useState<number[]>([]);
  const [Xinput, setXinput] = React.useState(0);
  const [result, setResult] = React.useState<number[]>([]);
  const [morder, setMorder] = React.useState(0);

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
    setResult(newMatrix[0]);
  };

  const calregression = () => {
    const x = [...X];
    const y = [...Fx];
    const m = morder;
    const n = m + 1;
    const A = Array.from({ length: n }, () => Array(n).fill(0));
    const B = Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        A[i][j] = x.reduce((sum, xi) => sum + Math.pow(xi, i + j), 0);
      }
      B[i] = x.reduce((sum, xi, index) => sum + Math.pow(xi, i) * y[index], 0);
    }
    // console.log(A);
    // console.log(B);

    const temp: number[] = [];
    const detA = det(A);
    // console.log(detA);
    for (let i = 0; i < n; i++) {
      const newMatrix = A.map((row) => [...row]);
      for (let j = 0; j < n; j++) {
        newMatrix[j][i] = B[j];
      }
      const detAi = det(newMatrix);
      // console.log(detAi);
      temp.push(detAi / detA);
    }
    setResult(temp.map((num) => parseFloat(num.toFixed(6))));
  };

  const calroot = () => {
    if (size < 2) {
      onOpen();
    }
    calregression();
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
          <Box px={20}>
            <Text>Number of points</Text>
            <NumberInput
              m={2}
              mt={3}
              defaultValue={0}
              min={0}
              max={20}
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
          </Box>
          <HStack>
            <Stack>
              <Box>
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
            </Stack>
            <Stack>
              <Box>
                <Text p={2}>M order</Text>
                <NumberInput
                  m={2}
                  defaultValue={0}
                  variant="filled"
                  size="md"
                  _placeholder={{ opacity: 1, color: "gray.500" }}
                  onChange={(valueAsString, valueAsNumber) => {
                    setMorder(valueAsNumber);
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
            </Stack>
          </HStack>
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

          {/* <HStack padding={2}>
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
            /> */}

          <Box p={2}>
            {size > 0 &&
              result.map((col, i) => (
                <>
                  <HStack p={2}>
                    <Text p={2} fontSize={"md"}>
                      <MathJax>{"`a" + i + " :`"}</MathJax>
                    </Text>
                    <Input
                      variant="filled"
                      width={"max-content"}
                      size="sm"
                      value={result[i]}
                      placeholder={"-"}
                      _placeholder={{ opacity: 1, color: "gray.500" }}
                      isReadOnly
                      errorBorderColor="gray.500"
                    />
                  </HStack>
                </>
              ))}
          </Box>

          {/* </HStack> */}
        </Box>
        <Text p={2}>Step Calculate</Text>
        <Box bg={"white"} w={800} h={500}>
          {" "}
        </Box>
      </Container>
    </>
  );
}

export default Regression;
