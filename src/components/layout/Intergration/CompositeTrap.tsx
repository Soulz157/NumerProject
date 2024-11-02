import React from "react";
import axios from "axios";
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

function CompositeTrap() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [functionInput, setFunctionInput] = React.useState("...");
  const [Xstart, setXstart] = React.useState(0);
  const [Xend, setXend] = React.useState(0);
  const [n, setn] = React.useState(0);
  const [result, setResult] = React.useState(0);
  // const [chartdata, setchartdata] = React.useState<any>([]);
  const [mathExpression, setmathExpression] = React.useState<string[]>([]);

  const readdata = async () => {
    const respone = await axios.get(
      "http://192.168.1.136:8000/info/Integration"
    );
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

  const calTrap = () => {
    const fx = (x: number) => {
      try {
        const f = evaluate(functionInput, { x: x });
        return f;
      } catch {
        return NaN;
      }
    };
    let result = 0;
    result += fx(Xstart) + fx(Xend);

    const h = (Xend - Xstart) / n;
    for (let i = 1; i < n; i++) {
      result += 2 * fx(Xstart + i * h);
    }

    result *= h / 2;
    const text = [];
    text.push(
      `F(x) = \\frac{h}{2} \\cdot (f(a) + f(b)) + 2 \\sum_{i=1}^{N-1} f(x_{i})`
    );
    text.push(`h = \\frac{${Xend} - ${Xstart}}{${n}} = ${h}`);
    text.push(
      `F(x) = \\frac{${h}}{2} \\cdot \\left(${fx(Xstart)} + ${fx(
        Xend
      )} + 2 \\sum_{i=1}^{${n - 1}} f(x_{i}) \\right) = ${result}`
    );
    setmathExpression(text);
    setResult(parseFloat(result.toFixed(6)));
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
            <Text mt={2} p={2}>
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
          <ButtonGroup>
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
                readdata();
              }}
            >
              Random
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

export default CompositeTrap;
