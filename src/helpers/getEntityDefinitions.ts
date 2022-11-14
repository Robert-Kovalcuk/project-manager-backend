import {RawDefinitionsResult} from "../services/pipelineService"
import {createConnection, getManager} from "typeorm"
import {camelToPretty} from "./string"

export default async function(entity: string): Promise<IDefinition[]> {
    const query = `select COLUMN_NAME from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME="${entity}"`
    const rawResults = await getManager("default").connection.manager.query(query) as RawDefinitionsResult[]

    let def: IDefinition[] = []


    rawResults.forEach(result => {
       def.push({
           key: result.COLUMN_NAME,
           value: camelToPretty(result.COLUMN_NAME)
       })
    })

    return def
}

interface IDefinition {
    key: string
    value: string
}


