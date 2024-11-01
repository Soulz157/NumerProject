import React from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Text,
  Container,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  Stack,
  Input,
} from "@chakra-ui/react";
import { MathJax } from "better-react-mathjax";
import { evaluate } from "mathjs";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

function Trapezoidal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [functionInput, setFunctionInput] = React.useState("...");
  const [Xstart, setXstart] = React.useState(0);
  const [Xend, setXend] = React.useState(0);
  const [result, setResult] = React.useState(0);
  const [mathExpression, setmathExpression] = React.useState<string[]>([]);

  const calTrap = () => {
    const fx = (x: number) => {
      try {
        const f = evaluate(functionInput, { x: x });
        return f;
      } catch {
        return NaN;
      }
    };

    const h = (Xend - Xstart) / 2;
    const result = h * (fx(Xstart) + fx(Xend));
    const text = [];
    text.push(`f(x_{0}) = f(${Xstart}) = ${fx(Xstart)}`);
    text.push(`f(x_{1}) = f(${Xend}) = ${fx(Xend)}`);
    text.push(
      `F(x) = \\frac{h}{2} \\cdot (f(a) + f(b)) = {${h}} \\cdot (${fx(
        Xstart
      )} + ${fx(Xend)}) = ${result}`
    );
    setmathExpression(text);
    setResult(result);
  };

  const getGraphData = () => {
    const fx = (x: number) => {
      try {
        const f = evaluate(functionInput, { x: x });
        return f;
      } catch {
        return NaN;
      }
    };
    const xvalue: number[] = [];
    const yvalue: number[] = [];

    for (let i = Xstart - 1; i <= Xend + 1; i += 0.1) {
      xvalue.push(i);
      const y = fx(i);
      yvalue.push(y);
    }

    return {
      x: xvalue,
      y: yvalue,
      type: "scatter",
      mode: "lines",
      line: { color: "blue" },
    };
  };

  const getShadeData = () => {
    const fx = (x: number) => {
      try {
        const f = evaluate(functionInput, { x: x });
        return f;
      } catch {
        return NaN;
      }
    };
    const xFill = [Xstart, Xend, Xend, Xstart];
    const yFill = [
      0,
      Number.isNaN(parseFloat(fx(Xstart))) ? 0 : parseFloat(fx(Xstart)),
      Number.isNaN(parseFloat(fx(Xstart))) ? 0 : parseFloat(fx(Xend)),
      0,
    ];

    return {
      x: xFill,
      y: yFill,
      fill: "tozeroy",
      type: "scatter",
      mode: "lines",
      fillcolor: "rgba(0, 100, 255, 0.3)",
      line: { color: "rgba(0, 100, 255, 0)" },
    };
  };

  const Checkfunc = (x: number) => {
    try {
      evaluate(functionInput, { x: x });
    } catch {
      onOpen();
    }
  };

  const calroot = () => {
    Checkfunc(Xstart);
    calTrap();
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
            <Text mt={2} p={4}>
              <MathJax inline dynamic>
                {"`F(x) = $`".replaceAll(
                  "$",
                  functionInput ? functionInput : "..."
                )}
              </MathJax>
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="white" p={2}>
              <MathJax>{"`F(x)`"}</MathJax>
            </Text>
            <Input
              onChange={(e) => {
                console.log(e.target.value);
                setFunctionInput(e.target.value);
              }}
              variant="filled"
              size="md"
              placeholder="f(x) = x^2 - 4"
              _placeholder={{ opacity: 1, color: "gray.500" }}
              isInvalid
              errorBorderColor="gray.500"
            />
          </Box>
          <HStack p={4}>
            <Stack>
              <Box>
                <Text fontSize="md" fontWeight="bold" color="white" p={2}>
                  <MathJax>{"`X Start`"}</MathJax>
                </Text>

                <NumberInput
                  m={2}
                  defaultValue={0}
                  variant="filled"
                  size="md"
                  _placeholder={{ opacity: 1, color: "gray.500" }}
                  onChange={(valueAsString, valueAsNumber) => {
                    setXstart(valueAsNumber);
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
                <Text fontSize="md" fontWeight="bold" color="white" p={2}>
                  <MathJax>{"`X End`"}</MathJax>
                </Text>
                <NumberInput
                  m={2}
                  defaultValue={0}
                  variant="filled"
                  size="md"
                  _placeholder={{ opacity: 1, color: "gray.500" }}
                  onChange={(valueAsString, valueAsNumber) => {
                    setXend(valueAsNumber);
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
        <Box p={2}></Box>
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
            <Text>I</Text>
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
        <Box mt={2}>
          <Plot
            data={[
              getGraphData() as Plotly.Data,
              getShadeData() as Plotly.Data,
            ]}
            layout={{
              width: 800,
              height: 400,
              title: "Trapezoidal Rule",
              xaxis: {
                title: "X",
              },
              yaxis: {
                title: "Y",
              },
            }}
          />
        </Box>
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

export default Trapezoidal;
