import React from "react";
import axios from "axios";
import {
  Box,
  Container,
  NumberInput,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInputStepper,
  Stack,
  Button,
  Input,
  Text,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogContent,
  ButtonGroup,
  Divider,
} from "@chakra-ui/react";
import { MathJax } from "better-react-mathjax";
import { create, all } from "mathjs";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

function MatrixInverse() {
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

  const math = create(all);

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

  const calmatrixinverse = (size: number, a: number[][], b: number[]) => {
    const A = math.matrix(a);
    const B = math.matrix(b);
    const Ainv = math.inv(A);
    const X = math.multiply(Ainv, B);
    const text: string[] = [];

    const matrixA = A.toArray();
    const matrixB = B.toArray();
    const matrixAinv = Ainv.toArray();

    text.push(
      `\\text {Intitial Matrix A :} \\quad ${matrixlatex(
        matrixA as number[][]
      )}`
    );
    text.push(
      `\\text {Intitial Matrix B :} \\quad ${matrixlatex(
        matrixB as number[][]
      )}`
    );
    text.push(
      `\\text {Inverse Matrix A :} \\quad ${matrixlatex(
        matrixAinv as number[][]
      )}`
    );
    text.push(`\\text {X :} \\quad ${matrixlatex(X.toArray() as number[][])}`);

    setResult(X.toArray() as number[]);
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
    } else {
      calmatrixinverse(size, matrix, constants);
    }
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
            value={size || 0}
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
                            value={matrix[i][j] || 0}
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

export default MatrixInverse;
