import matchListLimiter from "../../limiters/match-list";
import Riot from "../riot/IRiot";
import { buildQuery, err } from "../riot/RiotFunctions";


/** Values: [puuid, # of matches]*/
export default class matchList extends Riot {

    query = `https://{REGION}.api.riotgames.com/lol/match/v5/matches/by-puuid/{0}/ids?start=0&count={1}`
    readonly promiseRateLimiter = matchListLimiter;
    constructor(values: string[], region: string) {
        super(values, region)
        this.query = buildQuery(this.query, this.values, this.region);
    }
    async execute(): Promise<[number[], err | null]> {
        var [res, err] = await super.execute()
        if (err) {
            return [[], err]
        } else {
            return [res as number[], err]
        }
    }
}