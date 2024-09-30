import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { evaluate } from "mathjs";
import { MathJax } from "better-react-mathjax";
import AlertDialogExample from "../../alertDialog";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

function Biesection() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [functionInput, setFunctionInput] = useState("x^2 - 4");
  const [xl, setxl] = React.useState(0);
  const [xr, setxr] = React.useState(0.0);
  const [X, setX] = React.useState(0);
  const [tolence, setTolence] = React.useState(false);
  const [data, setData] = React.useState([
    {
      iteration: 0,
      xl: 0,
      xr: 0,
      xm: 0,
    },
  ]);
  const [datachart, setDatachart] = useState([{ x: 0, y: 0 }]);

  const error = (xold: number, xnew: number) =>
    Math.abs((xnew - xold) / xnew) * 100;

  const bisection = (xl: number, xr: number) => {
    const fx = (x: number) => {
      try {
        const f = evaluate(functionInput, { x: x });
        return f;
      } catch {
        return NaN;
      }
    };

    let xm,
      Fxr,
      Fxm,
      ea = 0;
    const e = 0.000001;
    const MAX = 50;
    let i = 0;
    const obj = [];
    const graphdata = [];

    do {
      // console.log(xl, xr);
      xm = (xl + xr) / 2.0;
      // console.log(xm);
      Fxr = fx(xr);
      // console.log(Fxr);
      Fxm = fx(xm);
      // console.log(Fxm);
      if (Fxm * Fxr < 0) {
        ea = error(xl, xm);
        obj.push({
          iteration: i,
          xl: xl,
          xr: xr,
          xm: xm,
        });
        graphdata.push({ x: xm, y: Fxm });

        xl = xm;
      } else if (Fxm * Fxr > 0) {
        ea = error(xr, xm);
        obj.push({
          iteration: i,
          xl: xl,
          xr: xr,
          xm: xm,
        });
        graphdata.push({ x: xm, y: Fxm });

        xr = xm;
      }
      i++;
    } while (ea > e && i < MAX);

    if (xm !== undefined) {
      setData(obj as never[]);
      setDatachart(graphdata as never[]);
      setX(xm);
    }
  };

  const Chartdata = {
    data: [
      {
        name: "Xm",
        x: datachart.map((d) => d.x),
        y: datachart.map((d) => d.y),
        type: "scatter",
        mode: "markers",
        marker: { color: "red" },
      },
      {
        name: "F(x)",
        x: datachart.map((d) => d.x),
        y: datachart.map((d) => d.y),
        type: "scatter",
        mode: "lines",
        line: { color: "blue" },
      },
    ],

    layout: {
      title: "Bisection",
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
      setTolence(false);
    } catch {
      // alert("Please enter the correct function");
      setTolence(true);
    }
  };

  const calroot = () => {
    Checkfunc(xl);
    bisection(xl, xr);

    console.log(Chartdata.data);
  };

  return (
    <>
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
                <MathJax>{"`XL`"}</MathJax>
              </Text>
              <Box padding={2}>
                <Input
                  // value={xl}
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
              <Box>
                <Text fontSize="xl" fontWeight="bold" color="white">
                  <MathJax>{"`XR`"}</MathJax>
                </Text>
                <Box padding={2}>
                  <Input
                    // value={xr}
                    onChange={(e) => {
                      setxr(parseFloat(e.target.value));
                    }}
                    variant="filled"
                    size="md"
                    placeholder="0.00"
                    _placeholder={{ opacity: 1, color: "gray.500" }}
                    isInvalid
                    errorBorderColor="gray.500"
                  />
                </Box>
              </Box>
              <Box mt={10}>
                <Button
                  variant="outline"
                  borderColor={"white"}
                  fontWeight="bold"
                  fontSize={"lg"}
                  onClick={calroot}
                >
                  Calculate
                </Button>
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
              // backgroundColor={"blackAlpha.800"}
              padding={2}
              h={"max-content"}
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
                        <Th text-align={"start"} w={150}>
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

export default Biesection;
