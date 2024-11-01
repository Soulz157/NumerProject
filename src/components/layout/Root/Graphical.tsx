import React from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import {
  Box,
  Text,
  Input,
  Button,
  Grid,
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  ButtonGroup,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { evaluate } from "mathjs";
import { MathJax } from "better-react-mathjax";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

function Graphical() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [functionInput, setFunctionInput] = React.useState("x^2 - 4");
  const [xstart, setxstart] = React.useState(0.0);
  const [xend, setxend] = React.useState(0.0);
  const [X, setX] = React.useState(0.0);
  const [data, setData] = React.useState([
    {
      iteration: 0,
      xl: 0,
      xr: 0,
      xm: 0,
    },
  ]);
  const [datachart, setDatachart] = React.useState([{ x: 0, y: 0 }]);

  const fetchdata = async () => {
    try {
      const response = await axios.get("http://localhost:8000/info/root");
      if (response.data.result) {
        const data = response.data.data;
        const random = Math.floor(Math.random() * data.length);
        const func = data[random].solution;
        const xs = data[random].xl;
        const xe = data[random].xr;
        console.log(func);
        console.log(xs);
        console.log(xe);
        setFunctionInput(func);
        setxstart(xs);
        setxend(xe);
        // setData([]);
        // setDatachart([]);
        setX(0.0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const calGraphical = (xl: number, xr: number) => {
    const fx = (x: number) => {
      try {
        const f = evaluate(functionInput, { x: x });
        return f;
      } catch {
        return NaN;
      }
    };

    let Fxl,
      // ea = 1,
      Fxr,
      l = xl,
      r = xr;
    const e = 0.000001;
    // const MAX = 50;
    let iter = 0;
    const obj = [];
    const graphdata = [];

    for (let i = xl; i < xr; i += 0.01) {
      Fxl = fx(i);
      Fxr = fx(i + 0.01);
      if (Fxl * Fxr < 0) {
        l = i;
        r = i + 0.01;
        break;
      }
    }

    while (l <= r && iter < 50) {
      const fxs = fx(l);
      const fxplus = fx(l + e);

      if (fxs * fxplus < 0) {
        break;
      }

      obj.push({
        iteration: iter,
        xl: xl,
        xr: xr,
        xm: l,
      });

      graphdata.push({ x: l, y: fxs });

      l += e;
      iter++;
      // ea = Math.abs(fxplus);
    }

    if (xl !== undefined) {
      setData(obj as never[]);
      setDatachart(graphdata as never[]);
      setX(l);
    }
  };

  const Chartdata = {
    data: [
      {
        x: datachart.map((d) => d.x),
        y: datachart.map((d) => d.y),
        type: "scatter",
        mode: "lines+markers",
        marker: { color: "red" },
        line: { color: "blue" },
      },
    ],

    layout: {
      title: "Graphical Method",
      xaxis: {
        title: "X",
      },
      yaxis: {
        title: "F(x)",
      },
    },
  };

  const Checkfunction = (x: number) => {
    try {
      evaluate(functionInput, { x: x });
    } catch {
      onOpen();
    }
  };

  const calroot = () => {
    Checkfunction(xstart);

    calGraphical(xstart, xend);
  };

  return (
    <>
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
      <Box
        textAlign="center"
        fontSize="xl"
        marginBottom={15}
        fontWeight="bold"
        padding={5}
        h={"max-content"}
      >
        <Grid
          h="full"
          // templateRows="repeat(2, 1fr)"
          templateColumns="repeat(5, 1fr)"
          gap={4}
          borderRadius={10}
          // justifyContent={"center"}
          boxShadow={"lg"}
        >
          <GridItem
            rowSpan={2}
            colSpan={1}
            color="whiteAlpha.800"
            borderRadius={10}
            h={"full"}
          >
            <Box>
              <Text fontSize="xl" fontWeight="bold" color="white">
                <MathJax>{"`F(x)`"}</MathJax>
              </Text>
              <Box padding={2}>
                <Input
                  // value={functionInput}
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
                <Text mt={2}>
                  <MathJax>
                    {"`F(x) = $`".replaceAll(
                      "$",
                      functionInput ? functionInput : ""
                    )}
                  </MathJax>
                </Text>
              </Box>
            </Box>
            <Box>
              <Text fontSize="xl" fontWeight="bold" color="white">
                <MathJax>{"`X Start`"}</MathJax>
              </Text>
              <Box padding={2}>
                <NumberInput
                  value={xstart ? xstart : 0}
                  onChange={(valueAsString, valueAsNumber) => {
                    setxstart(valueAsNumber);
                  }}
                  variant="filled"
                  size="md"
                  defaultValue={0.0}
                  _placeholder={{ opacity: 1, color: "gray.500" }}
                  isInvalid
                  errorBorderColor="gray.500"
                >
                  <NumberInputField />
                </NumberInput>
              </Box>
              <Box>
                <Text fontSize="xl" fontWeight="bold" color="white">
                  <MathJax>{"`X End`"}</MathJax>
                </Text>
                <Box padding={2}>
                  <NumberInput
                    value={xend ? xend : 0}
                    onChange={(valueAsString, valueAsNumber) => {
                      setxend(parseFloat(valueAsNumber.toString()));
                    }}
                    variant="filled"
                    size="md"
                    _placeholder={{ opacity: 1, color: "gray.500" }}
                    isInvalid
                    errorBorderColor="gray.500"
                  >
                    <NumberInputField />
                  </NumberInput>
                </Box>
              </Box>
              <Box mt={10}>
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
              </Box>
              <Box mt={10}>
                <Text fontSize="xl" fontWeight="bold" color="white">
                  Result
                </Text>
                <Box padding={2}>
                  <Input
                    variant="filled"
                    width={"max-content"}
                    size="md"
                    placeholder={"Result"}
                    _placeholder={{ opacity: 1, color: "gray.500" }}
                    isReadOnly
                    errorBorderColor="gray.500"
                    value={X}
                  />
                </Box>
              </Box>
            </Box>
          </GridItem>
          <GridItem colSpan={4} padding={2} mb={2}>
            <Box
              textAlign={"center"}
              h="max-content"
              padding={2}
              boxShadow={"lg"}
            >
              <Text fontSize="xl" fontWeight="bold" color="white">
                Graph
              </Text>
              <Box mt="2">
                <Plot
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  data={Chartdata.data as Plotly.Data[]}
                  layout={Chartdata.layout}
                />
              </Box>
            </Box>
          </GridItem>
          <GridItem colSpan={4} alignItems={"center"} w="full">
            <Box textAlign={"center"}>
              <Text fontSize="xl" fontWeight="bold" color="white">
                Table
              </Text>
              {data.length > 0 && (
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th text-align={"start"} w={160}>
                          Iteration
                        </Th>
                        <Th text-align={"center"}>XL</Th>
                        <Th text-align={"center"}>XM</Th>
                        <Th text-align={"center"}>XR</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.map((element, index) => (
                        <Tr key={index}>
                          <Td text-align={"start"} data-label="Iteration">
                            {data[index].iteration}
                          </Td>
                          <Td text-align={"center"} data-label="XL">
                            {data[index].xl}
                          </Td>
                          <Td text-align={"center"} data-label="XM">
                            {data[index].xm}
                          </Td>
                          <Td text-align={"center"} data-label="XR">
                            {data[index].xr}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
}

export default Graphical;
