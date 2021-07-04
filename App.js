import 'react-native-gesture-handler'
import React from 'react'
import { PersistGate } from 'redux-persist/es/integration/react'
import { persistStore } from 'redux-persist'

import AppNavigation from './Navigation/Navigation'
import {Provider} from 'react-redux'
import Store from './Redux/configureStore'
import Database from './Models/Database'


console.log('**************************************')

async function HelloDatabase(){
  const db = new Database()
  await db.createDatabase()
}

HelloDatabase()


export default class App extends React.Component{ 
  render(){
    let persistor = persistStore(Store)
    return (
      <Provider store={Store}>
        <PersistGate persistor={persistor}>
          <AppNavigation/>
        </PersistGate>
      </Provider>
    )
  }
}