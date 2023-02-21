import { Game, Summoner } from "@/d"
import { err, MATCH_REGIONS } from "../riot/RiotFunctions"
import RiotGame, { instanceOfGame } from "./matches"
import fs from 'fs'
import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();
describe('Riot Matches with API', () => {
    let gameFactory: RiotGame
    let obj: Game.GameObject
    let mockResponse: Summoner.RankedSummoner[]
    beforeEach(async () => {
        mockResponse = [
            {
                "leagueId": "177edf16-65f0-409f-9d77-36c6a7165132",
                "queueType": "RANKED_SOLO_5x5",
                "tier": "SILVER",
                "rank": "I",
                "summonerId": "guhih-YKJc1OaSy_XT3U_Vl6Q7QqyOowE6yoQ4WD3Yvthhk",
                "summonerName": "rtseuztz",
                "leaguePoints": 16,
                "wins": 18,
                "losses": 11,
                "veteran": false,
                "inactive": false,
                "freshBlood": false,
                "hotStreak": false
            }
        ]
        obj = require('./testgame.json')
        gameFactory = new RiotGame(["NA1_4579239290"], MATCH_REGIONS.AMERICA)
        fetchMock.resetMocks()
    })
    test("should get the game from the match id", async () => {
        fetchMock.mockResponseOnce(JSON.stringify(obj))
        const res = await gameFactory.execute()
        expect(instanceOfGame(res)).toBeTruthy()
    })
    test("should handle error properly when an error is returned", async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ status: { message: "data not found", status_code: 400 } } as err))
        const res: any = await gameFactory.execute()
        expect(res).toBeTruthy()
        expect(res.status.status_code).toBe(400)
    })

    it("should convert the game object", async () => {
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse))
        const newGame = await gameFactory.convertGame(obj)
        expect(newGame.date).toBe(obj.info.gameCreation)
        expect(newGame.gameVersion).toBe(obj.info.gameVersion)
        expect(newGame.tier).toBe("SILVER")
    })


})

describe("Integration with riot api", () => {
    let obj: Game.GameObject
    let mockResponse: Summoner.RankedSummoner[]
    let gameFactory: RiotGame
    beforeEach(async () => {
        obj = require('./testgame.json')
        gameFactory = new RiotGame(["NA1_4579239290"], MATCH_REGIONS.AMERICA)
        fetchMock.resetMocks()
    })
    it('should get the rank', async () => {
        //obj = require('./badgame.json')
        const rank = await gameFactory.getRank(obj.info.participants, obj.info.gameId)
        console.log(rank)
        expect(rank).not.toBe("NORANK")
    })
})