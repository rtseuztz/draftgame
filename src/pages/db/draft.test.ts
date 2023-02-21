import { Game } from "@/d"
import draft from "./draft"


describe("integrate the project with the database - test file", () => {
    let mockPostGame: Game.DBGamePostObject
    beforeEach(() => {
        mockPostGame = {
            gameID: 4579239290,
            champString: '120,14,236,267,50,127,145,39,887,99',
            team1Win: true,
            team2Win: false,
            date: 1676595936556,
            gameVersion: '13.3.491.6222',
            gameType: 'MATCHED_GAME',
            mapId: 11,
            tier: 'SILVER'
        }

    })
    test("should post a game to the db", async () => {
        const resp = await draft.post(mockPostGame)
        expect(resp).toBeTruthy()
    })
    test("should get a game id", async () => {
        const resp: number = await draft.getLatestGameID()

        expect(resp).toBeGreaterThan(4579239289)
    })
})