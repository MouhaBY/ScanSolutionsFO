import { openDatabase } from 'react-native-sqlite-storage'


export default class Users{

    async initDB(){
        const db = await openDatabase({name: 'data.db'})
        return(db)
    }
    
    async createTableUsers(){
        const  db = await this.initDB()
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                'CREATE TABLE IF NOT EXISTS Users (id TEXT UNIQUE PRIMARY KEY, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL UNIQUE, contact TEXT NOT NULL, isAdmin INTEGER NOT NULL DEFAULT 0)', [], 
                (tx, results) => { 
                    resolve(results)
                    console.log('table users created')
                })
            })
        })
    }

    async DeleteTableUsers(){
        const  db = await this.initDB()
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                'DELETE FROM Users', [], 
                (tx, results) => {
                    resolve(results)
                    console.log('table Users deleted')
                })
            })
        })
    }

    async insertIntoUsers(data_to_insert){
        console.log('insert users')
        const  db = await this.initDB()
        return new Promise((resolve, reject) => {
            var len = data_to_insert.length;
            for (let i = 0; i < len; i++) {
                let isAdmin = 1
                if (data_to_insert[i].RoleId == '4') { isAdmin = 0 }
                let contact = data_to_insert[i].ContactName
                if (contact == null) {contact = data_to_insert[i].UserName }
                db.transaction((tx) => {
                    tx.executeSql('INSERT INTO Users (id, username, password, contact, isAdmin) VALUES (?, ?, ?, ?, ?)', 
                    [data_to_insert[i].Id, data_to_insert[i].UserName, data_to_insert[i].UserName, contact, isAdmin],)
                })
            }
            resolve(console.log('users inserted'))
        })
    }

    async searchUser(username) {
        const  db = await this.initDB()
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql( 'SELECT id, username, password, contact, isAdmin FROM Users WHERE UPPER(username) = ?', [username.toUpperCase()],
                (tx, results) => {
                    var len = results.rows.length
                    if (len > 0) { resolve(results.rows.item(0)) }
                    else{ reject({}) }
                })
            })
        })
    }

}
