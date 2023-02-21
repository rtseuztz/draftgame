import limiter from "./rate-limiter";

const matchListLimiter = new limiter(2000, 10)

export default matchListLimiter