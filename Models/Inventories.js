import { openDatabase } from 'react-native-sqlite-storage'


export default class Inventories{

    async initDB(){
        const db = await openDatabase({name: 'data.db'})
        return(db)
    }
    
    async createTableInventaires(){
        const  db = await this.initDB()
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                'CREATE TABLE IF NOT EXISTS Inventories (id INTEGER UNIQUE PRIMARY KEY, name TEXT NOT NULL, date TEXT NOT NULL, state TEXT NOT NULL, isSynced TEXT)', [], 
                (tx, results) => {
                    resolve(results) 
                    console.log('table inventaires created')
                })
            })
        })
    }

    async DeleteTableInventories(){
        const  db = await this.initDB()
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                'DELETE FROM Inventories', [], 
                (tx, results) => {
                    resolve(results)
                    console.log('table Inventaires deleted')
                })
            })
        })
    }

    async insertInventaire(inventaire){
        const db = await this.initDB()
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql( 'INSERT INTO Inventories (id, name, date, state) VALUES (?, ?, ?, ?)', [inventaire.id, inventaire.name, inventaire.date, inventaire.state],
                (tx, results) => { resolve(results) })
            })
        })
    }

    async insertIntoInventories(data_to_insert){
        console.log('insert inventaires')
        const  db = await this.initDB()
        return new Promise((resolve, reject) => {
            var len = data_to_insert.length;
            for (let i = 0; i < len; i++) {
                db.transaction((tx) => {
                    tx.executeSql('INSERT INTO Inventories (id, name, date, state) VALUES (?, ?, ?, ?)', 
                    [data_to_insert[i].Id, data_to_insert[i].Name, data_to_insert[i].StartDate.substring(0, 10), data_to_insert[i].InventoryStateId])
                })
            }
            resolve(console.log('inventaires inserted'))
        })
    }

    async getInventaires() {
        const  db = await this.initDB()
        return new Promise((resolve) => {
            const inventaires = []
            db.transaction((tx) => {
                tx.executeSql('SELECT id, name, date, state FROM Inventories', [],
                (tx, results) => {
                    var len = results.rows.length
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i)
                        const { id, name, date, state } = row
                        inventaires.push({
                            id,
                            name,
                            date,
                            state
                          })
                    }   
                    resolve(inventaires)              
                })
            })
        })
    }

    async getInventairesNotSynced() {
        const  db = await this.initDB()
        return new Promise((resolve) => {
            const inventaires = []
            db.transaction((tx) => {
                tx.executeSql('SELECT id, name, date, state, isSynced FROM Inventories WHERE isSynced IS NULL', [],
                (tx, results) => {
                    var len = results.rows.length
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i)
                        const { id, name, date, state, isSynced } = row
                        inventaires.push({
                            id,
                            name,
                            date,
                            state,
                            isSynced
                          })
                    }   
                    resolve(inventaires)              
                })
            })
        })
    }

    async updateSyncedinventories() {
        const  db = await this.initDB()
        return new Promise((resolve) => {
            db.transaction((tx) => {
                tx.executeSql('UPDATE Inventories SET isSynced = 1 WHERE isSynced IS NULL', [],
                (tx, results) => { resolve(results) })
            })
        })
    }

}
