import React from "react";
import axios from "axios";
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
  ButtonGroup,
  Divider,
} from "@chakra-ui/react";
import { MathJax } from "better-react-mathjax";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

function LUdecom() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [matrix, setMatrix] = React.useState<number[][]>([[]]);
  const [size, setSize] = React.useState(0);
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

  const matrixlatex = (matrix: number[][]) => {
    if (Array.isArray(matrix[0])) {
      let latex = "\\begin{bmatrix} ";
      for (let i = 0; i < matrix.length; i++) {
        latex += matrix[i].join(" & ") + " \\\\ ";
      }
      latex += "\\end{bmatrix}";
      return latex;
    } else {
      let latex = "\\begin{bmatrix} ";
      for (let i = 0; i < matrix.length; i++) {
        latex += matrix[i] + " \\\\ ";
      }
      latex += "\\end{bmatrix}";
      return latex;
    }
  };

  const calLU = (size: number, a: number[][], b: number[]) => {
    const n = size;
    const A = a.map((row) => [...row]);
    const B = [...b];
    let text: string[] = [];

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

    const Ltext = `\\text {L :} \\quad ${matrixlatex(L as number[][])}`;
    const Utext = `\\text {U :} \\quad ${matrixlatex(U as number[][])}`;
    const Atext = `\\text {A :} \\quad ${matrixlatex(L as number[][])}`;
    const Btext = `\\text {B :} \\quad ${matrixlatex(L as number[][])}`;

    const equation = `A = L \\cdot U \\quad ${Ltext} \\cdot ${Utext}`;
    text = [equation];

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
    const showtext = `\\text{[L][U] = [A]}`;
    text.push(showtext);
    const Lt1 = matrixlatex(L as number[][]);
    const Ut1 = matrixlatex(U as number[][]);
    const equation1 = `  ${Lt1} \\cdot ${Ut1} = ${Atext} `;
    text.push(equation1);

    const showtext2 = `\\text{[L][Y] = [B]}`;
    text.push(showtext2);

    const equation2 = `  ${Lt1} \\cdot \\begin{bmatrix} ${Y.map(
      (y, index) => `y_{${index + 1}}`
    ).join(" \\\\ ")} \\end{bmatrix} = ${Btext} `;
    text.push(equation2);

    const equation3 = `  ${Ut1} \\cdot \\begin{bmatrix} ${Y.map(
      (y, index) => `y_{${index + 1}}`
    ).join(" \\\\ ")} \\end{bmatrix} = \\begin{bmatrix} ${Y.map((y) =>
      y.toFixed(4)
    ).join(" \\\\ ")} \\end{bmatrix} `;
    text.push(equation3);

    const showtext3 = `\\text{[U][X] = [Y]}`;
    text.push(showtext3);

    const equation4 = `  ${Ut1} \\cdot \\begin{bmatrix} ${X.map(
      (x, index) => `x_{${index + 1}}`
    ).join(" \\\\ ")} \\end{bmatrix} = \\begin{bmatrix} ${Y.map((y) =>
      y.toFixed(4)
    ).join(" \\\\ ")} \\end{bmatrix} `;
    text.push(equation4);

    const solution = `\\begin{bmatrix} ${X.map((x) => x.toFixed(0)).join(
      " \\\\ "
    )} \\end{bmatrix}`;
    text.push(solution);

    setResult(X.map((num) => parseFloat(num.toFixed(6))));
    setmathExpression(text);
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
                              value={constants[j] || 0}
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
        <Box color={"white"} mt={2} w={800}>
          {mathExpression.map((exp, i) => (
            <Box key={i} p={2}>
              <BlockMath math={exp} />
            </Box>
          ))}
        </Box>
      </Container>
    </>
  );
}

export default LUdecom;
