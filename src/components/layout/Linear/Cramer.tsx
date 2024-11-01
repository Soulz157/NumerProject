import React from "react";
import axios from "axios";
import {
  Box,
  Input,
  Container,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Stack,
  ButtonGroup,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Divider,
} from "@chakra-ui/react";
import { MathJax } from "better-react-mathjax";
import { det } from "mathjs";

function Cramer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [size, setSize] = React.useState(0);
  const [matrix, setMatrix] = React.useState<number[][]>([[]]);
  const [constants, setConstants] = React.useState<number[]>([]);
  const [result, setResult] = React.useState<number[]>([]);
  const B = [matrix];
  const [mathExpression, setmathExpression] = React.useState([
    {
      i: " ",
      part: " ",
      divide: " ",
      result: " ",
    },
  ]);

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

  const calcramer = (size: number, A: number[][], B: number[]) => {
    const detA = det(A);
    const detX: number[] = [];
    const X: number[] = [];
    const text = [];

    for (let i = 0; i < size; i++) {
      const newMatrix = A.map((row) => [...row]);
      for (let j = 0; j < size; j++) {
        newMatrix[j][i] = B[j];
      }

      detX.push(det(newMatrix));
      X.push(detX[i] / detA);

      const DetAi_text = `\\text{det}A_${i + 1} = ${detX[i].toString()}`;
      const DetA = `\\text{det}A = ${detA.toString()}`;
      const res = `\\text = \\frac{${DetAi_text}}{${DetA}} = ${X[
        i
      ].toString()}`;

      text.push({
        i: `X ${(i + 1).toString()}`,
        part: DetAi_text,
        divide: DetA,
        result: res,
      });
    }

    setResult(X.map((num) => parseFloat(num.toFixed(6))));
    setmathExpression(text);
    console.log(X);
  };

  const calroot = () => {
    if (size === 0) {
      onOpen();
    }
    calcramer(size, matrix, constants);
  };

  return (
    <>
      {
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Error
              </AlertDialogHeader>
              <AlertDialogBody>Please Input size matrix</AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  OK
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      }
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
            {size > 0 &&
              matrix.map((row, i) => (
                <>
                  <Stack direction={["column", "row"]} spacing="5px">
                    {row.map((col, j) => (
                      <>
                        <Box key={i} p={1}>
                          <NumberInput
                            key={j}
                            variant="filled"
                            value={matrix[i][j] || 0}
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
        <Box w={800} color={"white"}>
          <MathJax>
            {mathExpression.length > 1 &&
              mathExpression.map((r, index) => (
                <Box key={index} p={3}>
                  <MathJax>{"`" + r.i + "` = `" + r.result + "```"}</MathJax>
                </Box>
              ))}
          </MathJax>
        </Box>
      </Container>
    </>
  );
}

export default Cramer;
