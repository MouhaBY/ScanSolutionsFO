import React from 'react'
import { View, Text, StyleSheet, Button, Image, Alert, TextInput, Keyboard, TouchableWithoutFeedback, ScrollView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import RNBeep from 'react-native-a-beep'

import User from '../Models/Users'
import { LOGIN, LOGOUT } from '../Redux/Reducers/authenticationReducer'
import { SUBMIT } from '../Redux/Reducers/configurationReducer'
import store from '../Redux/configureStore'


const user = new User()


class LoginForm extends React.Component 
{
    constructor(props){
        super(props)
        this.state = {
            username: '',
            password: '',
            isFormValid: false,
            configuration:false,
            serverAddress:''
        }
    }

    componentDidMount(){
        const state = store.getState()
        const serverAddress = state.configReducer.serverAddress
        this.setState({serverAddress})
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.username !== prevState.username || this.state.password !== prevState.password) {
          this.validateForm()
      }
    }

    validateForm = () => {
        if (this.state.username !== "" && this.state.password !== "") {
            this.setState({isFormValid: true})
        }
        else
            this.setState({isFormValid: false})
    }

    _login = async () => {
        if (this.state.username !== "" && this.state.password !== "") {
            try{
                let user_found = await user.searchUser(this.state.username)
                if (this.state.password === user_found.password) {
                    RNBeep.beep()
                    const action = { type: LOGIN, value: user_found }
                    this.props.dispatch(action)
                }
                else {
                    RNBeep.beep(false)
                    Alert.alert('Accès interdit', 'Mot de passe erroné')
                    const action = { type: LOGOUT, value: {} }
                    this.props.dispatch(action)
                }
            }
            catch(err) {
                RNBeep.beep(false)
                Alert.alert('Accès interdit', 'Utilisateur introuvable')
                const action = { type: LOGOUT, value: {} }
                this.props.dispatch(action)
            }
        }
    }

    submitConfiguration = () => {
        const action = { type: SUBMIT, value: this.state.serverAddress }
        this.props.dispatch(action) 
        this.setState({configuration:false})
    }


    handleUsernameUpdate = username => { this.setState({username}) }

    handlePasswordUpdate = password => { this.setState({password}) }
    
    handleserveurUpdate = serverAddress => { this.setState({serverAddress}) }

    render(){
        return(
            <View style={{flex:1,}}>
                <View style={{flexDirection:'row', margin:3}}>
                    <TouchableOpacity 
                    onPress={() => this.setState({ configuration: !this.state.configuration })} 
                    style={styles.configuration}>
                        <Image source={require('../Images/settings.png')} style={ styles.iconSettings}/>
                    </TouchableOpacity>
                    {this.state.configuration &&
                        <View style={{flex:1, flexDirection:'row'}}>
                            <TextInput 
                            style={styles.textAddressInput} 
                            autoFocus={true}
                            placeholder="Adresse Serveur"
                            value={this.state.serverAddress} 
                            onChangeText={this.handleserveurUpdate} />
                            <TouchableOpacity
                            onPress={() => { this.submitConfiguration() }}
                            style={ styles.submit }>
                                <Text style={styles.textSubmit}>Submit</Text>
                            </TouchableOpacity> 
                        </View>
                    }
                </View>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                    <View 
                    style={styles.container}>
                        <Image source={require('../Images/logo.png')} style={styles.image}/>
                        <Text style={styles.textcontainer}>Scan Solutions</Text>
                        <TextInput 
                            value={this.state.username} 
                            onChangeText={this.handleUsernameUpdate} 
                            style={styles.inputContainer} 
                            placeholder="Nom d'utilisateur"
                            autoFocus={true}
                            ref={(input) => { this.firstTextInput = input }}
                            onSubmitEditing={() => { this.secondTextInput.focus() }}
                        />
                        <TextInput 
                            value={this.state.password} 
                            onChangeText={this.handlePasswordUpdate} 
                            style={styles.inputContainer} 
                            placeholder='Mot de passe' 
                            secureTextEntry={true}
                            autoCapitalize='none'
                            ref={(input) => { this.secondTextInput = input }}
                            onSubmitEditing={() => { this._login() }}
                        />
                        <TouchableOpacity
                            style={[styles.buttonContainer, {backgroundColor: !this.state.isFormValid ? '#bdbdbd': '#607d8b'}]} 
                            onPress={() => this._login()} 
                            disabled={!this.state.isFormValid}>
                            <Text style={{color:'white', fontSize:16}}>Se connecter</Text>
                        </TouchableOpacity> 
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    configuration:{
        alignItems:'center', 
        alignItems:'flex-start', 
        justifyContent:'flex-start', 
        margin:10 
    },
    submit:{
        alignItems:'center', 
        justifyContent:'center', 
        backgroundColor:'#2196F3', 
        margin:1, 
        width:60 
    },
    textSubmit:{
        color:'white', 
        padding:3, 
        fontSize: 14
    },
    iconSettings:{
        width:30, 
        height:30,
    },
    textAddressInput:{
        margin:1, 
        flex:1, 
        borderColor:'grey', 
        borderWidth:1
    },
    textcontainer:{
        fontWeight: "bold",
        fontSize: 24, 
        marginBottom:20, 
        color:"black",
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height:40,
        backgroundColor:'blue',
        borderRadius: 25,
        width:"40%",
    },
    inputContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'grey',
        backgroundColor:'white',
        borderRadius: 25,
        paddingLeft:25,
        borderWidth: 1,
        padding: 8,
        marginBottom: 15,
        width: "80%",
        height: 50,
    },
    image:{
        width: 70,
        height: 80,
        margin: 5,
        resizeMode: 'stretch',
    }
})

const mapStateToProps = (state) => {
    return {
        serverAddress: state.configReducer.serverAddress,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch: (action) => { dispatch(action) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)