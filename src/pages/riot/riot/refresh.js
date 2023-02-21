const fs = require('fs');
const writeFileSync = fs.writeFileSync;
async function refresh() {
    const version = await getVersion();
    const promises = [];
    promises.push(getChampions(version))
    promises.push(getItems(version))
    await Promise.all(promises)
}
async function getVersion() {
    const versionURL = "https://ddragon.leagueoflegends.com/api/versions.json"
    const versionJSON = await (await fetch(versionURL)).json()
    const version = versionJSON[0];
    return version;
}

async function getChampions(version) {
    const championsURL = `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
    const championsJSON = await (await (fetch(championsURL))).json()
    const championsList = Object.keys(championsJSON.data)
    // Converts the array to an object with the ... (spread)
    const championsObj = { ...championsList }
    await writeFileSync("../../../../app/data/champions.json", JSON.stringify(championsObj))
}
async function getItems(version) {
    const itemsURL = `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/item.json`
    const itemsJSON = await (await fetch(itemsURL)).json()
    await writeFileSync("../../../../app/data/items.json", JSON.stringify(itemsJSON))
}
refresh();
