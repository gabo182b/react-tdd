describe("Matchers", () => {
    test("toBe", () => {
        expect(true).toBe(true)
    })

    test("toEqual", () => {
        const data = { one: 1 }
        data['two'] = 2;
        expect(data).toEqual({ one: 1, two: 2 })

        const arr = ["one", "two"]
        expect(arr).toEqual(["one", "two"])
    })

    test("not", () => { //More than matcher is a matchers modifier
        expect(true).not.toBe(false)
    })

    test('string', () => {
        expect('team').not.toMatch(/I/)
    })

    function compileAndroidCode() {
        throw new Error('you are using the wrong JDK!')
    }

    test('throw', () => {
        expect(() => compileAndroidCode()).toThrow()
        expect(() => compileAndroidCode()).toThrow(Error)

        // // You can also use a string that must be contained in the error message or a regexp
        // expect(() => compileAndroidCode()).toThrow('you are using the wrong JDK');
        // expect(() => compileAndroidCode()).toThrow(/JDK/);

        // // Or you can match an exact error mesage using a regexp like below
        // expect(() => compileAndroidCode()).toThrow(/^you are using the wrong JDK$/); // Test fails
        // expect(() => compileAndroidCode()).toThrow(/^you are using the wrong JDK!$/); // Test pass

    })
})