import { openDatabase } from 'react-native-sqlite-storage'


export default class Products{

    async initDB(){
        const db = await openDatabase({name: 'data.db'})
        return(db)
    }
    
    async createTableProducts(){
        const  db = await this.initDB()
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                'CREATE TABLE IF NOT EXISTS Products (id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL UNIQUE, name TEXT NOT NULL)', [], 
                (tx, results) => {
                    resolve(results)
                    console.log('Table Products created')
                })
            })
        })
    }

    async DeleteTableProducts(){
        const  db = await this.initDB()
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                'DELETE FROM Products', [], 
                (tx, results) => {
                    resolve(results)
                    console.log('table Products deleted')
                })
            })
        })
    }

    async insertIntoProducts(data_to_insert){
        console.log('insert Products')
        const  db = await this.initDB()
        return new Promise((resolve, reject) => {
            var len = data_to_insert.length;
            for (let i = 0; i < len; i++) {
                db.transaction((tx) => {
                    tx.executeSql('INSERT INTO Products (code, name) VALUES (?, ?)', 
                    [data_to_insert[i].Code, data_to_insert[i].Name],)
                })
            }
            resolve(console.log('Products inserted'))
        })
    }

    async getProducts() {
        const  db = await this.initDB()
        return new Promise((resolve) => {
            const products = []
            db.transaction((tx) => {
                tx.executeSql(
                'SELECT id, code, name FROM Products', [],
                (tx, results) => {
                    var len = results.rows.length
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i)
                        const { id, code, name } = row
                        products.push({
                            id,
                            code,
                            name
                          })
                    }
                    resolve(products)              
                })
            })
        })
    }

    async searchProduct(product_code) {
        const  db = await this.initDB()
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql( 'SELECT id, code, name FROM Products WHERE code = ?', [product_code],
                (tx, results) => {
                    var len = results.rows.length
                    if (len > 0) { resolve(results.rows.item(0)) }
                    else{ reject('Product unknown') }
                })
            })
        })
    }
}
