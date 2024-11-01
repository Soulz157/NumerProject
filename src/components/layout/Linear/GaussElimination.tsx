import React from "react";
import axios from "axios";
import {
  Box,
  Container,
  NumberInput,
  NumberInputField,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputStepper,
  Text,
  Stack,
  Button,
  Input,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Divider,
  ButtonGroup,
} from "@chakra-ui/react";
import { MathJax } from "better-react-mathjax";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

function GaussElimination() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [size, setSize] = React.useState(0);
  const [matrix, setMatrix] = React.useState<number[][]>([[]]);
  const [constants, setConstants] = React.useState<number[]>([]);
  const [result, setResult] = React.useState<number[]>([]);
  const B = [matrix];
  const [mathExpression, setmathExpression] = React.useState<string[]>([]);

  const fetchdata = async () => {
    try {
      const response = await axios.get("http://localhost:8000/info/linear");
      if (response.data.result) {
        const data = response.data.data;
        const random = Math.floor(Math.random() * data.length);
        // console.log(data[random]);
        const s = data[random].size;
        console.log(s);
        setSize(s);
        randommatrix(s);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const randommatrix = (size: number) => {
    const newMatrix = Array.from({ length: size }, () => Array(size).fill(0));
    const newConstants = Array(size).fill(0);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        newMatrix[i][j] = Math.floor(Math.random() * 10);
      }
      newConstants[i] = Math.floor(Math.random() * 10);
    }
    setMatrix(newMatrix);
    setConstants(newConstants);
    setResult(newMatrix[0]);
  };

  const matrixLatex = (A: number[][], B: number[]) => {
    let text = `\\begin{bmatrix}`;

    for (let i = 0; i < A[0].length; i++) {
      text += A[i].join(" & ") + " & " + B[i] + " \\\\ ";
    }
    text += `\\end{bmatrix}`;
    return text;
  };

  const calGauss = (size: number, a: number[][], b: number[]) => {
    const X: number[] = [];
    const n = size;
    const A = a.map((row) => [...row]);
    const B = [...b];
    const text: string[] = [];

    text.push(`\\text{Matrix A :} \\quad ` + matrixLatex(A, B));

    //Forward Elimination
    for (let i = 0; i < n; i++) {
      const divisor = A[i][i];
      text.push(
        `\\text{Give row } ${i + 1}: \\quad \\frac{\\text{Row }${
          i + 1
        }}{${divisor}}`
      );
      for (let j = i; j < n; j++) {
        A[i][j] /= divisor;
      }
      B[i] /= divisor;

      text.push(matrixLatex(A, B));

      for (let k = i + 1; k < n; k++) {
        const ratio = A[k][i];
        text.push(
          `\\text{Eliminate row} ${k + 1}: \\quad \\text{Row }${
            k + 1
          } - (${ratio}) \\times \\text{Row }${i + 1} `
        );
        for (let j = i; j < n; j++) {
          A[k][j] -= ratio * A[i][j];
        }
        B[k] -= ratio * B[i];
        text.push(matrixLatex(A, B));
      }
      // console.log(A);
      // console.log(B);
    }

    text.push(`\\text{After Forward Elimination:} \\quad ` + matrixLatex(A, B));

    //Backward Substitution
    for (let i = n - 1; i >= 0; i--) {
      X[i] = B[i];
      // console.log(X);
      for (let j = i + 1; j < n; j++) {
        X[i] -= A[i][j] * X[j];
      }
      text.push(
        `X_{${i + 1}} = ${B[i].toFixed(2)} - ${A[i]
          .slice(i + 1)
          .map((val, idx) => `(${val.toFixed(2)} \\times X_{${i + idx + 2}})`)
          .join(" - ")} = ${X[i].toFixed(2)}`
      );
    }

    // console.log(X);
    setResult(X.map((num) => parseFloat(num.toFixed(6))));
    setmathExpression(Array.from(new Set(text)));
    console.log(mathExpression);
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
    if (size == 0) {
      onOpen();
    }
    calGauss(size, matrix, constants);
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
            value={size || 0}
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
            {
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
            }
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
                            value={matrix[i][j] || 0}
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
                              value={constants[i] || 0}
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
          <ButtonGroup gap={3}>
            <Button
              variant="outline"
              colorScheme="teal"
              fontWeight="bold"
              fontSize={"lg"}
              onClick={() => {
                fetchdata();
              }}
            >
              Random
            </Button>

            <Button
              variant="outline"
              borderColor={"white"}
              fontWeight="bold"
              fontSize={"lg"}
              onClick={() => {
                calroot();
              }}
            >
              Calculate
            </Button>
          </ButtonGroup>
          <Box mt={5}>
            <Button
              variant={"solid"}
              colorScheme="red"
              borderColor={"white"}
              fontWeight="bold"
              fontSize={"lg"}
              onClick={() => {
                setMatrix([[]]);
                setConstants([]);
                setResult([]);
                setmathExpression([]);
                setSize(0);
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
        <Divider p={2}></Divider>
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
        <Box w={800} mt={2} color="white">
          {mathExpression.map((text, index) => (
            <Box key={index} p={3}>
              <BlockMath>{text}</BlockMath>
            </Box>
          ))}
        </Box>
      </Container>
    </>
  );
}

export default GaussElimination;
