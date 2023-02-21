import { Game } from "@/d"
import draft from "../db/draft"
import RiotGame, { instanceOfGame } from "../riot/match/matches"
import { MATCH_REGIONS } from "../riot/riot/RiotFunctions"

class update {

    constructor() { }

    async addAGame(gameID?: number): Promise<number> {
        //if no gameid,
        //1. get the latest game id (draft.getLatestGame)
        //2. get the game (RiotGame.execute)
        //3. convert it (RiotGame.convert)
        //4. post it (riotgame.post)
        if (!gameID) {
            const lastestGameID = await draft.getLatestGameID()
            gameID = lastestGameID + 1
        }
        const gameFactory = new RiotGame([gameID.toString()], MATCH_REGIONS.AMERICA)
        let game = await gameFactory.execute()
        if (!instanceOfGame(game)) {
            if (game.status.status_code == 404)
                return gameID
            else
                throw new Error("Game wasn't found - not a 404 error");
        }
        game = game as Game.GameObject
        const convertedGame: Game.DBGamePostObject = await gameFactory.convertGame(game)
        const res = await gameFactory.postGame(convertedGame)

        if (!res) throw new Error("Posting went wrong")
        return gameID
    }
    async add100Games(): Promise<number> {
        console.log("Starting")
        let gameid = await this.addAGame()
        let arr = []
        for (let i = 0; i < 99; i++) {
            gameid++;
            arr.push(this.addAGame(++gameid))
        }
        await Promise.all(arr)
        console.log("donezo!!")
        return gameid
    }

}
export default update