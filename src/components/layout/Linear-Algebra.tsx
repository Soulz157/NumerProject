import React from "react";
import { Box, AbsoluteCenter, Text, Select } from "@chakra-ui/react";
import Biesection from "@/components/layout/Root/Biesection";
import Newton from "@/components/layout/Root/Newton";
import Cramer from "@/components/layout/Linear/Cramer";
import GaussElimination from "./Linear/GaussElimination";

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
            <option value="Onepoint-iteration">Onepoint-iteration</option>
            <option value="NewtonRapshon">Newton-Rapshon</option>
          </Select>
        </AbsoluteCenter>
      </Box>
      <Box mt={5}>
        {solution === "Cramerrule" && <Cramer />}
        {solution === "GaussElimination" && <GaussElimination />}
        {solution === "NewtonRapshon" && <Newton />}
      </Box>
    </>
  );
}

export default LinearPage;
