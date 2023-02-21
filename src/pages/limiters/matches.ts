import limiter from "./rate-limiter";

const matchesLimiter = new limiter(2000, 10)

export default matchesLimiter