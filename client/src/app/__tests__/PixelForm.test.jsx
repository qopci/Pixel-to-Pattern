// Inline mock for Next.js router (prevents "expected app router to be mounted" errors)
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

import { render, screen, fireEvent } from "@testing-library/react";
import PixelForm from "../../components/PixelForm";

describe("PixelForm component", () => {
  test("renders width and height inputs", () => {
    render(<PixelForm />);
    expect(screen.getByLabelText(/Width/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Height/i)).toBeInTheDocument();
  });

  test("updates name and author fields", () => {
    render(<PixelForm />);
    const nameInput = screen.getByLabelText(/Name Your Pattern/i);
    const authorInput = screen.getByLabelText(/Author/i);

    fireEvent.change(nameInput, { target: { value: "My Pixel Art" } });
    fireEvent.change(authorInput, { target: { value: "Alice" } });

    expect(nameInput.value).toBe("My Pixel Art");
    expect(authorInput.value).toBe("Alice");
  });

  test("opens and closes clear drawing dialog", () => {
    render(<PixelForm />);

    // Find the Clear icon and click its parent button
    const clearIcon = screen.getByTestId("ClearIcon");
    const clearButton = clearIcon.closest("button");
    fireEvent.click(clearButton);

    expect(screen.getByText(/Clear entire drawing/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Disagree/i));
    expect(screen.queryByText(/Clear entire drawing/i)).not.toBeInTheDocument();
  });

  test("renders Generate Pattern button", () => {
    render(<PixelForm />);
    expect(
      screen.getByRole("button", { name: /Generate Pattern/i })
    ).toBeInTheDocument();
  });
});
