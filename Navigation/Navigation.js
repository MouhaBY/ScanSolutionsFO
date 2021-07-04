import React from 'react'
import {createStackNavigator} from "@react-navigation/stack"
import {NavigationContainer} from "@react-navigation/native"
import { connect } from 'react-redux'

import LoginForm from '../Components/LoginForm'
import Home from '../Components/Home'
import InventoriesMenu from '../Components/InventoriesMenu'
import InventoriesDetailsMenu from '../Components/InventoriesDetailsMenu'
import InventorierForm from '../Components/InventorierForm'
import InventoryDetails from '../Components/InventoryDetails'
import ConfigurationForm from '../Components/ConfigurationForm'
import store from '../Redux/configureStore'
import SyncButton from '../Components/SyncButton'
import Products from '../Components/Products'
import Areas from '../Components/Areas'


const Stack = createStackNavigator()

const AppNavigation = () => {
    const state = store.getState()
    const authenticated = state.authReducer.authenticated
    
    if (authenticated) {
        return(
            <NavigationContainer>             
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={Home} options={{headerRight:()=>(<SyncButton/>)}}/>
                    <Stack.Screen name="Inventaires" component={InventoriesMenu}/>
                    <Stack.Screen name="Détails Inventaires" component={InventoriesDetailsMenu}/>
                    <Stack.Screen name="Inventorier" component={InventorierForm}/>
                    <Stack.Screen name="Détails" component={InventoryDetails}/>
                    <Stack.Screen name="Configuration" component={ConfigurationForm}/>
                    <Stack.Screen name="Articles" component={Products}/>
                    <Stack.Screen name="Emplacements" component={Areas}/>
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
    else {
        return(
            <NavigationContainer>             
                <Stack.Navigator>
                    <Stack.Screen name="Connexion" component={LoginForm} options={{headerRight:()=>(<SyncButton/>)}}/>
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

const mapStateToProps = state => {
    return {
        authenticated: state.authReducer.authenticated
    }
}
  
export default connect(mapStateToProps)(AppNavigation)