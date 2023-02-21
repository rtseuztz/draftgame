type callback = () => any
export class limiter {

    private execs: number;
    private seconds: number;
    //use push() and shift(), so its backwards
    private queue: callback[] = [];
    private dequeing: boolean = false;
    private timeBetween: number;
    constructor(execs: number, seconds: number) {
        this.execs = execs;
        this.seconds = seconds
        this.timeBetween = 1000 * seconds / execs
    }
    private readonly sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    addFunction(callback: () => any) {
        this.queue.push(callback);
        this.checkTriggerQueue();
    }
    private checkTriggerQueue() {
        if (this.dequeing)
            return;
        else {
            this.startQueue();
        }
    }
    private async startQueue() {
        this.dequeing = true;
        let execsThisMinute = this.execs;
        let totalExecutions = 0;
        while (this.queue.length > 0) {
            const start = new Date().getTime()
            while (execsThisMinute) {
                const callback: any = this.queue.shift()
                if (callback) {
                    // const resp = await fetch(obj.query);
                    // const game = await resp.json();
                    // obj.callback();
                    await this.sleep(this.timeBetween)
                    callback();
                } else {
                    break;
                }
                totalExecutions++;
                execsThisMinute--;
            }
            if (this.queue.length > 0) {
                await this.sleep((this.seconds * 60 * 1000) - (new Date().getTime() - start));
                execsThisMinute = this.execs;
            }
        }
        this.dequeing = false;

    }
}

/**
 * - Create with execs per min
 * - be able to add in a function that will return
 */
// export class RateLimiter {
//     private execs: number;
//     private seconds: number;
//     //use push() and shift(), so its backwards
//     private queue: callback[] = [];
//     private dequeing: boolean = false;
//     private timeBetween: number;
//     constructor(execs: number, seconds: number) {
//         this.execs = execs;
//         this.seconds = seconds
//         this.timeBetween = 1000 * seconds / execs
//     }
//     private readonly sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

//     /**
//      * adds a function and returns the value as a promise
//      */
//     addFunction(func: () => any): Promise<any> {
//         var funcObj = {
//             func:
//         }
//         this.queue.push(func);
//         return
//     }
// }

export default class RateLimiter {

    private readonly requests: number
    private readonly seconds: number
    private readonly millisecondsPerFunction: number;
    private functionsQueued = 0;
    static sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    constructor(requests: number, seconds: number) {
        this.requests = requests
        this.seconds = seconds
        this.millisecondsPerFunction = (seconds / requests) * 1000
    }
    async addFunction(prom: Promise<Response>): Promise<Response> {
        this.functionsQueued++;
        await RateLimiter.sleep((this.functionsQueued - 1) * this.millisecondsPerFunction);
        this.functionsQueued--;
        return prom;
    }
}