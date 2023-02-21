import matchesLimiter from "../../limiters/matches";
import Riot from "../riot/IRiot";
import { buildQuery, err, SUMMONER_REGIONS } from "../riot/RiotFunctions";
import { Game, Summoner } from "@/d";
import httpMocks from 'node-mocks-http'
import { instanceOfSummonerRank, summonerRank } from "../summonerRank/summonerRank";
import draft from "../../db/draft";

export default class RiotGame extends Riot {
    //DOESNT SUPPORT MULTI REGION GAMES FOR NOW
    //TO FIX, CHANGE THE NA1_ IN FRONT OF QUERY
    query = `https://{REGION}.api.riotgames.com/lol/match/v5/matches/NA1_{0}`
    readonly promiseRateLimiter = matchesLimiter
    /**
     * 
     * @param values - [matchID]
     * @param region 
     */
    constructor(values: string[], region: string) {
        super(values, region)
        this.query = buildQuery(this.query, this.values, this.region);
    }
    /**
     * GET
     * @returns Retrieves the game object
     */
    async execute(): Promise<Game.GameObject | err> {
        var res: Game.GameObject | err = await super.execute()
        if (!instanceOfGame(res))
            return res
        //if the game is not a ranked match on summoners rift, throw an error
        if (res.info.gameType != "MATCHED_GAME" || res.info.mapId != 11 || res.info.gameMode != "CLASSIC") {
            const notMatchedErr: err =
            {
                status: {
                    message: "Not a ranked game",
                    status_code: 404
                }
            }
            return notMatchedErr
        }
        return res
    }
    async convertGame(game: Game.GameObject): Promise<Game.DBGamePostObject> {
        let team1: number[] = []
        let team2: number[] = []
        game.info.participants.forEach((p: Game.Participant) => p.win ? team1.push(p.championId) : team2.push(p.championId))
        //sort each team list
        team1.sort(); team2.sort();
        //depending on which team is numerically lower, put that one first
        const firstTeamWonGame = team1[0] < team2[0]
        const finalTeam = firstTeamWonGame
            ? team1.concat(team2)
            : team2.concat(team1)
        //convert that to a comma delineated list for the db (in champstring)
        const finalTeamString = finalTeam.toString()

        const tier = await this.getRank(game.info.participants, game.info.gameId)
        const newGame: Game.DBGamePostObject = {
            gameID: game.info.gameId,
            champString: finalTeamString,
            team1Win: firstTeamWonGame,
            team2Win: !firstTeamWonGame,
            date: game.info.gameCreation,
            gameVersion: game.info.gameVersion,
            gameType: game.info.gameType,
            mapId: game.info.mapId,
            tier: tier
        }
        return newGame
    }
    async getRank(participants: Game.Participant[], gameID: number): Promise<string> {
        let sumObj: Summoner.RankedSummoner | err = { status: { message: "", status_code: 0 } }
        let participantIndex = 0
        while (participantIndex < 9 && !instanceOfSummonerRank(sumObj)) {
            const factory = new summonerRank([participants[participantIndex++].summonerId], SUMMONER_REGIONS["North America"])
            sumObj = await factory.execute()
        }
        // const factory = new summonerRank([summonerID], SUMMONER_REGIONS["North America"])
        // sumObj = await factory.execute()
        if (instanceOfSummonerRank(sumObj)) {
            return sumObj.tier
        }
        else {
            return "NORANK"

        }
    }
    async postGame(game: Game.DBGamePostObject): Promise<boolean> {
        const res = await draft.post(game)
        if (res)
            return true
        return false
    }
}

export function instanceOfGame(object: any): object is Game.GameObject {
    return 'info' in object;
}