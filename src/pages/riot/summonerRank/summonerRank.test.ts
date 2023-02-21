import { Summoner } from "@/d"
import { err, SUMMONER_REGIONS } from "../riot/RiotFunctions";
import { instanceOfSummonerRank, summonerRank } from "./summonerRank";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("SummonerRank API Test", () => {
    let mockResponse: Summoner.RankedSummoner[]
    let summonerFactory: summonerRank
    beforeEach(() => {
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
        summonerFactory = new summonerRank(["guhih-YKJc1OaSy_XT3U_Vl6Q7QqyOowE6yoQ4WD3Yvthhk"], SUMMONER_REGIONS["North America"])
        fetchMock.resetMocks()

    })
    test("should retrieve the correct data from the endpoint", async () => {
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse))

        let res = await summonerFactory.execute()
        expect(res).toBeTruthy()
        expect(instanceOfSummonerRank(res)).toBeTruthy()
        res = res as unknown as Summoner.RankedSummoner
        expect(res.rank).toBe("I")
    })
})