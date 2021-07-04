import { openDatabase, SQLite } from 'react-native-sqlite-storage'
import User from './Users'
import Product from './Products'
import Configuration from './Configurations'
import Area from './Areas'
import Detail from './Details'
import Inventory from './Inventories'


const user = new User()
const product = new Product()
const area = new Area()
const detail = new Detail()
const configuration = new Configuration()
const inventory = new Inventory()


export default class Database {

    async initDB(){
        const db = await openDatabase({name: 'data.db'})
        return(db)
    }

    checkDatabase = async () =>{
        const db = await this.initDB()
        return new Promise((resolve, reject) => {
            db.executeSql('SELECT 1 FROM Users LIMIT 1', [], 
            () => { console.log('Database exists'); resolve(true) }, 
            () => { console.log('Database not exists'); resolve(false) })
        })
    }

    createDatabase = async () => {
        try{
            const isCreated = await this.checkDatabase()
            if (!isCreated){
                console.log('Creating Database')
                await user.createTableUsers()
                await configuration.createTableConfiguration()
                await configuration.insertIntoConfigurations([{key:"CheckAreaInventory",state:0}, {key:"CheckProductInventory",state:0}, {key:"UnitaryInventory",state:0} ])
                await inventory.createTableInventaires()
                await detail.createTableDetails()
                await product.createTableProducts()
                await area.createTableAreas()
                console.log('Database created')
            }
            return(true)
        }
        catch(err){ console.log('Problem creating Database') }
    }    
}