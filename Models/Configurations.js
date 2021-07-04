import { openDatabase } from 'react-native-sqlite-storage'


export default class Configurations{

    async initDB(){
        const db = await openDatabase({name: 'data.db'})
        return(db)
    }

    async createTableConfiguration(){
        const db = await this.initDB()
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                'CREATE TABLE IF NOT EXISTS Configuration (key TEXT UNIQUE PRIMARY KEY, state INTEGER NOT NULL DEFAULT 0)', [], 
                (tx, results) => {
                    resolve(results) 
                    console.log('table configuration created')
                })
            })
        })
    }

    async DeleteTableConfigurations(){
        const db = await this.initDB()
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                'DELETE FROM Configuration', [], 
                (tx, results) => {
                    resolve(results)
                    console.log('table Configuration deleted')
                })
            })
        })
    }

    async insertIntoConfigurations(data_to_insert){
        console.log('insert Configuration')
        const  db = await this.initDB()
        return new Promise((resolve, reject) => {
            var len = data_to_insert.length;
            for (let i = 0; i < len; i++) {
                let state = 0
                if (data_to_insert[i].Value == "True"){ state = 1}
                db.transaction((tx) => {
                    tx.executeSql('INSERT INTO Configuration (key, state) VALUES (?, ?)', 
                    [data_to_insert[i].Key, state],)
                })
            }
            resolve(console.log('configuration inserted'))
        })
    }

    async getConfiguration(configuration_key) {
        const  db = await this.initDB()
        return new Promise((resolve) => {
            db.transaction((tx) => {
                tx.executeSql( 'SELECT state FROM Configuration WHERE key = ?', [configuration_key],
                (tx, results) => {
                    var len = results.rows.length
                    if (len > 0) { 
                        resolve(results.rows.item(0).state)
                        console.log('get configuration ' + configuration_key + 'is ' +results.rows.item(0).state )
                    }
                    else{ reject('configuration introuvable') } 
                })
            })
        })
    }

    async updateConfiguration(configuration_item){
        const db = await this.initDB()
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql( 'UPDATE Configuration SET state = ? WHERE key = ? ', configuration_item,
                (tx, results) => {
                    resolve(results) 
                    console.log('configuration updated')
                })
            })
        })
    }
}