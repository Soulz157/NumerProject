import React from "react";
import { Box, AbsoluteCenter, Text, Select } from "@chakra-ui/react";
import Cramer from "@/components/layout/Linear/Cramer"; // Ensure Cramer is a valid React component
import GaussElimination from "./layout/Linear/GaussElimination";
import GaussJordan from "./layout/Linear/GaussJordan";
import LUdecom from "./layout/Linear/LUdecom";
import Conjugate from "./layout/Linear/Conjugate";
import Jacobi from "./layout/Linear/Jacobi";
import GaussSeidel from "./layout/Linear/GaussSeidel";
import MatrixInverse from "./layout/Linear/MatrixInverse";

function LinearPage() {
  const [solution, setSolution] = React.useState(" ");

  return (
    <>
      <Box textAlign="center" fontSize="xl" padding={5} position={"relative"}>
        <AbsoluteCenter p="4" color="white" axis="both">
          <Text fontSize="xl" fontWeight="bold" color="white">
            Solution
          </Text>
          <Select
            onChange={(e) => setSolution(e.target.value)}
            placeholder="Select Solution"
            color={"white"}
            padding={2}
            borderColor="gray.500"
            variant={"filled"}
          >
            <option value="Cramerrule">Cramer Rule</option>
            <option value="GaussElimination">Gauss Elimination</option>
            <option value="GaussJordan">Gauss Jordan</option>
            <option value="Gaussseidel">Gauss Seidel</option>
            <option value="MatrixInverse">Matrix Inversion</option>
            <option value="Lu">LU Decomposition</option>
            <option value="Con">Conjugate Gradient</option>
            <option value="Jacobi">Jacobi Method</option>
          </Select>
        </AbsoluteCenter>
      </Box>
      <Box mt={5}>
        {solution === "Cramerrule" && <Cramer />}
        {solution === "GaussElimination" && <GaussElimination />}
        {solution === "GaussJordan" && <GaussJordan />}
        {solution === "MatrixInverse" && <MatrixInverse />}
        {solution === "Lu" && <LUdecom />}
        {solution === "Con" && <Conjugate />}
        {solution === "Jacobi" && <Jacobi />}
        {solution === "Gaussseidel" && <GaussSeidel />}
      </Box>
    </>
  );
}

export default LinearPage;
