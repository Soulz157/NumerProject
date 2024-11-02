import React from "react";
import { Box, Select, Text, AbsoluteCenter } from "@chakra-ui/react";
import Trapezoidal from "./layout/Intergration/Trapezoidal";
import CompositeTrap from "./layout/Intergration/CompositeTrap";
import Simpson from "./layout/Intergration/Simpson";
import Compositesim from "./layout/Intergration/Compositesim";

function Intergration() {
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
            <option value="Trap">Single Trapezoidal Rule</option>
            <option value="Compo">Composite Trapezoidal Rule</option>
            <option value="Sim">Simpson&apos;s Rule</option>
            <option value="Comsim">Composite Simpson&apos;s Rule</option>
          </Select>
        </AbsoluteCenter>
      </Box>

      <Box mt={5}>{solution === "Trap" && <Trapezoidal />}</Box>
      <Box mt={5}>{solution === "Compo" && <CompositeTrap />}</Box>
      <Box mt={5}>{solution === "Sim" && <Simpson />}</Box>
      <Box mt={5}>{solution === "Comsim" && <Compositesim />}</Box>
    </>
  );
}

export default Intergration;
