import React from 'react'
import {View, TouchableOpacity, Text, StyleSheet, Image, ScrollView} from 'react-native'
import { connect } from 'react-redux'
import BottomBar from './BottomBar'
import {LOGIN, LOGOUT} from '../Redux/Reducers/authenticationReducer'


class Home extends React.Component 
{
    constructor(props){
        super(props)
    }

    logout(){
        const action = { type: LOGOUT, value: {} }
        this.props.dispatch(action)
    }

    accessMenu(key){
        this.props.navigation.navigate(key)
    }

    render(){
        return(
            <View style={{flex:1, backgroundColor:'#FFF5EE'}}>
                <ScrollView style={{marginTop:15}}>
                <View style={styles.rowButton}>
                    <TouchableOpacity 
                    style={ styles.squareButtonContainer }
                    onPress={() => {this.accessMenu("Inventaires")}}>
                        <Image source={require('../Images/inventory.png')} style={styles.image}/>
                        <Text style={styles.textButtonContainer}>Inventaire</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    style={styles.squareButtonContainer}
                    onPress={() => {this.accessMenu("Détails Inventaires")}}>
                        <Image source={require('../Images/stockscreen.png')} style={styles.image}/>
                        <Text style={styles.textButtonContainer}>Détails</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.rowButton}>
                        <TouchableOpacity 
                        style={styles.squareButtonContainer}
                        onPress={() => {this.accessMenu("Articles")}}>
                            <Image source={require('../Images/products.png')} style={styles.image}/>
                            <Text style={styles.textButtonContainer}>Articles</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        style={styles.squareButtonContainer}
                        onPress={() => {this.accessMenu("Emplacements")}}>
                            <Image source={require('../Images/warehouse.png')} style={styles.image}/>
                            <Text style={styles.textButtonContainer}>Empl.</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.rowButton}>
                    {this.props.user_token.isAdmin == 1 &&
                    <TouchableOpacity 
                    style={styles.squareButtonContainer}
                    onPress={() => {this.accessMenu("Configuration")}}>
                        <Image source={require('../Images/process.png')} style={styles.image}/>
                        <Text style={styles.textButtonContainer}>Configuration</Text>
                    </TouchableOpacity>
                    }
                    <TouchableOpacity 
                    style={styles.squareButtonContainer}
                    onPress={() => {this.logout()}}>
                        <Image source={require('../Images/logout.png')} style={styles.image}/>
                        <Text style={styles.textButtonContainer}>Déconnexion</Text>
                    </TouchableOpacity>
                    </View>
                </ScrollView>
                <BottomBar style={{bottom: 0}}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    rowButton:{flexDirection:'row', justifyContent:'center', margin:5},
    buttonContainer:{
        justifyContent:'center', 
        marginHorizontal:20, 
        height: 50,
        marginTop: 20,
        borderRadius: 5,
    },
    squareButtonContainer:{
        justifyContent:'center',
        alignItems:'center',
        margin:5,
        height: 90,
        width: 130,
        borderRadius: 5,
        backgroundColor:'white',
    },
    viewMiniButtonContainer:{
        flexDirection:'row', 
        marginTop: 20, 
        marginHorizontal:20, 
    },
    miniButtonContainer:{
        justifyContent:'center', 
        width:"49%", 
        height: 50, 
        borderRadius: 5,
        backgroundColor:'#004578',
    },
    textButtonContainer:{
        textAlign: 'center',
        color:'#004578', 
        fontSize: 16,
    },
    image:{
        resizeMode: 'stretch',
        height:50,
        width:50,
    },
})

const mapDispatchToProps = (dispatch) => {
    return {
      dispatch: (action) => { dispatch(action) }
    }
  }
  
  const mapStateToProps = (state) => {
    return {
        authenticated: state.authReducer.authenticated,
        user_token: state.authReducer.user_token,
    }
  }

  export default connect(mapStateToProps, mapDispatchToProps)(Home)