import React from "react";
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
  // useDisclosure,
  // AlertDialog,
  // AlertDialogBody,
  // AlertDialogFooter,
  // AlertDialogHeader,
  // AlertDialogContent,
  // AlertDialogOverlay,
} from "@chakra-ui/react";
import { MathJax } from "better-react-mathjax";
import { det } from "mathjs";

function Cramer() {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  // const cancelRef = React.useRef<HTMLButtonElement>(null);

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

      const DetAi_text = `${newMatrix.toString()}`;
      const DetA = `${A.toString()}`;

      text.push({
        i: `X ${(i + 1).toString()}`,
        part: "{" + DetAi_text + "}",
        divide: "`{`" + `${DetA.toString()}` + "`}`",
        result: X[i].toString(),
      });
    }

    setResult(X.map((num) => parseFloat(num.toFixed(6))));
    setmathExpression(text);
    console.log(X);
    console.log(text);
  };

  const calroot = () => {
    calcramer(size, matrix, constants);
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
        <Box bg={"white"} w={800} h={500} color={"black"}>
          <MathJax>
            {mathExpression.length > 1 &&
              mathExpression.map((r, index) => (
                <Box key={index}>
                  <MathJax>
                    {"`" +
                      r.i +
                      "`=`" +
                      `\\frac{${r.part}{${r.divide}}{6}` +
                      "`=`" +
                      r.result +
                      "```"}
                  </MathJax>
                </Box>
              ))}
          </MathJax>
        </Box>
      </Container>
    </>
  );
}

export default Cramer;
