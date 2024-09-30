import * as React from "react";
import { Box, Text, AbsoluteCenter, Select } from "@chakra-ui/react";
import Graphical from "../components/layout/Root/Graphical";
import Biesection from "../components/layout/Root/Biesection";
import FalsePosition from "../components/layout/Root/FalsePosition";
import Onepoint from "@/components/layout/Root/Onepoint";
import Newton from "../components/layout/Root/Newton";
import Secant from "@/components/layout/Root/Secant";

function RootPage() {
  const [solution, setSolution] = React.useState(" ");

  return (
    <>
      <Box textAlign="center" fontSize="xl" padding={5} position="relative">
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
            <option value="GraphicalMethod">Graphical Method</option>
            <option value="BisectionMethod">Bisection Method</option>
            <option value="FalsePosition">False-Position Method</option>
            <option value="Onepoint-iteration">Onepoint-iteration</option>
            <option value="NewtonRapshon">Newton-Rapshon</option>
            <option value="Secant">Secant Method</option>
          </Select>
        </AbsoluteCenter>
      </Box>
      <Box mt={5}>
        {solution === "GraphicalMethod" && <Graphical />}
        {solution === "BisectionMethod" && <Biesection />}
        {solution === "FalsePosition" && <FalsePosition />}
        {solution === "Onepoint-iteration" && <Onepoint />}
        {solution === "NewtonRapshon" && <Newton />}
        {solution === "Secant" && <Secant />}
      </Box>
    </>
  );
}

export default RootPage;
