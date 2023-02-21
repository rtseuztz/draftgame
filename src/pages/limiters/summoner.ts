import limiter from "./rate-limiter";

const summonerLimiter = new limiter(1600, 60)

export default summonerLimiter