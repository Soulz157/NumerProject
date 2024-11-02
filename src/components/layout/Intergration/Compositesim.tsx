import React from "react";
import axios from "axios";
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
  ButtonGroup,
} from "@chakra-ui/react";
import { MathJax } from "better-react-mathjax";
import { evaluate } from "mathjs";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const Plotly = dynamic(() => import("react-plotly.js"), { ssr: false });

function Compositesim() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [functionInput, setFunctionInput] = React.useState("...");
  const [Xstart, setXstart] = React.useState(0);
  const [Xend, setXend] = React.useState(0);
  const [n, setn] = React.useState(0);
  const [result, setResult] = React.useState(0);
  const [mathExpression, setmathExpression] = React.useState<string[]>([]);
  const [chartdata, setchartdata] = React.useState<
    {
      x: number;
      y: number;
    }[]
  >([]);

  const fetchdata = async () => {
    const respone = await axios.get("http://localhost:8000/info/Integration");
    console.log(respone.data);
    if (respone.data.result) {
      const data = respone.data.data;
      const random = Math.floor(Math.random() * data.length);
      const so = data[random].solution;
      const area = data[random].n;
      const xs = data[random].xstart;
      const xe = data[random].xend;

      setn(area);
      setFunctionInput(so);
      setXstart(xs);
      setXend(xe);
    }
  };

  const Check = (x: number) => {
    try {
      const f = evaluate(functionInput, { x: x });
      return f;
    } catch {
      onOpen();
    }
  };

  const calsimpson = () => {
    const fx = (x: number) => {
      try {
        const f = evaluate(functionInput, { x: x });
        return f;
      } catch {
        return NaN;
      }
    };
    const chart = [];
    const h = (Xend - Xstart) / n;
    const area = h / 2;
    let result = 0;
    result += fx(Xstart) + fx(Xend);
    chart.push({
      x: Xstart,
      y: result,
    });

    for (let i = 1; i < n * 2 - 1; i++) {
      if (i % 2 === 0) {
        result += 2 * fx(Xstart + i * area);
        chart.push({
          x: Xstart + i * area,
          y: result,
        });
      } else {
        result += 4 * fx(Xstart + i * area);
        chart.push({
          x: Xstart + i * area,
          y: result,
        });
      }
    }

    result *= area / 3;

    const text = [];
    text.push(
      `F(x) = \\frac{h}{3} \\cdot \\left(f(a) + f(b) + 4 \\sum_{i=1}^{N-1} f(x_{i}) + 2 \\sum_{i=2}^{N-2} f(x_{i}) \\right)`
    );
    text.push(`h = \\frac{${Xend} - ${Xstart}}{${n}} = ${h}`);
    text.push(`!Tip\\frac{${h}}2 = ${area}`);

    setchartdata(chart);
    setmathExpression(text);
    setResult(parseFloat(result.toFixed(6)));
  };

  const calroot = () => {
    Check(Xstart);
    calsimpson();
  };

  const getGraphData: {
    data: Partial<Plotly.PlotData>[];
    layout: Partial<Plotly.Layout>;
  } = {
    data: [
      {
        name: "F(x)",
        x: chartdata.map((data) => data.x),
        y: chartdata.map((data) => data.y),
        type: "scatter",
        mode: "lines",
        line: { color: "blue" },
      },
      {
        name: "Area",
        x: chartdata.map((point) => point.x),
        y: chartdata.map((point) => point.y),
        fill: "tozeroy",
        type: "scatter" as const,
        mode: "lines" as const,
        fillcolor: "rgba(0, 100, 255, 0.3)",
        line: { color: "rgba(0, 100, 255, 0)" },
      },
    ],
    layout: {
      title: "Simpson's Rule",
      xaxis: {
        title: "X",
        showline: true,
      },
      yaxis: {
        title: "Y",
        showline: true,
      },
    },
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
            <Text mt={2} p={2}>
              <MathJax inline dynamic>
                {"`\\int_{a}^{b} \\ $`"
                  .replaceAll("a", Xstart.toString())
                  .replaceAll("b", Xend.toString())
                  .replaceAll("$", functionInput ? functionInput : "...")}
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
          <Box px={20} mt={5}>
            <Text fontSize="lg" fontWeight="bold" color="white" p={2}>
              <MathJax>{"`N`"}</MathJax>
            </Text>
            <NumberInput
              m={2}
              defaultValue={0}
              variant="filled"
              size="md"
              _placeholder={{ opacity: 1, color: "gray.500" }}
              onChange={(valueAsString, valueAsNumber) => {
                setn(valueAsNumber);
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
          <ButtonGroup gap={2}>
            <Button
              variant="outline"
              borderColor={"gray.500"}
              fontWeight="bold"
              fontSize={"lg"}
              onClick={calroot}
            >
              Calculate
            </Button>
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
              colorScheme="red"
              borderColor={"white"}
              fontWeight="bold"
              fontSize={"lg"}
              onClick={() => {
                setFunctionInput("...");
                setn(0);
                setXstart(0);
                setXend(0);
                setResult(0);
                setchartdata([]);
              }}
            >
              Reset
            </Button>
          </ButtonGroup>
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
          <Plotly data={getGraphData.data} layout={getGraphData.layout} />
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

export default Compositesim;
