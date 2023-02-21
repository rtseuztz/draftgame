import * as mysql from 'mysql2/promise'


export default async function query(query: string, values: any[]): Promise<any> {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DB,
    });
    var retVal: any = null
    try {
        const [rows, fields] = await connection.execute(query, values)
        retVal = rows;
    } catch (e) {
        retVal = e;
    } finally {
        await connection.end()
        return retVal;
    }
}
export async function queryMultiple(queries: queryObj[]) {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DB,
    });
    var retVal: any[] = []
    try {
        let awaitingQueries: Promise<any>[] = []
        queries.forEach((q: queryObj) => {
            awaitingQueries.push(connection.execute(q.query, q.values))
        })
        const resolvedQueries = await Promise.all(awaitingQueries)
        resolvedQueries.forEach((q: [rows: any, fields: any]) => {
            retVal.push(q[0])
        })
    } catch (e) {
        retVal.push(e);
    } finally {
        await connection.end()
        return retVal;
    }
}

export interface queryObj {
    query: string
    values: any[]
}