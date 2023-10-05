import Button from "./Button";
import { render, screen } from "@testing-library/react";

describe("Button Component: ", () => {
  it("should have text", () => {
    render(<Button label={"Unique label"} />);
    expect(screen.getByText("Unique label")).toBeInTheDocument();
  });

  it("should have spinner", () => {
    render(<Button label={"Unique label"} loading={true} />);
    expect(screen.queryByText("Unique label")).not.toBeInTheDocument();
  });
});

describe("Button Behavior: ", () => {
  it("should call onClick", () => {
    const onClick = jest.fn();
    render(<Button label={"Unique label"} onClick={onClick} />);
    screen.getByText("Unique label").click();
    expect(onClick).toHaveBeenCalled();
  });
});
