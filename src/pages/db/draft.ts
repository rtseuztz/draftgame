import { Game } from "@/d"
import query, { queryMultiple, queryObj } from "./db/db"
const draft = {
    post: async (d: Game.DBGamePostObject): Promise<any> => {
        const retVal = await query(`INSERT INTO draft 
            (gameID, champString, team1Win, team2Win, Date, gameVersion, gameType, mapId, tier)
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [d.gameID, d.champString, d.team1Win, d.team2Win, d.date, d.gameVersion, d.gameType, d.mapId, d.tier])
        return retVal
    },
    get: async (champString: string): Promise<Game.DBGameRetObject[]> => {
        const retVal = await query(
            `SELECT * FROM champstring WHERE champString = ?`,
            [champString])
        return retVal as Game.DBGameRetObject[]
    },
    getLatestGameID: async (): Promise<number> => {
        const retVal = await query(
            `select MAX(gameID) as gameID from draft`,
            []
        )
        const row = retVal[0]
        return row.gameID as number
    }
    // postMultiple: async (p: Participant[]): Promise<any> => {
    //     let queries: queryObj[] = []
    //     p.forEach((p: Participant) => {
    //         queries.push(
    //             {
    //                 query: `INSERT INTO player 
    //         (gameID, startTime, gameType, allInPings,assistMePings,assists,baitPings,baronKills,basicPings,bountyLevel,champExperience,champLevel,championId,championName,championTransform,commandPings,consumablesPurchased,damageDealtToBuildings,damageDealtToObjectives,damageDealtToTurrets,damageSelfMitigated,dangerPings,deaths,detectorWardsPlaced,doubleKills,dragonKills,eligibleForProgression,enemyMissingPings,enemyVisionPings,firstBloodAssist,firstBloodKill,firstTowerAssist,firstTowerKill,gameEndedInEarlySurrender,gameEndedInSurrender,getBackPings,goldEarned,goldSpent,holdPings,individualPosition,inhibitorKills,inhibitorTakedowns,inhibitorsLost,item0,item1,item2,item3,item4,item5,item6,itemsPurchased,killingSprees,kills,lane,largestCriticalStrike,largestKillingSpree,largestMultiKill,longestTimeSpentLiving,magicDamageDealt,magicDamageDealtToChampions,magicDamageTaken,needVisionPings,neutralMinionsKilled,nexusKills,nexusLost,nexusTakedowns,objectivesStolen,objectivesStolenAssists,onMyWayPings,participantId,pentaKills,physicalDamageDealt,physicalDamageDealtToChampions,physicalDamageTaken,profileIcon,pushPings,puuid,quadraKills,riotIdName,riotIdTagline,role,sightWardsBoughtInGame,spell1Casts,spell2Casts,spell3Casts,spell4Casts,summoner1Casts,summoner1Id,summoner2Casts,summoner2Id,summonerId,summonerLevel,summonerName,teamEarlySurrendered,teamId,teamPosition,timeCCingOthers,timePlayed,totalDamageDealt,totalDamageDealtToChampions,totalDamageShieldedOnTeammates,totalDamageTaken,totalHeal,totalHealsOnTeammates,totalMinionsKilled,totalTimeCCDealt,totalTimeSpentDead,totalUnitsHealed,tripleKills,trueDamageDealt,trueDamageDealtToChampions,trueDamageTaken,turretKills,turretTakedowns,turretsLost,unrealKills,visionClearedPings,visionScore,visionWardsBoughtInGame,wardsKilled,wardsPlaced,win)
    //         VALUES
    //         (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    //                 values: [p.gameID, p.startTime, p.gameType, p.allInPings, p.assistMePings, p.assists, p.baitPings, p.baronKills, p.basicPings, p.bountyLevel, p.champExperience, p.champLevel, p.championId, p.championName, p.championTransform, p.commandPings, p.consumablesPurchased, p.damageDealtToBuildings, p.damageDealtToObjectives, p.damageDealtToTurrets, p.damageSelfMitigated, p.dangerPings, p.deaths, p.detectorWardsPlaced, p.doubleKills, p.dragonKills, p.eligibleForProgression, p.enemyMissingPings, p.enemyVisionPings, p.firstBloodAssist, p.firstBloodKill, p.firstTowerAssist, p.firstTowerKill, p.gameEndedInEarlySurrender, p.gameEndedInSurrender, p.getBackPings, p.goldEarned, p.goldSpent, p.holdPings, p.individualPosition, p.inhibitorKills, p.inhibitorTakedowns, p.inhibitorsLost, p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6, p.itemsPurchased, p.killingSprees, p.kills, p.lane, p.largestCriticalStrike, p.largestKillingSpree, p.largestMultiKill, p.longestTimeSpentLiving, p.magicDamageDealt, p.magicDamageDealtToChampions, p.magicDamageTaken, p.needVisionPings, p.neutralMinionsKilled, p.nexusKills, p.nexusLost, p.nexusTakedowns, p.objectivesStolen, p.objectivesStolenAssists, p.onMyWayPings, p.participantId, p.pentaKills, p.physicalDamageDealt, p.physicalDamageDealtToChampions, p.physicalDamageTaken, p.profileIcon, p.pushPings, p.puuid, p.quadraKills, p.riotIdName, p.riotIdTagline, p.role, p.sightWardsBoughtInGame, p.spell1Casts, p.spell2Casts, p.spell3Casts, p.spell4Casts, p.summoner1Casts, p.summoner1Id, p.summoner2Casts, p.summoner2Id, p.summonerId, p.summonerLevel, p.summonerName, p.teamEarlySurrendered, p.teamId, p.teamPosition, p.timeCCingOthers, p.timePlayed, p.totalDamageDealt, p.totalDamageDealtToChampions, p.totalDamageShieldedOnTeammates, p.totalDamageTaken, p.totalHeal, p.totalHealsOnTeammates, p.totalMinionsKilled, p.totalTimeCCDealt, p.totalTimeSpentDead, p.totalUnitsHealed, p.tripleKills, p.trueDamageDealt, p.trueDamageDealtToChampions, p.trueDamageTaken, p.turretKills, p.turretTakedowns, p.turretsLost, p.unrealKills, p.visionClearedPings, p.visionScore, p.visionWardsBoughtInGame, p.wardsKilled, p.wardsPlaced, p.win]
    //             }
    //         )
    //     })
    //     await queryMultiple(queries)
    // },
    // getByPUUID: async (puuid: string): Promise<Participant[]> => {
    //     const retVal = await query(`SELECT * FROM player WHERE puuid = ?`,
    //         [puuid])
    //     return retVal as Participant[]
    // },
    // getGamesByPUUID: async (puuid: string): Promise<Participant[]> => {
    //     const retVal = await query(`select * from player p, player p2 where p.puuid = ? and p.gameID = p2.gameID`,
    //         [puuid])
    //     return retVal as Participant[]
    // }
}

export default draft