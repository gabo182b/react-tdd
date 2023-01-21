import HelloWorld from "./HelloWorld"
import { render, screen } from "@testing-library/react"

test("renders hello world", () => {
    render(<HelloWorld />)

    const title = screen.getByText(/hello world/i)
    expect(title).toBeInTheDocument()

})