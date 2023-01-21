import { render, screen } from "@testing-library/react"
import AsyncList from "./AsyncList"

test("show the food data", async () => {
    render(<AsyncList />)

    const Hamburger = await screen.findByText(/hamburger/i)
    expect(Hamburger).toBeInTheDocument()

    expect(await screen.findByText(/pizza/i)).toBeInTheDocument()
    expect(await screen.findByText(/arepas/i)).toBeInTheDocument()
})