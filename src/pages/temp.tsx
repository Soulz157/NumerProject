import React from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import {
  Button,
  ChakraProvider,
  Input,
  Container,
  NumberInputField,
  NumberInput,
  Text,
  ButtonGroup,
} from "@chakra-ui/react";
import { evaluate } from "mathjs";
import { MathJax } from "better-react-mathjax";

const Plotly = dynamic(() => import("react-plotly.js"), { ssr: false });

function Temp() {
  const [solution, setSolution] = React.useState("");
  const [n, setN] = React.useState(0);
  const [result, setResult] = React.useState(0);
  const [Xstart, setXstart] = React.useState(0);
  const [Xend, setXend] = React.useState(0);
  const [chartdata, setchartdata] = React.useState<
    { x: number; y: number; result: number }[]
  >([]);

  const readdata = async () => {
    const respone = await axios.get("http://localhost:8000/api");
    console.log(respone.data);
    if (respone.data.result) {
      const data = respone.data.data;
      const random = Math.floor(Math.random() * data.length);
      const so = data[random].solution;
      const area = data[random].n;
      const xs = data[random].xstart;
      const xe = data[random].xend;

      setN(area + 1);
      setSolution(so);
      setXstart(xs);
      setXend(xe);
    }
  };

  const calroot = () => {
    const fx = (x: number) => {
      try {
        const f = evaluate(solution, { x: x });
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
      y: fx(Xstart),
      result: result,
    });

    for (let i = 1; i < n * 2; i++) {
      if (i % 2 === 0) {
        result += 2 * fx(Xstart + i * area);
        chart.push({
          x: Xstart + i * area,
          y: fx(Xstart + i * area),
          result: result,
        });
      } else {
        result += 4 * fx(Xstart + i * area);
        chart.push({
          x: Xstart + i * area,
          y: fx(Xstart + i * area),
          result: result,
        });
      }
    }

    result *= area / 3;
    // chart.push({
    //   x: Xend,
    //   y: fx(Xend),
    //   result: result,
    // });

    setchartdata(chart);
    setResult(parseFloat(result.toFixed(6)));
  };

  const layout: {
    data: Partial<Plotly.PlotData>[];
    layout: Partial<Plotly.Layout>;
  } = {
    data: [
      // {
      //   x: chartdata.map((point) => point.x),
      //   y: chartdata.map((point) => point.y),
      //   type: "scatter" as const,
      //   mode: "lines" as const,
      //   line: { color: "blue", shape: "spline" } as const,
      // },
      {
        x: chartdata.map((point) => point.x),
        y: chartdata.map((point) => point.result),
        fill: "tozeroy",
        type: "scatter" as const,
        mode: "lines" as const,
        fillcolor: "rgba(0, 100, 255, 0.3)",
        line: { color: "rgba(0, 100, 255, 0)" },
      },
      {
        x: chartdata.map((point) => point.x),
        y: chartdata.map((point) => point.result),
        type: "scatter" as const,
        mode: "lines" as const,
        line: { color: "Green", shape: "spline" } as const,
      },
    ],
    layout: {
      width: 900,
      height: 500,
      title: "Simpson's Rule",
      xaxis: {
        title: "X",
      },
      yaxis: {
        title: "Y",
      },
    },
  };

  return (
    <>
      <ChakraProvider>
        <Container w={"50%"}>
          <MathJax>{"`$`".replaceAll("$", solution ? solution : " ")}</MathJax>
          <Text>function</Text>
          <Input
            value={solution}
            onChange={(e) => {
              setSolution(e.target.value);
            }}
          ></Input>
          <Text>N</Text>
          <Input
            mt={2}
            value={n || 0}
            onChange={(e) => {
              setN(parseInt(e.target.value));
            }}
          ></Input>
          <Text>Xstart</Text>
          <NumberInput
            value={Xstart || 0}
            onChange={(valueAsString, valueAsNumber) => {
              setXstart(valueAsNumber);
            }}
          >
            <NumberInputField />
          </NumberInput>
          <Text>Xend</Text>
          <NumberInput
            value={Xend || 0}
            onChange={(valueAsString, valueAsNumber) => {
              setXend(valueAsNumber);
            }}
          >
            <NumberInputField />
          </NumberInput>
          <ButtonGroup mt={3} gap={5}>
            <Button onClick={calroot}>Cal</Button>
            <Button onClick={readdata}>API</Button>
          </ButtonGroup>
          <Text>Result</Text>
          <Input readOnly value={result}></Input>
        </Container>
        <Container mt={20}>
          <Plotly data={layout.data} layout={layout.layout} />
        </Container>
      </ChakraProvider>
    </>
  );
}

export default Temp;
