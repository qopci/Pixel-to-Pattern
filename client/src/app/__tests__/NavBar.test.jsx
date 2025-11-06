import { render, screen } from "@testing-library/react";
import NavBar from "../../components/NavBar";

describe("NavBar component", () => {
  test("renders the app title", () => {
    render(<NavBar />);
    expect(screen.getByText(/Pixel2Pattern/i)).toBeInTheDocument();
  });

  test("renders navigation links", () => {
    render(<NavBar />);
    expect(screen.getByRole("button", { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /FAQ/i })).toBeInTheDocument();
  });
});
