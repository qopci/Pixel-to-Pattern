import { render, screen } from "@testing-library/react";
import PatternGenerator from "../../components/PatternGenerator";

describe("PatternGenerator component", () => {
  const mockPattern = {
    width: 2,
    height: 2,
    colorConfig: ["#000", "#000", "#fff", "#fff"]
  };

  test("renders pattern generator title", () => {
    render(<PatternGenerator patternInfo={mockPattern} />);
    expect(screen.getByText(/Pattern Generator/i)).toBeInTheDocument();
  });

  test("displays pattern text after generation", async () => {
    render(<PatternGenerator patternInfo={mockPattern} />);
    expect(await screen.findByText(/Row 1:/i)).toBeInTheDocument();
  });
});
