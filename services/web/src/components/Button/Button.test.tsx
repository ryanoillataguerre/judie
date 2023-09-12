import Button from "./Button";
import { render, screen } from "@testing-library/react";

describe("Button Component: ", () => {
  it("should have text", () => {
    render(<Button label={"Unique label"} />);
    expect(screen.getByText("Unique label")).toBeInTheDocument();
  });
});
