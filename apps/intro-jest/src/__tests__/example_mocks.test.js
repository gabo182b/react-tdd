import { storage } from "../lib/storage"
import { saverUsername, getUsername } from "../user/index"

jest.mock("../lib/storage")

test("first example", () => {
    const myMock = jest.fn()
        .mockReturnValueOnce(true)
        .mockReturnValueOnce("Hello World")
        .mockReturnValueOnce(5)

    const result1 = myMock()
    const result2 = myMock()
    const result3 = myMock()

    // expect(myMock).toHaveBeenCalled()
    // expect(myMock).toHaveBeenCalledTimes(3)
    expect(result1).toBe(true)
    expect(result2).toBe("Hello World")
    expect(result3).toBe(5)
})

test("second example", () => {
    const username = "John Doe"
    saverUsername(username)
    expect(storage.save).toHaveBeenCalledTimes(1)
    expect(storage.save).toHaveBeenCalledWith({ key: "username", value: username })
})

test("third example", () => {
    const username = "John Doe"
    storage.get.mockReturnValueOnce(username)
    const result = getUsername()
    expect(result).toBe(username)
    expect(storage.get).toHaveBeenCalledTimes(1)
    expect(storage.get).toHaveBeenCalledWith({ key: "username" })
})
