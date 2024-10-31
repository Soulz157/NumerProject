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
  HStack,
  Input,
  Stack,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
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

function GaussSeidel() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [size, setSize] = React.useState(0);
  const [matrix, setMatrix] = React.useState<number[][]>([[]]);
  const [constants, setConstants] = React.useState<number[]>([]);
  const [result, setResult] = React.useState<number[]>([]);
  const [Xstart, setXstart] = React.useState<number[]>([]);
  const B = [matrix];
  const [mathExpression, setmathExpression] = React.useState<
    { iteration: number; x: number[]; e: number }[]
  >([]);

  const Showmatrix = (valueAsNumber: number) => {
    if (valueAsNumber > 7) {
      return;
    }
    setSize(valueAsNumber);
    const newMatrix = Array.from({ length: valueAsNumber }, () =>
      Array(valueAsNumber).fill(0)
    );

    setMatrix(newMatrix);
    setResult(newMatrix[0]);
    setXstart(newMatrix[0]);
  };

  const calseidel = (A: number[][], B: number[], X: number[]) => {
    const epsilon = 0.00001;
    const Max = 100;
    const x = [...X];
    const a = [...A];
    let e = 1;
    let iteration = 0;
    const text = [];

    while (e > epsilon && iteration < Max) {
      const xnew = [...x];
      for (let i = 0; i < size; i++) {
        let sum = 0;
        for (let j = 0; j < size; j++) {
          if (i !== j) {
            sum += a[i][j] * x[j];
          }
        }

        xnew[i] = (B[i] - sum) / a[i][i];
        e = Math.abs((xnew[0] - x[0]) / xnew[0]);
        x[i] = xnew[i];
      }

      iteration++;
      text.push({
        iteration: iteration,
        x: x.map((num) => parseFloat(num.toFixed(6))),
        e: parseFloat(e.toFixed(6)),
      });
    }
    setResult(x);
    setmathExpression(text);
  };

  const calroot = () => {
    try {
      calseidel(matrix, constants, Xstart);
    } catch (error) {
      onOpen();
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
        <Box color={"white"} w={800}>
          {mathExpression.length > 0 && (
            <TableContainer>
              <Table variant="simple" size={"sm"}>
                <Thead gap={20}>
                  <Tr>
                    <Th>Iteration</Th>
                    <Th>X</Th>
                    <Th>ε</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {mathExpression.map((row, i) => (
                    <Tr key={i}>
                      <Td>{row.iteration}</Td>
                      <Td>
                        <BlockMath
                          math={`X = [${row.x
                            .map((val) => val.toFixed(6))
                            .join(",")}]`}
                        />
                      </Td>
                      <Td>
                        <BlockMath math={`Error = ${row.e.toFixed(6)}`} />
                      </Td>
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

export default GaussSeidel;
