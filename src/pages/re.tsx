import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  Container,
  Input,
  NumberInput,
  NumberInputField,
  Button,
  ButtonGroup,
  Text,
} from "@chakra-ui/react";
import { evaluate } from "mathjs";
import axios from "axios";

const Plotly = dynamic(() => import("react-plotly.js"), { ssr: false });

function Re() {
  const [solution, setSolution] = useState("");
  const [n, setN] = React.useState(0);
  const [Xstart, setXstart] = React.useState(0);
  const [Xend, setXend] = React.useState(0);
  const [result, setResult] = React.useState(0);
  const [chartdata, setchartdata] = React.useState<{ x: number; y: number }[]>(
    []
  );

  const readdata = async () => {
    const respone = await axios.get("http://localhost:8000/api");
    console.log(respone.data);
    if (respone.data.result) {
      const data = respone.data.data;
      const random = Math.floor(Math.random() * data.length);
      const so = data[random].solution;
      const n = data[random].n;
      const xs = data[random]
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
      y: result,
    });
    for (let i = 1; i < n * 2; i++) {
      if (i % 2 == 0) {
        result += 2 * fx(Xstart + i * area);
        chart.push({
          x: Xstart + i * area,
          y: result,
        });
      } else {
        result += 4 * fx(Xstart + i * area);
        chart.push({
          x: Xstart + i * area,
          y: result,
        });
      }
    }
    result *= area / 3;

    setResult(result);
    setchartdata(chart);
  };

  const getGraph: {
    data: Partial<Plotly.PlotData>[];
    layout: Partial<Plotly.Layout>;
  } = {
    data: [
      {
        x: chartdata.map((d) => d.x),
        y: chartdata.map((d) => d.y),
        fill: "tozeroy",
        type: "scatter" as const,
        mode: "lines" as const,
        fillcolor: "rgba(0, 100, 255, 0.3)",
        line: { color: "rgba(0, 100, 255, 0)" },
      },
      {
        x: chartdata.map((d) => d.x),
        y: chartdata.map((d) => d.y),
        type: "scatter" as const,
        mode: "lines" as const,

        line: { color: "blue", shape: "spline" },
      },
    ],

    layout: {
      width: 900,
      height: 500,
      title: "Simpson Rule",
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
      <Container>
        <Input
          onChange={(e) => {
            setSolution(e.target.value);
          }}
        ></Input>
        <Text>N</Text>
        <NumberInput
          onChange={(valueasString, valueasNumber) => {
            setN(valueasNumber);
          }}
        >
          <NumberInputField />
        </NumberInput>
        <Text>Xs</Text>
        <NumberInput
          onChange={(valueasString, valueasNumber) => {
            setXstart(valueasNumber);
          }}
        >
          <NumberInputField />
        </NumberInput>
        <Text>Xe</Text>
        <NumberInput
          onChange={(valueasString, valueasNumber) => {
            setXend(valueasNumber);
          }}
        >
          <NumberInputField />
        </NumberInput>
        <ButtonGroup gap={3} p={5}>
          <Button onClick={calroot}>Cal</Button>
          <Button onClick={readdata}>Api</Button>
        </ButtonGroup>
        <Input p={5} readOnly value={result}></Input>
      </Container>
      <Container p={5}>
        <Plotly data={getGraph.data} layout={getGraph.layout} />
      </Container>
    </>
  );
}

export default Re;
