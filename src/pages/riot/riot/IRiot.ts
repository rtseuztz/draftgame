import limiter from "@/pages/limiters/rate-limiter";
import { buildQuery, err, riotFetch } from "./RiotFunctions";
import RateLimiter from "@/pages/limiters/rate-limiter";
import summonerLimiter from "../../limiters/summoner";
import { NextResponse } from "next/server";
export default abstract class Riot {
    /**
     * This should have missing values as {0}, {1}, ...
     */
    query: string = ""
    protected readonly values: string[]
    protected readonly region: string
    protected readonly promiseRateLimiter: RateLimiter = summonerLimiter
    constructor(values: string[], region: string) {
        this.values = values;
        this.region = region
    }
    /**
     * 
     * @returns The JSON of the object with a null error, or a null JSON with an error object.
     */
    async execute(): Promise<any | err> {
        const userRes = await this.promiseRateLimiter.addFunction(riotFetch(this.query))
        let res: any
        try {
            console.log(userRes)
            res = await userRes.json()
            console.log(res)
            if (!res || res.status)
                return res as err
            else return res
        } catch (e: any) {
            console.log("it did error below indeed")
            return { status: { message: "invalid resp body", status_code: 0 } } as err
        }

    }
}
