import React from 'react'
import {View, Text, StyleSheet, Button, Image, Alert, TextInput, FlatList, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'
import Invetory from '../Models/Inventories'


const inventory = new Invetory()

class Inventories extends React.Component 
{
    constructor(props){
        super(props)
        this.state = {
            inventaires : [],
            toAdd: false,
            inventaire_to_add:'',
            isFormValid:false,
        }
    }

    getInventoriesList = async () => {
        const inventaires = await inventory.getInventaires()
        this.setState({inventaires})
    }

    componentDidMount(){
        this.getInventoriesList()
    }

    accessInventory = (item) => {
        this.props.navigation.navigate("Inventorier", {inventory_token:item})
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.inventaire_to_add !== prevState.inventaire_to_add){
            this.validateForm()
        }
    }

    validateForm = () => {
        if (this.state.inventaire_to_add !== '') {
            this.setState({isFormValid: true})
        }
        else{ this.setState({isFormValid: false}) }
    }

    _reset_form_values(){
        this.setState({inventaire_to_add: ''})
        this.setState({inventaires:[]})
    }

    submit_inventaire = async () => {
        let today = new Date()
        let completeDate = today.getDate()+"/"+parseInt(today.getMonth()+1)+"/"+today.getFullYear()
        this.setState({ toAdd: !this.state.toAdd })
        await inventory.insertInventaire({ name: this.state.inventaire_to_add, date: completeDate, state:1 })
        this._reset_form_values()
        this.componentDidMount()
    }

    handleInventaireUpdate = inventaire_to_add => {
        this.setState({inventaire_to_add})
    }
    
    render(){
        return(
            <View style={styles.mainContainer}>
                <Text style={styles.textContainer}>Choix d'inventaire à traiter</Text>
                {this.props.user_token.isAdmin == 1 &&
                <View>
                    <TouchableOpacity onPress = {() => this.setState({ toAdd: !this.state.toAdd })}  style={styles.addButton}>
                        <Text style={{color:'white', height: 30, padding:3}}>Ajouter inventaire</Text>
                    </TouchableOpacity>
                    {this.state.toAdd &&
                    <View style={{flexDirection:'row'}}>
                        <TextInput 
                        style={{margin:1, flex:1}} 
                        autoFocus={true}
                        placeholder="Nouveau inventaire"
                        value={this.state.inventaire_to_add} 
                        onChangeText={this.handleInventaireUpdate} />
                        <Button 
                        title='Add'
                        disabled={!this.state.isFormValid}
                        onPress={() => { this.submit_inventaire() }}/>
                    </View>
                    }
                </View>
                }
                <FlatList 
                    style= {styles.mainList}
                    data={this.state.inventaires}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                    <TouchableOpacity
                    onPress = {() => this.accessInventory(item)} 
                    style={styles.mainInventory}>
                        <Text style={{fontWeight:'bold', color:'white'}}>{item.name + " "}</Text>
                        <Text style={{color:'white'}}>{"Date " + item.date}</Text>
                    </TouchableOpacity>
                )}>
                </FlatList>
            </View>
        )
    }
}

const styles = StyleSheet.create(
    {
        mainContainer:{
            flex:1,
        },
        textContainer:{
            justifyContent:'center',
            alignItems:'center',
            fontWeight:'bold',
            fontSize:20,
            margin:15,
            padding:5
        },
        mainList:{
            flex:1,
        },
        mainInventory:{
            height: 65,
            padding:10,
            borderColor:'white',
            borderWidth: 1,
            borderRadius: 5,
            margin: 1,
            backgroundColor: "#455a64"
        },
        addButton:{
            backgroundColor:'grey', 
            margin:1, 
            alignItems:'center',
            justifyContent:'center'
        }
    }
)

const mapStateToProps = (state) => {
    return {
        user_token: state.authReducer.user_token,
    }
  }

export default connect(mapStateToProps)(Inventories)