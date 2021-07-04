import React from 'react'
import {View, Text, StyleSheet, Button, Image, Alert, TextInput, FlatList} from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import Configuration from '../Models/Configurations'


const configuration = new Configuration()

export default class ConfigurationForm extends React.Component 
{
    constructor(props){
        super(props)
        this.state = {
            withLocationVerification: false,
            withBarcodeVerification: false,
            withoutQuantity: false,
        }
    }

    cast_to_bool(data_state){ if (data_state > 0) { return true } else { return false } }

    cast_from_bool(bool_state){ if (bool_state == true){ return 1 } else { return 0} }

    readConfiguration = async () => {
        let withLocationVerificationState = await configuration.getConfiguration("CheckAreaInventory")
        let withLocationVerification = this.cast_to_bool(withLocationVerificationState)
        this.setState({withLocationVerification})

        let withBarcodeVerificationState = await configuration.getConfiguration("CheckProductInventory")
        let withBarcodeVerification = this.cast_to_bool(withBarcodeVerificationState)
        this.setState({withBarcodeVerification})

        let withQuantityState = await configuration.getConfiguration("UnitaryInventory")
        let withoutQuantity = this.cast_to_bool(withQuantityState)
        this.setState({withoutQuantity})
    }

    componentDidMount(){
        this.readConfiguration()
    }

    submitConfig = async () => {
        await configuration.updateConfiguration([this.cast_from_bool(this.state.withBarcodeVerification),"CheckProductInventory"])
        await configuration.updateConfiguration([this.cast_from_bool(this.state.withLocationVerification),"CheckAreaInventory"])
        await configuration.updateConfiguration([this.cast_from_bool(this.state.withoutQuantity),"UnitaryInventory"])
        this.props.navigation.goBack()
    }

    render(){
        return(
            <View style={{flex:1}}>
                <View style={styles.mainContainer}>
                    <Text style={styles.textContainer}>Configuration de base</Text>
                    <View style={styles.checkbox_container}>
                        <CheckBox style={{margin:5}} value={this.state.withLocationVerification} onValueChange={(withLocationVerification) => this.setState({ withLocationVerification })} />
                        <Text>{this.state.withLocationVerification ? "Vérification d'emplacement " : "Sans vérification d'emplacement "}</Text>
                    </View>
                    <View style={styles.checkbox_container}>
                        <CheckBox style={{margin:5}} value={this.state.withBarcodeVerification} onValueChange={(withBarcodeVerification) => this.setState({ withBarcodeVerification })} />
                        <Text>{this.state.withBarcodeVerification ? "Vérification d'articles " : "Sans vérification d'articles "}</Text>
                    </View>
                    <View style={styles.checkbox_container}>
                        <CheckBox style={{margin:5}} value={this.state.withoutQuantity} onValueChange={(withoutQuantity) => this.setState({ withoutQuantity })} />
                        <Text>{this.state.withoutQuantity ? "Inventaire unitaire" : "Inventaire quantitatif"}</Text>
                    </View>
                </View>
                <Button title='Valider la configuration' onPress={()=>{this.submitConfig()}}/>
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
            textAlign:'center',
            fontWeight:'bold',
            fontSize:20,
            margin:20,
        },
        checkbox_container:{
            height:20,
            flexDirection:'row',
            alignItems:'center', 
            justifyContent:'flex-end', 
            margin:10
        },
    }
)