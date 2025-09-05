/* eslint-disable @typescript-eslint/no-unused-expressions */
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it } from "mocha";
import { expect } from "chai";
import PostForm from "../../app/components/PostForm";
import sinon from "sinon";

/* Test suite for PostForm component */
describe("PostForm ", () => {

  /* Test case 1: to check if form fields and button render correctly */
  it("renders form fields and button", () => {
    render(<PostForm onSubmit={() => {}} />);
    expect(screen.getByLabelText(/Title/i)).to.exist;
    expect(screen.getByLabelText(/Content/i)).to.exist;
    expect(screen.getByRole("button", { name: /Publish Post/i })).to.exist;
  });

  /* Test case 2: to check if submit button is disabled when fields are empty */
  it("disables submit button when fields are empty", () => {
    render(<PostForm onSubmit={() => {}} />);
    const button = screen.getByRole("button");
    expect(button).to.have.property("disabled", true);
  });

  /* Test case 3: to check if submit button is enabled when fields are filled */
  it("calls onSubmit with trimmed values when submitted", () => {
    const mockSubmit = sinon.spy();
    render(<PostForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: "  Hello " } });
    fireEvent.change(screen.getByLabelText(/Content/i), { target: { value: "  World " } });
    fireEvent.click(screen.getByRole("button"));

    expect(mockSubmit.calledOnce).to.be.true;
    expect(mockSubmit.calledWith("Hello", "World")).to.be.true;
  });

  /* Test case 4: to check if fields are cleared after submission */
  it("clears fields after submit", () => {
    const mockSubmit = sinon.spy();
    render(<PostForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Content/i), { target: { value: "Content" } });
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByLabelText(/Title/i)).to.have.property("value", "");
    expect(screen.getByLabelText(/Content/i)).to.have.property("value", "");
  });
});
