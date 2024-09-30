import React from "react";

function GaussElimination() {
  const [size, setSize] = React.useState(0);
  const [matrix, setMatrix] = React.useState<number[][]>([[]]);
  const [constants, setConstants] = React.useState<number[]>([]);
  const [result, setResult] = React.useState<number[]>([]);
  const [row, setRow] = React.useState(0);
  const [col, setCol] = React.useState(0);
  const B = [matrix];

  return <div>GaussElimination</div>;
}

export default GaussElimination;
