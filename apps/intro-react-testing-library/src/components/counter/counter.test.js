import Counter from "./Counter";
import { render, screen, fireEvent } from "@testing-library/react"

test("display zero initial counts", () => {
    render(<Counter />)

    const result = screen.getByText(/clicked times: 0/i)
    expect(result).toBeInTheDocument()
})

test("display new count after one click", () => {
    render(<Counter />)

    const button = screen.getByText(/click/i, { selector: "button" })
    fireEvent.click(button)

    const result = screen.getByText(/clicked times: 1/i)
    expect(result).toBeInTheDocument()

})