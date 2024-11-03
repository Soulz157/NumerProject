import { assertType, expect, expectTypeOf, test } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import Page from "../src/pages/index";
import Biesection from "../src/components/layout/Root/Biesection";
import { it } from "node:test";

test("Page", () => {
  render(<Page />);
  expect(
    screen.getByRole("heading", {
      level: 1,
      name: "Welcome to Numerical Method!",
    })
  ).toBeDefined();
});

test("Button", () => {
  const button = screen.getByRole("button", { name: "Get Start" });
  screen.debug();

  button.click();

  expect(button).toBeDefined();
});

test("func", () => {
  it("should render", () => {
    render(<Biesection />);
    expect(screen.getByRole("main")).toBeDefined();
    const func = screen.getByRole("textbox", {
      name: "function",
    }) as HTMLInputElement;
    func.value = "x^2";
    expectTypeOf(Biesection).toBeFunction();
    expectTypeOf(Biesection).toMatchTypeOf<
      (props: { name: string }) => JSX.Element
    >();
    assertType(Biesection());
    expect(func.value).toBe("x^2");
  });
});

// describe("sort", () => {
//   bench("normal", () => {
//     const x = [1, 5, 4, 2, 3];
//     x.sort((a, b) => {
//       return a - b;
//     });
//   });

//   bench("reverse", () => {
//     const x = [1, 5, 4, 2, 3];
//     x.reverse().sort((a, b) => {
//       return a - b;
//     });
//   });
// });
