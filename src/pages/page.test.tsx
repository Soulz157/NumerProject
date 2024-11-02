import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import Page from "./index";

test("Page", () => {
  render(<Page />);
  expect(
    screen.getByRole("heading", {
      level: 1,
      name: "Welcome to Numerical Method!",
    })
  ).toBeDefined();
  expect(screen.getByRole("button", { name: "Get Start" })).toBeDefined();

  screen.debug();
  screen.getByRole("button", { name: "Get Start" }).click();
});
