import { render, fireEvent, screen } from "@testing-library/react";
import Home from "../Home";

// Test block to check if the counter increments on button click
test("increment", () => {
 // Render the component to a virtual DOM
 render(<Home />);

 // Select elements by their test IDs
 const incrementBtn = screen.getByTestId("increment");

 // Interact with the increment button by clicking it
 fireEvent.click(incrementBtn);

 // Assert that the counter text content has updated to reflect the increment
 expect(incrementBtn).toHaveTextContent("Counter: 1");
});
