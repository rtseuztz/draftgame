import RateLimiter from "./rate-limiter"
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
describe('Generic Rate Limiter', () => {
    /**
     * This test is of 3 functions with 5 seconds in between,
     * but since they are called in succession and the queue is empty,
     * they should be almost instant waiting only for their own promises.
     */
    test('Very Limited', async () => {
        const rl = new RateLimiter(1, .5);
        const prom = async () => {
            sleep(500);
            return new Response();
        }

        const startTime = Date.now();
        await rl.addFunction(prom())
        await rl.addFunction(prom())
        await rl.addFunction(prom())
        const endTime = Date.now();
        const secondsElapsed = (endTime - startTime) / 1000
        expect(secondsElapsed).toBeLessThan(5)
    }, 15000)
    test('Very Limited + Queue', async () => {
        const rl = new RateLimiter(1, 1.5);
        const prom = async () => {
            sleep(100);
            return new Response();
        }

        const startTime = Date.now();
        for (var i = 0; i < 2; i++) {
            rl.addFunction(prom())
        }
        await rl.addFunction(prom())
        const endTime = Date.now();
        const secondsElapsed = (endTime - startTime) / 1000
        expect(secondsElapsed).toBeGreaterThan(2)
    }, 15000)
})