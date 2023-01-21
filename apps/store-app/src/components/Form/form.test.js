import React from "react";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import Form from "./Form"
import { CREATED_STATUS, ERROR_SERVER_STATUS, INVALID_REQUEST_STATUS } from "../../consts/httpStatus";

const server = setupServer(
  rest.post('/products', (req, res, ctx) => {
    const { name, size, type } = req.body

    if (name && size && type) {
      return res(ctx.status(CREATED_STATUS))
    }

    return res(ctx.status(ERROR_SERVER_STATUS))
  })
)

beforeAll(() => server.listen())

afterAll(() => server.close())

beforeEach(() => render(<Form />))

afterEach(() => server.resetHandlers())

describe("when the form is mounted", () => {
  it("There must be a create product form page", () => {
    expect(screen.getByRole("heading", { name: /create product/i })).toBeInTheDocument()
  })

  it("Should exists the fields: name, size, type (electronic, furniture, clothing)", () => {
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/size/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument()

    expect(screen.queryByText(/electronic/i)).toBeInTheDocument()
    expect(screen.queryByText(/furniture/i)).toBeInTheDocument()
    expect(screen.queryByText(/clothing/i)).toBeInTheDocument()
  })

  it("Should exists submit button", () => {
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument()
  })
})

describe("when the user submits the form without values", () => {
  it("should display validation messages", async () => {
    expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/the type is required/i)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /submit/i }))

    expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()
    expect(screen.queryByText(/the size is required/i)).toBeInTheDocument()
    expect(screen.queryByText(/the type is required/i)).toBeInTheDocument()

    await waitFor(() => expect(screen.getByRole("button", { name: /submit/i })).not.toBeDisabled()
    )
  })
})

describe("when the user blurs an empty field", () => {
  it("should display a validation error message for the name input", () => {
    expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument()

    fireEvent.blur(screen.getByLabelText(/name/i), { target: { name: "name", value: "" } })
    expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()
  })

  it("should display a validation error message for the size input", () => {
    expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument()

    fireEvent.blur(screen.getByLabelText(/size/i), { target: { name: "size", value: "" } })
    expect(screen.queryByText(/the size is required/i)).toBeInTheDocument()
  })
})

describe("when the user submits the form properly and the servers returns a created status", () => {
  it("it should the submit button be disabled until the request is done", async () => {
    const submitButton = screen.getByRole("button", { name: /submit/i })
    expect(submitButton).not.toBeDisabled()

    fireEvent.click(submitButton)
    expect(submitButton).toBeDisabled()

    await waitFor(() =>
      expect(submitButton).not.toBeDisabled()
    )
  })

  it("the form page must display the success message “Product stored” and clean the fields values", async () => {
    const nameInput = screen.getByLabelText(/name/i)
    const sizeInput = screen.getByLabelText(/size/i)
    const typeSelect = screen.getByLabelText(/type/i)

    fireEvent.change(nameInput, { target: { name: "name", value: "my product" } })
    fireEvent.change(sizeInput, { target: { name: "name", value: "10" } })
    fireEvent.change(typeSelect, { target: { name: "name", value: "electronic" } })

    fireEvent.click(screen.getByRole("button", { name: /submit/i }))

    await waitFor(() =>
      expect(screen.getByText(/product stored/i)).toBeInTheDocument()
    )

    expect(nameInput).toHaveValue("")
    expect(sizeInput).toHaveValue("")
    expect(typeSelect).toHaveValue("")
  })
})

describe("when the user submits the form and the server return an unexpected error", () => {
  it("The form page must display the error message “Unexpected error, please try again”", async () => {
    fireEvent.click(screen.getByRole("button", { name: /submit/i }))

    await waitFor(() =>
      expect(screen.getByText(/unexpected error, please try again/i)).toBeInTheDocument()
    )
  })
})

describe("when the user submits the form and the server return an invaled request error", () => {
  it("The form page must display the error message “The form is invalid, the fields [field1...fieldN] are required”", async () => {
    server.use(
      rest.post('/products', (req, res, ctx) => res(
        ctx.status(INVALID_REQUEST_STATUS),
        ctx.json({
          message:
            "the form is invalid, the fields name, size, type are required",
        })
      )
      )
    )

    fireEvent.click(screen.getByRole("button", { name: /submit/i }))

    await waitFor(() =>
      expect(screen.getByText(/the form is invalid, the fields name, size, type are required/i)).toBeInTheDocument()
    )
  })
})

describe("when the user submits the form and there us a connection issue", () => {
  it("The form page must display the error message “The form is invalid, the fields [field1...fieldN] are required”", async () => {
    server.use(
      rest.post('/products', (req, res) => res.networkError("Failed to conect"))
    )

    fireEvent.click(screen.getByRole("button", { name: /submit/i }))

    await waitFor(() =>
      expect(screen.getByText(/connection error, please try later/i)).toBeInTheDocument()
    )
  })
})
