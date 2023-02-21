
import { riotFetch, buildQuery, convertSummonerRegion, SUMMONER_REGIONS } from "./RiotFunctions";

describe('Generic riot functions', () => {
    test('build query', () => {
        const str = buildQuery("{1}{REGION}{0}", ["val1", "val2"], "na1")
        expect(str).toBe("val2na1val1")
    })
    test('convert summoner to match region', () => {
        const NAConversion = convertSummonerRegion(SUMMONER_REGIONS["North America"])
        expect(NAConversion).toBe("americas")
    })
})