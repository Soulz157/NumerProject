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
  Text,
  Stack,
  Input,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { MathJax } from "better-react-mathjax";

function LUdecom() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [matrix, setMatrix] = React.useState<number[][]>([[]]);
  const [size, setSize] = React.useState(0);
  const [constants, setConstants] = React.useState<number[]>([]);
  const [result, setResult] = React.useState<number[]>([]);
  const B = [matrix];

  const calLU = (size: number, a: number[][], b: number[]) => {
    const n = size;
    const A = a.map((row) => [...row]);
    const B = [...b];

    const L = Array.from({ length: n }, () => Array(n).fill(0));
    const U = Array.from({ length: n }, () => Array(n).fill(0));
    const X = Array(n).fill(0);
    const Y = Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (j < i) {
          L[j][i] = 0;
        } else {
          L[j][i] = A[j][i];
          for (let k = 0; k < j; k++) {
            L[j][i] -= L[j][k] * U[k][i];
          }
        }
      }
      //   console.log(L);
      for (let j = 0; j < n; j++) {
        if (j < i) {
          U[i][j] = 0;
          // } else if (j === i) {
          //   U[i][j] = 1;
        } else {
          U[i][j] = A[i][j] / L[i][i];
          for (let k = 0; k < i; k++) {
            U[i][j] -= (L[i][k] * U[k][j]) / L[i][i];
          }
        }
      }
      //   console.log(U);
    }

    //L * Y = B
    for (let i = 0; i < n; i++) {
      Y[i] = B[i];
      for (let j = 0; j < i; j++) {
        Y[i] -= L[i][j] * Y[j];
      }
      Y[i] = Y[i] / L[i][i];
    }

    //U * X = Y
    for (let i = n - 1; i >= 0; i--) {
      X[i] = Y[i];
      for (let j = i + 1; j < n; j++) {
        X[i] -= U[i][j] * X[j];
      }
      //   console.log(X);
    }

    setResult(X.map((num) => parseFloat(num.toFixed(6))));
  };

  const Showmatrix = (valueAsNumber: number) => {
    if (valueAsNumber >= 8) {
      return;
    }

    setSize(valueAsNumber);

    const newMatrix = Array.from({ length: valueAsNumber }, () =>
      Array(valueAsNumber).fill(0)
    );
    setMatrix(newMatrix);
    setResult(newMatrix[0]);
    console.log(matrix);
  };

  const calroot = () => {
    calLU(size, matrix, constants);
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
          <MathJax>{"`MatrixN*N`"}</MathJax>
          <NumberInput
            m={2}
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
        </Box>
        <Box>
          <Box padding={2}>
            {size > 7 && (
              <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Invalid Function!!
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      <Text>Please enter the correct function</Text>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button colorScheme="red" onClick={onClose} ml={3}>
                        Close
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            )}
            {size > 0 &&
              size < 7 &&
              matrix.map((row, i) => (
                <>
                  <Stack
                    direction={["column", "row"]}
                    spacing="5px"
                    // bg={"whiteAlpha.300"}
                  >
                    {row.map((col, j) => (
                      <>
                        <Box key={i} p={1}>
                          <NumberInput
                            key={j}
                            variant="filled"
                            size="sm"
                            defaultValue="0"
                            _placeholder={{ opacity: 1, color: "gray.500" }}
                            isInvalid
                            errorBorderColor="gray.500"
                            onChange={(valueAsString, valueAsNumber) => {
                              const newMatrix = [...matrix];
                              newMatrix[i][j] = valueAsNumber;
                              setMatrix(newMatrix);
                            }}
                          >
                            <NumberInputField
                              borderColor={"gray.500"}
                              borderRadius={5}
                            />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Box>
                      </>
                    ))}
                    <Box>
                      <Text fontSize="xl" fontWeight="bold" color="white" p={1}>
                        <MathJax>{"`=`"}</MathJax>
                      </Text>
                    </Box>
                    {size > 0 &&
                      B.map((col, j) => (
                        <>
                          <Box key={i} p={1}>
                            <NumberInput
                              key={j}
                              variant="filled"
                              size="sm"
                              defaultValue="0"
                              _placeholder={{ opacity: 1, color: "gray.500" }}
                              isInvalid
                              errorBorderColor="gray.500"
                              onChange={(valueAsString, valueAsNumber) => {
                                const newConstants = [...constants];
                                newConstants[i] = valueAsNumber;
                                setConstants(newConstants);
                              }}
                            >
                              <NumberInputField
                                borderColor={"gray.500"}
                                borderRadius={5}
                              />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </Box>
                        </>
                      ))}
                  </Stack>
                </>
              ))}
          </Box>
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
          <Text fontSize="xl" fontWeight="bold" color="white">
            Result
          </Text>
          <Box padding={2}>
            {size > 0 &&
              result.map((col, j) => (
                <>
                  <Text p={2} fontSize={"md"}>
                    <MathJax>
                      {"`X" + (j + 1) + " :`"}{" "}
                      <Input
                        variant="filled"
                        width={"max-content"}
                        size="sm"
                        value={result[j]}
                        placeholder={"-"}
                        _placeholder={{ opacity: 1, color: "gray.500" }}
                        isReadOnly
                        errorBorderColor="gray.500"
                      />
                    </MathJax>
                  </Text>
                </>
              ))}
          </Box>
        </Box>
        <Text p={2}>Step Calculate</Text>
        <Box bg={"white"} w={800} h={500}>
          {" "}
        </Box>
      </Container>
    </>
  );
}

export default LUdecom;
