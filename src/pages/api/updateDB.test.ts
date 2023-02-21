import update from "./updateDB"

describe("Update DB", () => {
    let obj: update
    beforeEach(() => {
        obj = new update()
        jest.setTimeout(20000)
    })
    beforeAll(() => jest.setTimeout(200000))
    // test("should add more rows to the db", async () => {
    //     const res = await obj.add100Games()
    //     expect(res).toBeGreaterThan(7)
    // })
    test("test", () => {
        expect(1).toBeTruthy()
    })
    test("should add more rows to the db", async () => {
        const gameID = await obj.addAGame()
        const newID = await obj.addAGame(gameID + 1)
        expect(newID).toBeGreaterThan(gameID)
    })
})