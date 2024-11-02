import React from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Text,
  Container,
  Button,
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

const Plotly = dynamic(() => import("react-plotly.js"), { ssr: false });

function Compo() {
  const [solution, setSolution] = React.useState(" ");
  const [n, setN] = React.useState(0);
  const [Xstart, setXstart] = React.useState(0);
  const [Xend, setXend] = React.useState(0);
  const [result, setResult] = React.useState(0);
  const [chartdata, setchartdata] = React.useState<{ x: number; y: number }[]>(
    []
  );

  const calcompo = () => {
    const fx = (x: number) => {
      try {
        const f = evaluate(solution, { x: x });
        return f;
      } catch {
        return NaN;
      }
    };

    const h = (Xend - Xstart) / n;
    const area = h / 2;
    let result = 0;
    result += fx(Xstart) + fx(Xend);
    const chart = [];
    chart.push({
      x: Xstart,
      y: fx(Xstart),
    });

    for (let i = 0; i < n; i++) {
      if (i % 2 === 0) {
        result += 2 * fx(Xstart + i * h);
        chart.push({
          x: Xstart + i * h,
          y: fx(Xstart + i * h),
        });
      }
      if (i % 2 === 1) {
        result += 4 * fx(Xstart + i * h);
        chart.push({
          x: Xstart + i * h,
          y: fx(Xstart + i * h),
        });
      }
    }
    result *= area;
    chart.push({
      x: result,
      y: fx(Xend),
    });

    setchartdata(chart);
    setResult(result);
  };

  const chartlayout = {
    data: [
      {
        x: chartdata.map((data) => data.x),
        y: chartdata.map((data) => data.y),
        type: "scatter" as const,
      },
    ],
    layout: {
      width: 800,
      height: 400,
      title: "Composite Simpson",
      xaxis: {
        title: "X",
      },
      yaxis: {
        title: "Y",
      },
    },
  };

  const calroot = () => {
    calcompo();
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
          <Box px={20}>
            <Text mt={2} p={2}>
              <MathJax inline dynamic>
                {"`F(x) = $`".replaceAll("$", solution ? solution : "...")}
              </MathJax>
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="white" p={2}>
              <MathJax>{"`F(x)`"}</MathJax>
            </Text>
            <Input
              onChange={(e) => {
                console.log(e.target.value);
                setSolution(e.target.value);
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
                setN(valueAsNumber);
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
              colorScheme="red"
              borderColor={"white"}
              fontWeight="bold"
              fontSize={"lg"}
              onClick={() => {
                setSolution(" ");
                setN(0);
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
        <Box w={800} mt={2} color="white">
          {chartdata.length > 0 && (
            <Plotly data={chartlayout.data} layout={chartlayout.layout} />
          )}
          {/* {mathExpression.map((text, index) => (
            <Box key={index} p={3}>
              <BlockMath>{text}</BlockMath>
            </Box>
          ))} */}
        </Box>
      </Container>
    </>
  );
}

export default Compo;
