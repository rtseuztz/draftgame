import limiter from "./rate-limiter";

const summonerRankLimiter = new limiter(10, 60)

export default summonerRankLimiter