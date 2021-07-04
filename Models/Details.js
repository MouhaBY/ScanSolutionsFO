import { openDatabase } from 'react-native-sqlite-storage'


export default class Details{

    async initDB(){
        const db = await openDatabase({name: 'data.db'})
        return(db)
    }

    async createTableDetails(){
        const db = await this.initDB()
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS Details (id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT, inventory_id INTEGER NOT NULL, location TEXT NOT NULL, barcode TEXT NOT NULL, quantity REAL NOT NULL, user_id INTEGER, date TEXT, isSynced TEXT)', [], 
                (tx, results) => { 
                    resolve(results) 
                    console.log('table details created')
                })
            })
        })
    }

    async getDetailsInventaires(id_inventaire) {
        const  db = await this.initDB()
        return new Promise((resolve) => {
            const details = []
            db.transaction((tx) => {
                tx.executeSql('SELECT id, location, barcode, quantity, user_id, date FROM Details WHERE inventory_id = ?', [id_inventaire],
                (tx, results) => {
                    var len = results.rows.length
                    if (len > 0) {
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i)
                            const { id, location, barcode, quantity, user_id, date } = row
                            details.push({
                                id, 
                                location, 
                                barcode, 
                                quantity,
                                user_id,
                                date
                              })
                        } 
                        resolve(details)  
                    }
                    else{ reject('inventaire introuvable') }
                })
            })
        })
    }

    async addDetailInventaire(item) {
        const db = await this.initDB()
        return new Promise((resolve) => {
            db.transaction((tx) => {
                tx.executeSql('INSERT INTO Details (inventory_id, location, barcode, quantity, user_id, date) VALUES (?, ?, ?, ?, ?, ?)', 
                [item.inventory_id, item.location, item.barcode, item.quantity, item.user_id, item.date],
                (tx, results) => { resolve(results) })
            })
        })
    }

    async deleteDetailInventaire(item_id){
        const db = await this.initDB()
        return new Promise((resolve) => { db.transaction((tx) => { tx.executeSql('DELETE FROM Details WHERE id = ?', [item_id], 
            ([tx, results]) => { resolve(results) }) })
        })
    }

    async getNotSyncedDetailsInventaires() {
        const  db = await this.initDB()
        return new Promise((resolve) => {
            const details = []
            db.transaction((tx) => {
                tx.executeSql('SELECT id, inventory_id, location, barcode, quantity, user_id, date, isSynced FROM Details WHERE isSynced IS NULL', [],
                (tx, results) => {
                    var len = results.rows.length
                    if (len > 0) {
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i)
                            const { id, inventory_id, location, barcode, quantity, user_id, date, isSynced } = row
                            details.push({
                                id, 
                                inventory_id,
                                location, 
                                barcode, 
                                quantity,
                                user_id,
                                date,
                                isSynced
                              })
                        } 
                        resolve(details)  
                    }
                    else{ resolve([]) }
                })
            })
        })
    }

    async updateSyncedDetailsInventaires() {
        const  db = await this.initDB()
        return new Promise((resolve) => {
            db.transaction((tx) => {
                tx.executeSql('UPDATE Details SET isSynced = 1 WHERE isSynced IS NULL', [],
                (tx, results) => { resolve(results) })
            })
        })
    }
    
}
