import React from "react";
import {
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
  Box,
  Container,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  Input,
  Select,
} from "@chakra-ui/react";
import { MathJax } from "better-react-mathjax";
import { evaluate } from "mathjs";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

function Divied() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [select, setSelect] = React.useState("");
  const [Direc, setDirec] = React.useState("");
  const [Error, setError] = React.useState("");
  const [Xinput, setXinput] = React.useState(0);
  const [H, setH] = React.useState(0);
  const [functionInput, setFunctionInput] = React.useState("...");
  const [result, setResult] = React.useState(0);
  const [mathExpression, setmathExpression] = React.useState<string[]>([]);

  function FirstDivied(
    error: string,
    direc: string,
    h: number,
    x: number,
    func: string
  ) {
    const text = [];
    const Fx = (x: number) => {
      try {
        const f = evaluate(func, { x: x });
        return f;
      } catch {
        return NaN;
      }
    };
    if (error === "1") {
      if (direc === "forward") {
        const result = (Fx(x + h) - Fx(x)) / h;
        text.push(`{f'(x)} = \\frac{f(x_i + 1) - f(x)}{h}`);
        text.push(
          `{f'(${Xinput})} = \\frac{f(${Xinput} + ${H}) - f(${Xinput})}{${H}}`
        );
        text.push(`f'(${Xinput}) =  ${result}`);
        setmathExpression(text);
        return result;
      }

      if (direc === "backward") {
        const result = (Fx(x) - Fx(x - h)) / h;
        text.push(`f'(x) = \\frac{f(x + h) - f(x)}{h}`);
        text.push(
          `f'(${Xinput}) = \\frac{f(${Xinput} + ${H}) - f(${Xinput})}{${H}}`
        );
        text.push(`f'(${Xinput}) = ${result}`);
        setmathExpression(text);
        return result;
      }

      if (direc === "central") {
        const result = (Fx(x + h) - Fx(x - h)) / (2 * h);
        text.push(`f'(x) = \\frac{f(x + h) - f(x - h)}{2h}`);
        text.push(
          `f'(${Xinput}) = \\frac{f(${Xinput} + ${H}) - f(${Xinput})}{${H}}`
        );
        text.push(`f'(${Xinput}) = ${result}`);
        setmathExpression(text);
        return result;
      }
    } else if (error === "2") {
      if (direc === "forward") {
        const result = (-Fx(x + 2 * h) + 4 * Fx(x + h) - 3 * Fx(x)) / (2 * h);
        text.push(`f'(x) = \\frac{-f(x + 2h) + 4f(x + h) - 3f(x)}{2h}`);
        text.push(
          `f'(${Xinput}) = \\frac{-f(${Xinput} + 2${H}) + 4f(${Xinput} + ${H}) - 3f(${Xinput})}{2(${H})}`
        );
        text.push(`f'(${Xinput}) = ${result}`);
        setmathExpression(text);
        return result;
      }

      if (direc === "backward") {
        const result = (3 * Fx(x) - 4 * Fx(x - h) + Fx(x - 2 * h)) / (2 * h);
        text.push(`f'(x) = \\frac{3f(x) - 4f(x - h) + f(x - 2h)}{2h}`);
        text.push(
          `f'(${Xinput}) = \\frac{3f(${Xinput}) - 4f(${Xinput} - ${H}) + f(${Xinput} - 2${H})}{2(${H})}`
        );
        text.push(`f'(${Xinput}) = ${result}`);
        setmathExpression(text);
        return result;
      }

      if (direc === "central") {
        const result =
          (-Fx(x + 2 * h) + 8 * Fx(x + h) - 8 * Fx(x - h) + Fx(x - 2 * h)) /
          (12 * h);
        text.push(
          `f'(x) = \\frac{-f(x + 2h) + 8f(x + h) - 8f(x - h) + f(x - 2h)}{12h}`
        );
        text.push(
          `f'(${Xinput}) = \\frac{-f(${Xinput} + 2(${H})) + 8f(${Xinput} + ${H}) - 8f(${Xinput} - ${H}) + f(${Xinput} - 2(${H}))}{12(${H})}`
        );
        text.push(`f'(${Xinput}) = ${result}`);
        setmathExpression(text);
        return result;
      }
    } else if (error === "3") {
      if (direc === "forward") {
        const result =
          (-25 * Fx(x) +
            48 * Fx(x + h) -
            36 * Fx(x + 2 * h) +
            16 * Fx(x + 3 * h) -
            3 * Fx(x + 4 * h)) /
          (12 * h);
        text.push(
          `f'(x) = \\frac{-2f(x + 5h) + 11f(x + 4h) - 24f(x + 3h) + 26f(x + 2h) - 14f(x + h) + 3f(x)}{h^4}`
        );
        text.push(
          `f'(${Xinput}) = \\frac{-2f(${Xinput} + 5(${H})) + 11f(${Xinput} + 4(${H})) - 24f(${Xinput} + 3(${H})) + 26f(${Xinput} + 2(${H})) - 14f(${Xinput} + ${H}) + 3f(${Xinput})}{(${H})^4}`
        );
        text.push(`f'(${Xinput}) = ${result}`);

        setmathExpression(text);
        return result;
      }

      if (direc === "backward") {
        const result =
          (25 * Fx(x) -
            48 * Fx(x - h) +
            36 * Fx(x - 2 * h) -
            16 * Fx(x - 3 * h) +
            3 * Fx(x - 4 * h)) /
          (12 * h);

        text.push(
          `f'(x) = \\frac{25f(x) -
            48f(x - h) +
            36f(x - 2h) -
            16f(x - 3h) +
            3f(x - 4h)} {
          12h};`
        );
        text.push(`f'(${Xinput}) = \\frac{25f(${Xinput}) - 48f(${Xinput} - ${H}) +
            36f(${Xinput} -2(${H})) -
            16f(${Xinput} -_(${H})) +
            3f(${Xinput} -4(${H})))}{(${H})^12}`);
        text.push(`f'(${Xinput}) = ${result}`);

        setmathExpression(text);
        return result;
      }

      if (direc === "central") {
        const result =
          (-Fx(x + 2 * h) + 8 * Fx(x + h) - 8 * Fx(x - h) + Fx(x - 2 * h)) /
          (12 * h);
        text.push(
          `f'(x) = \\frac{-f(x + 2h) -
           + 8fx(x + h) - 8f(x - h) + f(x - 2h)} {
          12h};`
        );
        text.push(
          `f'(${Xinput}) = \\frac{-f(${Xinput} + 2(${H})) + 8f(${Xinput} + ${H}) - 8f(${Xinput} - ${H}) + f(${Xinput} -2(${H})))}{(${H})^12}`
        );
        text.push(`f'(${Xinput}) = ${result}`);

        setmathExpression(text);
        return result;
      }
    }
  }

  function SecondDivied(
    error: string,
    direc: string,
    h: number,
    x: number,
    func: string
  ) {
    const text = [];
    const Fx = (x: number) => {
      try {
        const f = evaluate(func, { x: x });
        return f;
      } catch {
        return NaN;
      }
    };
    if (error === "1") {
      if (direc === "forward") {
        const result = (Fx(x + 2 * h) - 2 * Fx(x + h) + Fx(x)) / Math.pow(h, 2);
        text.push(`f''(x) = \\frac{f(x + 2h) - 2f(x + h) + f(x)}{h^2}`);
        text.push(
          `f''(${Xinput}) = \\frac{f(${Xinput} + 2(${H})) - 2f(${Xinput} + (${H})) + f(${Xinput})}{(${H})^2}`
        );
        text.push(`f''(${Xinput}) = ${result}`);
        setmathExpression(text);
        return result;
      }

      if (direc === "backward") {
        const result = (Fx(x) - 2 * Fx(x - h) + Fx(x - 2 * h)) / Math.pow(h, 2);
        text.push(`f''(x) = \\frac{f(x) - 2f(x - h) + f(x - 2h)}{h^2}`);
        text.push(
          `f''(${Xinput}) = \\frac{f(${Xinput}) - 2f(${Xinput} - (${H})) + f(${Xinput} - 2(${H}))}{(${H})^2}`
        );
        text.push(`f''(${Xinput}) = ${result}`);

        setmathExpression(text);
        return result;
      }

      if (direc === "central") {
        const result = (Fx(x + h) - 2 * Fx(x) + Fx(x - h)) / Math.pow(h, 2);
        text.push(`f''(x) = \\frac{f(x + h) - 2f(x) + f(x - h)}{h^2}`);
        text.push(
          `f''(${Xinput}) = \\frac{f(${Xinput} + (${H}) - 2f(${Xinput}) + f(${Xinput} - (${H}))}{(${H})^2}`
        );
        text.push(`f''(${Xinput}) = ${result}`);

        setmathExpression(text);
        return result;
      }
    } else if (error === "2") {
      if (direc === "forward") {
        const result =
          (-Fx(x + 3 * h) + 4 * Fx(x + 2 * h) - 5 * Fx(x + h) + 2 * Fx(x)) /
          Math.pow(h, 2);
        text.push(
          `f''(x) = \\frac{-f(x + 3h) + 4f(x + 2h) - 5f(x + h) + 2f(x)}{h^2}`
        );
        text.push(
          `f''(${Xinput}) = \\frac{-f(${Xinput} + 3(${H})) + 4f(${Xinput} + 2(${H})) - 5f(${Xinput} + (${H})) + 2f(${Xinput})}{(${H})^2}`
        );
        text.push(`f''(${Xinput}) = ${result}`);

        setmathExpression(text);
        return result;
      }
      if (direc === "backward") {
        const result =
          (2 * Fx(x) - 5 * Fx(x - h) + 4 * Fx(x - 2 * h) - Fx(x - 3 * h)) /
          Math.pow(h, 2);
        text.push(
          `f''(x) = \\frac{2f(x) - 5f(x - h) + 4f(x - 2h) - f(x - 3h)}{h^2}`
        );
        text.push(
          `f''(${Xinput}) = \\frac{2f(${Xinput}) - 5f(${Xinput} - (${H})) + 4f(${Xinput} - 2(${H})) - f(${Xinput} - 3(${H}))}{(${H})^2}`
        );
        text.push(`f''(${Xinput}) = ${result}`);

        setmathExpression(text);
        return result;
      }
      if (direc === "central") {
        const result = (Fx(x + h) - 2 * Fx(x) + Fx(x - h)) / Math.pow(h, 2);
        text.push(`f''(x) = \\frac{f(x + h) - 2f(x) + f(x - h)}{h^2}`);
        text.push(
          `f''(${Xinput}) = \\frac{f(${Xinput} + (${H}) - 2f(${Xinput}) + f(${Xinput} - (${H}))}{(${H})^2}`
        );
        text.push(`f''(${Xinput}) = ${result}`);

        setmathExpression(text);
        return result;
      }
    } else if (error === "3") {
      if (direc === "forward") {
        const result =
          (35 * Fx(x) -
            104 * Fx(x + h) -
            114 * Fx(x + 2 * h) -
            56 * Fx(x + 3 * h) +
            11 * Fx(x + 4 * h)) /
          (12 * Math.pow(h, 4));
        text.push(
          `f''(x) = \\frac{35f(x) - 104f(x + h) - 114f(x + 2h) - 56f(x + 3h) + 11f(x + 4h)}{12h^4}`
        );
        text.push(
          `f''(${Xinput}) = \\frac{35f(${Xinput}) - 104f(${Xinput} + (${H})) - 114f(${Xinput} + 2(${H})) - 56f(${Xinput} + 3(${H})) + 11f(${Xinput} + 4(${H}))}{12(${H})^4}`
        );
        text.push(`f''(${Xinput}) = ${result}`);

        setmathExpression(text);
        return result;
      }
      if (direc === "backward") {
        const result =
          (35 * Fx(x) -
            104 * Fx(x - h) +
            114 * Fx(x - 2 * h) -
            56 * Fx(x - 3 * h) +
            11 * Fx(x - 4 * h)) /
          (12 * Math.pow(h, 4));
        text.push(
          `f''(x) = \\frac{35f(x) - 104f(x - h) + 114f(x - 2h) - 56f(x - 3h) + 11f(x - 4h)}{12h^4}`
        );
        text.push(
          `f''(${Xinput}) = \\frac{35f(${Xinput}) - 104f(${Xinput} - (${H})) + 114f(${Xinput} - 2(${H})) - 56f(${Xinput} - 3(${H})) + 11f(${Xinput} - 4(${H}))}{12(${H})^4}`
        );
        text.push(`f''(${Xinput}) = ${result}`);

        setmathExpression(text);
        return result;
      }
      if (direc === "central") {
        const result =
          (-Fx(x + 2 * h) +
            16 * Fx(x + h) -
            30 * Fx(x) +
            16 * Fx(x - h) -
            Fx(x - 2 * h)) /
          (12 * Math.pow(h, 4));
        text.push(
          `f''(x) = \\frac{-f(x + 2h) + 16f(x + h) - 30f(x) + 16f(x - h) - f(x - 2h)}{12h^4}`
        );
        text.push(
          `f''(${Xinput}) = \\frac{-f(${Xinput} + 2(${H})) + 16f(${Xinput} + (${H})) - 30f(${Xinput}) + 16f(${Xinput} - (${H})) - f(${Xinput} - 2(${H}))}{12(${H})^4}`
        );
        text.push(`f''(${Xinput}) = ${result}`);

        setmathExpression(text);
        return result;
      }
    }
  }

  const Check = (x: number) => {
    try {
      const f = evaluate(functionInput, { x: x });
      return f;
    } catch {
      onOpen();
    }
  };

  const calroot = () => {
    Check(Xinput);

    if (select === "1") {
      // console.log("First Divied");
      const res = FirstDivied(Error, Direc, Xinput, H, functionInput);
      console.log(res);
      setResult(res !== undefined ? res : 0);
    }
    if (select === "2") {
      // console.log("Second Divied");
      const res = SecondDivied(Error, Direc, Xinput, H, functionInput);
      setResult(res !== undefined ? res : 0);
    }
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
          <Box p={2}>
            <Text mb={5} p={2}>
              <MathJax inline dynamic>
                {"`F(x) = $`".replaceAll(
                  "$",
                  functionInput ? functionInput : "..."
                )}
              </MathJax>
            </Text>
            <HStack spacing={3}>
              <Select
                placeholder="Order"
                onChange={(e) => setSelect(e.target.value)}
              >
                <option value="1">First Divied</option>
                <option value="2">Second Divied</option>
              </Select>
              <Select
                placeholder="Directions"
                onChange={(e) => setDirec(e.target.value)}
              >
                <option value="forward">Forward</option>
                <option value="backward">Backward</option>
                <option value="central">Central</option>
              </Select>
              <Select
                placeholder="Error"
                onChange={(e) => setError(e.target.value)}
              >
                <option value="1">O(h)</option>
                <option value="2">O(h^2)</option>
                <option value="3">O(h^4)</option>
              </Select>
            </HStack>
            <Box mt={2} px={20}>
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
                placeholder="-"
                isInvalid
                errorBorderColor="gray.700"
              />
            </Box>
            <HStack spacing={3} mt={3}>
              <Box>
                <Text fontSize="md" fontWeight="bold" color="white" p={2}>
                  <MathJax>{"`X`"}</MathJax>
                </Text>
                <NumberInput
                  m={2}
                  defaultValue={0}
                  variant="filled"
                  size="md"
                  onChange={(valueAsString, valueAsNumber) => {
                    setXinput(valueAsNumber);
                    console.log(valueAsNumber);
                  }}
                >
                  <NumberInputField borderColor={"gray.700"} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
              <Box>
                <Text fontSize="md" fontWeight="bold" color="white" p={2}>
                  <MathJax>{"`H`"}</MathJax>
                </Text>
                <NumberInput
                  m={2}
                  defaultValue={0}
                  variant="filled"
                  size="md"
                  onChange={(valueAsString, valueAsNumber) => {
                    setH(valueAsNumber);
                    console.log(valueAsNumber);
                  }}
                >
                  <NumberInputField borderColor={"gray.700"} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
            </HStack>
            <Box p={2} mt={2}>
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
          </Box>
        </Box>
        <Box p={2}>
          <Text fontSize="lg" fontWeight="bold" color="white">
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

export default Divied;
