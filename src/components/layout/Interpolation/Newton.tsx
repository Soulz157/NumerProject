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
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Text,
  HStack,
  Input,
  Checkbox,
  ButtonGroup,
  Divider,
} from "@chakra-ui/react";
import { MathJax } from "better-react-mathjax";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

function Newton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [size, setSize] = React.useState(0);
  const [X, setX] = React.useState<number[]>([]);
  const [fx, setFx] = React.useState<number[]>([]);
  const [Xinput, setXinput] = React.useState(0);
  const [result, setResult] = React.useState(0);
  const [selectpoint, setSelectpoint] = React.useState<boolean[]>([false]);
  const [mathExpression, setmathExpression] = React.useState<string[]>([]);

  const fetchdata = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/info/Interpolation"
      );
      if (response.data.result) {
        const data = response.data.data;
        const random = Math.floor(Math.random() * data.length);
        // console.log(data[random]);
        const s = data[random].size;
        const x = data[random].x;
        console.log(x);
        const f = data[random].Fx;
        setSize(s);

        setX([...x]);
        setFx([...f]);

        setXinput(data[random].xvalue);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const Showmatrix = (valueAsNumber: number) => {
    if (valueAsNumber > 20) {
      return;
    }

    setSize(valueAsNumber);

    const newMatrix = Array.from({ length: valueAsNumber }, () =>
      Array(valueAsNumber).fill(0)
    );

    setX(newMatrix[0]);
    setFx(newMatrix[0]);
  };

  const recursivenewton = (Xvalue: number[], Fx: number[]) => {
    const n = Xvalue.length;
    const table = [...Array(n)].map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      table[i][0] = Fx[i];
    }

    for (let j = 1; j < n; j++) {
      for (let i = 0; i < n - j; i++) {
        table[i][j] =
          (table[i + 1][j - 1] - table[i][j - 1]) / (Xvalue[i + j] - Xvalue[i]);
      }
    }

    return table[0];
  };

  const calNewton = () => {
    const Xcal = [...X];
    const Fxcal = [...fx];
    const select = selectpoint
      .map((value, i) => (value ? i : null))
      .filter((value) => value !== null);
    // console.log(select);
    const text = [];
    if (select.length < 2) {
      onOpen();
      return;
    }

    const Xselect = select.map((value) => Xcal[value]);
    const Fxselect = select.map((value) => Fxcal[value]);

    const confficients = recursivenewton(Xselect, Fxselect);
    const tmp = confficients.map((c, index) => `X${index} = ${c}`).join(",");
    text.push(`\\text{Value: } ${tmp}`);

    let result = confficients[0];
    let temp = 1;
    let reslatex = `${confficients[0]}`;

    for (let i = 1; i < confficients.length; i++) {
      temp = temp * (Xinput - Xselect[i - 1]);
      result += confficients[i] * temp;
      reslatex += ` + (${confficients[i]}) \\cdot (${Xinput} - ${
        Xselect[i - 1]
      })`;
    }
    text.push(`Fx(${Xinput}) = ${reslatex}`);
    text.push(`\\text{Result: } Fx(${Xinput}) = ${result}`);

    setmathExpression(text);
    setResult(result);
  };

  const calroot = () => {
    if (size < 2) {
      onOpen();
    }
    calNewton();
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
                  Error!!
                </AlertDialogHeader>

                <AlertDialogBody>
                  <Text>Please input Number of point more than 2</Text>
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
          <MathJax>Number of points</MathJax>
          <NumberInput
            m={2}
            mt={3}
            value={size || 0}
            defaultValue={0}
            min={0}
            max={5}
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

          <Text p={2}>X : Value</Text>

          <NumberInput
            m={2}
            defaultValue={0}
            value={Xinput || 0}
            variant="filled"
            size="md"
            _placeholder={{ opacity: 1, color: "gray.500" }}
            onChange={(valueAsString, valueAsNumber) => {
              setXinput(valueAsNumber);
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
                setX([]);
                setFx([]);
                setResult(0);
                setXinput(0);
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
          {size > 0 &&
            X.map((col, j) => (
              <>
                <HStack>
                  <Checkbox
                    key={j}
                    size="md"
                    colorScheme="teal"
                    isChecked={selectpoint[j] || false}
                    onChange={() => {
                      const updated = [...selectpoint];
                      updated[j] = !updated[j];
                      setSelectpoint(updated);
                    }}
                  ></Checkbox>
                  <MathJax>{"`X$ :`".replaceAll("$", j.toString())}</MathJax>
                  <NumberInput
                    defaultValue="0"
                    value={X[j] || 0}
                    m={2}
                    onChange={(valueAsString, valueAsNumber) => {
                      const newMatrix = [...X];
                      newMatrix[j] = valueAsNumber;
                      setX(newMatrix);
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
                  <MathJax>
                    {"`F(X$) : `".replaceAll("$", j.toString())}
                  </MathJax>
                  <NumberInput
                    defaultValue="0"
                    value={fx[j] || 0}
                    m={2}
                    onChange={(valueAsString, valueAsNumber) => {
                      const newMatrix = [...fx];
                      newMatrix[j] = valueAsNumber;
                      setFx(newMatrix);
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
            <MathJax>
              {"`F($)`".replaceAll("$", Xinput ? Xinput.toString() : "x")}
            </MathJax>
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

export default Newton;
