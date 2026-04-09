import { render, screen } from "@testing-library/react";
import { App } from "../src/App";

test("renders dashboard by default", () => {
  render(<App />);
  expect(screen.getByText(/Drafter Drafter/i)).toBeInTheDocument();
});
