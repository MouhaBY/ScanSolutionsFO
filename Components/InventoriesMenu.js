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
    
    render(){
        return(
            <View style={styles.mainContainer}>
                <Text style={styles.textContainer}>Choix d'inventaire à traiter</Text>
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