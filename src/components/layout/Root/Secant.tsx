import React from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import {
  Box,
  Text,
  Input,
  Grid,
  GridItem,
  Button,
  Th,
  Tr,
  Td,
  Table,
  Thead,
  Tbody,
  TableContainer,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  ButtonGroup,
} from "@chakra-ui/react";
import { evaluate, derivative } from "mathjs";
import { MathJax } from "better-react-mathjax";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

function Secant() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [functionInput, setFunctionInput] = React.useState("x^2 - 4");
  const [xl, setxl] = React.useState(0.0);
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
        console.log(func);
        console.log(xs);
        setFunctionInput(func);
        setxl(xs);
        // setData([]);
        // setDatachart([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const calsecant = (xl: number) => {
    const fx = (x: number) => {
      try {
        const f = evaluate(functionInput, { x: x });
        return f;
      } catch {
        return NaN;
      }
    };

    const fxdiff = (x: number) => {
      try {
        const f = evaluate(derivative(functionInput, "x").toString(), { x: x });
        return f;
      } catch {
        return NaN;
      }
    };

    let x2,
      x0 = xl;
    let i = 0;
    const obj = [];
    const graphdata = [];
    const e = 0.000001;
    const MAX = 50;

    const Fx0 = fx(x0);
    const Fx0p = fxdiff(x0);
    let x1 = x0 - Fx0 / Fx0p;

    const Fx1 = fx(x1);
    do {
      x2 = x1 - (Fx1 * (x1 - x0)) / (Fx1 - Fx0);
      const Fx2 = fx(x2);
      x0 = x1;
      x1 = x2;
      obj.push({
        iteration: i,
        xl: x0,
        xr: x1,
        xm: x2,
      });
      graphdata.push({ x: x2, y: Fx2 });
      i++;
    } while (i < MAX && Math.abs(Fx0) > e);

    if (x2 !== undefined) {
      setData(obj as never[]);
      setDatachart(graphdata as never[]);
      setX(x2);
    }
  };

  // const error = (xnew: number, xold: number) =>
  //   Math.abs((xnew - xold) / xnew) * 100;

  const Chartdata = {
    data: [
      {
        x: datachart.map((d) => d.x),
        y: datachart.map((d) => d.y),
        mode: "lines+markers",
        marker: { color: "red" },
        line: { color: "blue" },
      },
    ],

    layout: {
      title: "Secant Method",
      xaxis: {
        title: "X",
      },
      yaxis: {
        title: "F(x)",
      },
    },
  };

  const Checkfunc = (x: number) => {
    try {
      evaluate(functionInput, { x: x });
    } catch {
      onOpen();
    }
  };

  const calroot = () => {
    Checkfunc(xl);
    calsecant(xl);
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
                  <MathJax inline dynamic>
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
                <MathJax>{"`X(Initial)`"}</MathJax>
              </Text>
              <Box padding={2}>
                <Input
                  value={xl || 0}
                  onChange={(e) => {
                    setxl(parseFloat(e.target.value));
                  }}
                  variant="filled"
                  size="md"
                  placeholder="0.00"
                  _placeholder={{ opacity: 1, color: "gray.500" }}
                  isInvalid
                  errorBorderColor="gray.500"
                />
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
              <Box mt={5}>
                <Button
                  variant="outline"
                  borderColor={"white"}
                  fontWeight="bold"
                  fontSize={"lg"}
                  onClick={() => {
                    setFunctionInput("");
                    setxl(0);
                    setX(0);
                    setData([
                      {
                        iteration: 0,
                        xl: 0,
                        xr: 0,
                        xm: 0,
                      },
                    ]);
                    setDatachart([{ x: 0, y: 0 }]);
                  }}
                >
                  Reset
                </Button>
              </Box>
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
                        <Th isNumeric width={50}>
                          Iteration
                        </Th>
                        <Th isNumeric width="100">
                          XL
                        </Th>
                        <Th isNumeric>XM</Th>
                        <Th isNumeric>XR</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.map((element, index) => (
                        <Tr key={index}>
                          <Td isNumeric data-label="Iteration">
                            {data[index].iteration}
                          </Td>
                          <Td isNumeric data-label="XL">
                            {data[index].xl}
                          </Td>
                          <Td isNumeric data-label="XM">
                            {data[index].xm}
                          </Td>
                          <Td isNumeric data-label="XR">
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

export default Secant;
