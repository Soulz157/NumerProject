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
import FirstDivied from "./FirstDivied";
import SecondDivied from "./SecondDivied";

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
      const res = FirstDivied(Error, Direc, Xinput, H, [Check(0)]);
      setResult(res !== undefined ? res : 0);
    }
    if (select === "2") {
      console.log("Second Divied");
      const res = SecondDivied(Error, Direc, Xinput, H, [Check(0)]);
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
                <option value="F">Forward</option>
                <option value="B">Backward</option>
                <option value="C">Central</option>
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
        <Box bg={"white"} w={800} h={500}>
          {" "}
        </Box>
      </Container>
    </>
  );
}

export default Divied;
