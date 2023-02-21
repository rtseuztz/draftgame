import { Summoner } from "@/d";
import summonerRankLimiter from "../../limiters/summonerRank";
import Riot from "../riot/IRiot";
import { buildQuery, err } from "../riot/RiotFunctions";


export class summonerRank extends Riot {
    query = "https://{REGION}.api.riotgames.com/lol/league/v4/entries/by-summoner/{0}"
    readonly promiseRateLimiter = summonerRankLimiter
    /**
     * 
     * @param values - [summonerID]
     * @param region 
     */
    constructor(values: string[], region: string) {
        super(values, region)
        this.query = buildQuery(this.query, this.values, this.region);
    }
    async execute(): Promise<Summoner.RankedSummoner | err> {
        const res: Summoner.RankedSummoner[] | err = await super.execute()
        if (instanceOfSummonerRankArray(res)) {
            const index = res.findIndex((s) => {
                return s.queueType == 'RANKED_SOLO_5x5'
            })
            if (index == -1) return { status: { message: "No ranked queue for this user", status_code: 404 } }
            return res[index]
        } else
            return { status: { message: "summoner not found", status_code: 404 } }
    }
}
function instanceOfSummonerRankArray(object: any): object is Summoner.RankedSummoner[] {
    return object && object.length > 0 ? 'rank' in object[0] : false;
}
export function instanceOfSummonerRank(object: any): object is Summoner.RankedSummoner {
    return 'rank' in object;
}