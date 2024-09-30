import React from "react";
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
} from "@chakra-ui/react";
import { evaluate } from "mathjs";
import { MathJax } from "better-react-mathjax";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
function Graphical() {
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

  const calGraphical = (xl: number, xr: number) => {
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
      Fxl = evaluate(functionInput, { x: i });
      Fxr = evaluate(functionInput, { x: i + 0.01 });
      if (Fxl * Fxr < 0) {
        l = i;
        r = i + 0.01;
        break;
      }
    }

    while (l <= r && iter < 50) {
      const fx = evaluate(functionInput, { x: l });
      const fxplus = evaluate(functionInput, { x: l + e });

      if (fx * fxplus < 0) {
        break;
      }

      obj.push({
        iteration: iter,
        xl: xl,
        xr: xr,
        xm: l,
      });

      graphdata.push({ x: l, y: fx });

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
        name: "X",
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
      return 0;
    }
  };

  const calroot = () => {
    Checkfunction(xstart);

    calGraphical(xstart, xend);
  };

  return (
    <>
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
                <Input
                  // value={xl}
                  onChange={(e) => {
                    setxstart(parseFloat(e.target.value));
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
                  <MathJax>{"`X End`"}</MathJax>
                </Text>
                <Box padding={2}>
                  <Input
                    // value={xr}
                    onChange={(e) => {
                      setxend(parseFloat(e.target.value));
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
