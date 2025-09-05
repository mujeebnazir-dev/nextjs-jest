import { render, screen, fireEvent } from "@testing-library/react";
import PostForm from "../app/components/PostForm";
import { expect, jest, test, describe } from "@jest/globals";

describe("PostForm - Test suit using Jest", () => {

  /* Snapshot testing */
  test("matches snapshot", () => {
  const { asFragment } = render(<PostForm onSubmit={() => {}} />);
  expect(asFragment()).toMatchSnapshot();
});

  /* Test case 1: check if form fields and button render correctly */
  test("renders form fields and button", () => {
    render(<PostForm onSubmit={() => {}} />);
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Content/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Publish Post/i })
    ).toBeInTheDocument();
  });

  /* Test case 2: submit button disabled when fields are empty */
  test("disables submit button when fields are empty", () => {
    render(<PostForm onSubmit={() => {}} />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  /* Test case 3: calls onSubmit with trimmed values when submitted */
  test("calls onSubmit with trimmed values when submitted", () => {
    const mockSubmit = jest.fn();
    render(<PostForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "  Hello " },
    });
    fireEvent.change(screen.getByLabelText(/Content/i), {
      target: { value: "  World " },
    });
    fireEvent.click(screen.getByRole("button"));

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith("Hello", "World");
  });

  /* Test case 4: fields are cleared after submission */
  test("clears fields after submit", () => {
    const mockSubmit = jest.fn();
    render(<PostForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByLabelText(/Content/i), {
      target: { value: "Content" },
    });
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByLabelText(/Title/i)).toHaveValue("");
    expect(screen.getByLabelText(/Content/i)).toHaveValue("");
  });

  
  /* Test case 5: logs error if onSubmit throws */
  test("logs error if onSubmit throws", () => {
    const error = new Error("submit failed");
    const mockSubmit = jest.fn(() => { throw error; });
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<PostForm onSubmit={mockSubmit} />);
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Content/i), { target: { value: "Content" } });
    fireEvent.click(screen.getByRole("button"));

    expect(consoleErrorSpy).toHaveBeenCalledWith("Error submitting post:", error);

    consoleErrorSpy.mockRestore();
  });
});


