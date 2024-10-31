import React from "react";
import {
  Box,
  Container,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
  Button,
  Input,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  HStack,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Table,
} from "@chakra-ui/react";
import { MathJax } from "better-react-mathjax";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

function Conjugate() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [matrix, setMatrix] = React.useState<number[][]>([[]]);
  const [size, setSize] = React.useState(0);
  const [constants, setConstants] = React.useState<number[]>([]);
  const [Xstart, setXstart] = React.useState<number[]>([]);
  const [result, setResult] = React.useState<number[]>([]);
  const [mathExpression, setmathExpression] = React.useState<
    {
      iteration: number;
      X: number[];
      R: number[];
      D: number[];
      alpha: number;
      lambda: number;
      tolence: number;
    }[]
  >([]);
  const B = [matrix];

  const Showmatrix = (valueAsNumber: number) => {
    if (valueAsNumber >= 8) {
      onOpen();
      return;
    }

    setSize(valueAsNumber);

    const newMatrix = Array.from({ length: valueAsNumber }, () =>
      Array(valueAsNumber).fill(0)
    );
    setMatrix(newMatrix);
    setResult(newMatrix[0]);
    setXstart(newMatrix[0]);
    console.log(matrix);
  };

  const calconjugate = (
    size: number,
    a: number[][],
    b: number[],
    x: number[]
  ) => {
    const n = size;
    const X = [...x];
    const A = a.map((row) => [...row]);
    const B = [...b];
    let R = Array(n).fill(0);
    let D = Array(n).fill(0);
    const text = [];

    for (let i = 0; i < n; i++) {
      R[i] = B[i];
      for (let j = 0; j < n; j++) {
        R[i] -= A[i][j] * X[j];
      }
    }

    D = [...R];

    let iteration = 0;
    const Max = 100;
    const error = 0.000001;
    let tolence = 1;

    while (iteration < Max && tolence > error) {
      let alpha = 0;
      let lambda = 0;
      let Rk = 0;
      const AD = Array(n).fill(0);

      for (let i = 0; i < n; i++) {
        Rk += R[i] * R[i];
        for (let j = 0; j < n; j++) {
          AD[i] += A[i][j] * D[j];
        }
      }

      let DAD = 0;

      for (let i = 0; i < n; i++) {
        DAD += D[i] * AD[i];
      }

      lambda = DAD !== 0 ? Rk / DAD : 0;

      for (let i = 0; i < n; i++) {
        X[i] = X[i] + lambda * D[i];
      }
      console.log(X);

      const Rnew = Array(n).fill(0);

      for (let i = 0; i < n; i++) {
        let ratio = 0;
        for (let j = 0; j < n; j++) {
          ratio += A[i][j] * X[j];
        }
        Rnew[i] = ratio - B[i];
      }

      tolence = Math.sqrt(Rnew.reduce((acc, cur) => acc + cur * cur, 0));

      let RAD = 0;
      for (let i = 0; i < n; i++) {
        RAD += Rnew[i] * AD[i];
      }

      alpha = DAD !== 0 ? RAD / DAD : 0;

      for (let i = 0; i < n; i++) {
        D[i] = alpha * D[i] - Rnew[i];
      }

      R = [...Rnew];

      iteration++;
      text.push({
        iteration: iteration,
        X: X.map((num) => parseFloat(num.toFixed(6))),
        R: R.map((num) => parseFloat(num.toFixed(6))),
        D: D.map((num) => parseFloat(num.toFixed(6))),
        alpha: parseFloat(alpha.toFixed(6)),
        lambda: parseFloat(lambda.toFixed(6)),
        tolence: parseFloat(tolence.toFixed(6)),
      });
    }

    setResult(X.map((num) => parseFloat(num.toFixed(6))));
    setmathExpression(text);
  };

  const calroot = () => {
    calconjugate(size, matrix, constants, Xstart);
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
            <Box mt={5}>
              {size > 0 &&
                Xstart.map((col, i) => (
                  <>
                    <HStack display={"flex"} justifyContent={"center"}>
                      <Text p={2} fontSize={"md"}>
                        <MathJax>{"`X(Start) " + (i + 1) + " :`"} </MathJax>
                      </Text>
                      <NumberInput
                        m={2}
                        defaultValue={0}
                        min={0}
                        width={"max-content"}
                        variant="filled"
                        size="sm"
                        _placeholder={{ opacity: 1, color: "gray.500" }}
                        onChange={(valueAsString, valueAsNumber) => {
                          const newMatrix = [...Xstart];
                          newMatrix[i] = valueAsNumber;
                          setXstart(newMatrix);
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
                    </HStack>
                  </>
                ))}
            </Box>
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
        <Box w={800} mt={2} color="white">
          {mathExpression.length > 0 && (
            <TableContainer>
              <Table variant="simple" size={"sm"}>
                <Thead>
                  <Tr>
                    <Th w={150}>Iteration</Th>
                    <Th>Alpha (α)</Th>
                    <Th>Lamda (λ)</Th>
                    <Th>D</Th>
                    <Th>X</Th>
                    <Th>Residual (R)</Th>
                    <Th>Error</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {mathExpression.map((text, index) => (
                    <Tr key={index}>
                      <Td>{text.iteration}</Td>
                      <Td>{text.alpha}</Td>
                      <Td>{text.lambda}</Td>
                      <Td>
                        <BlockMath
                          math={`D = \\begin{bmatrix} ${text.D.map(
                            (val) => ` ${val.toFixed(2)}`
                          ).join("\\\\")} \\end{bmatrix}`}
                        />
                      </Td>
                      <Td>
                        <BlockMath
                          math={`X = \\begin{bmatrix} ${text.X.map(
                            (val) => ` ${val.toFixed(2)}`
                          ).join("\\\\")} \\end{bmatrix}`}
                        />
                      </Td>
                      <Td>
                        <BlockMath
                          math={`R = \\begin{bmatrix} ${text.R.map(
                            (val) => `${val.toFixed(2)}`
                          ).join("\\\\")} \\end{bmatrix}`}
                        />
                      </Td>
                      <Td>{text.tolence}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Container>
    </>
  );
}

export default Conjugate;
