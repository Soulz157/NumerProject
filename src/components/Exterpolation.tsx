import React from "react";
import { Box, Select, Text, AbsoluteCenter } from "@chakra-ui/react";
import Regression from "./layout/Exterpolation/Regression";
import MultipleRe from "./layout/Exterpolation/MultipleRe";

function Exterpolation() {
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
            <option value="Linear">Linear Regression</option>
            <option value="Multiple">Multiple Linear Regression</option>
          </Select>
        </AbsoluteCenter>
      </Box>

      <Box mt={5}>{solution === "Linear" && <Regression />}</Box>
      <Box mt={5}>{solution === "Multiple" && <MultipleRe />}</Box>
    </>
  );
}

export default Exterpolation;
