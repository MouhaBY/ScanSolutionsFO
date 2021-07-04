import React from 'react'
import { Text, View, StyleSheet, TextInput, Button, TouchableOpacity, ScrollView } from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import { connect } from 'react-redux'
import Configuration from '../Models/Configurations'
import RNBeep from 'react-native-a-beep'
import Detail from '../Models/Details'
import Product from '../Models/Products'
import Area from '../Models/Areas'


const configuration = new Configuration()
const detail = new Detail()
const area = new Area()
const product = new Product()


class InventorierForm extends React.Component
{
    constructor(props){
        super(props)
        this.state = {
            location: '',
            locationName:'',
            barcode: '',
            barcodeName:'',
            quantity: '1',
            inventory_token: '',
            isFormValid: false,
            inventoryRows: [],
            message_barcode: '',
            message_location: '',
            message:'',
            withoutQuantity: false,
            withLocationVerification : true,
            withBarcodeVerification : true
        }
    }

    submitConfiguration = async () => {
        await configuration.updateConfiguration([this.cast_from_bool(this.state.withoutQuantity),"UnitaryInventory"])
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.withoutQuantity !== prevState.withoutQuantity){
            this.submitConfiguration()
        }
        if (this.state.location !== prevState.location || this.state.barcode !== prevState.barcode || this.state.quantity !== prevState.quantity){
            if(this.state.location !== '' && this.state.barcode !== '') {
                this.setState({message: ''})
                this.setState({message_location: ''})
                this.setState({message_barcode: ''})
            }
            this.validateForm()
        }
        if (this.state.location !== prevState.location){
            this.setState({locationName: ''})
        }
        if (this.state.barcode !== prevState.barcode){
            this.setState({barcodeName: ''})
        }
    }


    validateForm = () => {
        if (this.state.location !== "" && this.state.barcode !== "" && this.state.quantity > 0) { 
            this.setState({isFormValid: true}) }
        else { this.setState({isFormValid: false}) }
    }

    cast_from_bool(bool_state){ if (bool_state == true){ return 1 } else { return 0} }
    cast_to_bool(data_state){ if (data_state > 0) { return true } else { return false } }

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
        const inventory_token = this.props.route.params.inventory_token
        this.setState({inventory_token})
        this.readConfiguration()
    }

    verify_to_submit = async (inventory_row) => {
        try{
            if (this.state.withLocationVerification){
                await area.searchArea(inventory_row.Location)
            }
            if (this.state.withBarcodeVerification){
                await product.searchProduct(inventory_row.Barcode)
            }
            this.submit(inventory_row)
        }
        catch(err){
            RNBeep.beep(false)
            if (err == 'Product unknown' ){
                this.setState({message_barcode: 'Article ' + inventory_row.Barcode +  ' non reconnu'})
                this.setState({barcode: ''})
            }
            if (err == 'Area unknown' ){
                this.setState({message_location: 'Emplacement ' + inventory_row.Location + ' non reconnu'})
            }
        }
    }

    getLocationDescription = async (code) => {
        return new Promise(async (resolve, reject) => { 
            try{
                if (this.state.withLocationVerification){
                    const locationObj = await area.searchArea(code)
                    this.setState({locationName: locationObj.name})
                }
                resolve(true)
            }
            catch(error){
                this.setState({message_location: 'Emplacement ' + code + ' non reconnu'})
                reject(false)
            }
        
        })
    }

    getBarcodeDescription = async (code) => {
        return new Promise(async (resolve, reject) => { 
            try{
                if (this.state.withBarcodeVerification){
                    const barcodeObj = await product.searchProduct(code)
                    this.setState({barcodeName: barcodeObj.name})
                }
                resolve(true)
            }
            catch(error){
                this.setState({message_barcode: 'Article ' + code +  ' non reconnu'})
                reject(false)
            }
        })
    }

    submit = async (inventory_row) => {
        let now = new Date()
        let dateNow = now.getDate()+"/"+parseInt(now.getMonth()+1)+"/"+now.getFullYear()+" "+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()+":"+now.getUTCMilliseconds()
        await detail.addDetailInventaire({ 
            inventory_id: this.state.inventory_token.id, 
            location: inventory_row.Location, 
            barcode: inventory_row.Barcode, 
            quantity: Number(inventory_row.Quantity), 
            user_id: this.props.user_token.id,
            date: dateNow })
        this.setState({message: 'Article ' + inventory_row.Barcode +' Enregistré'})
        this.reset_form_values()
        RNBeep.beep()
    }

    reset_form_values(){
        this.setState({barcode: ''})
        this.setState({quantity: '1'})
    }

    accessInventoryDetails = (item) => { this.props.navigation.navigate("Détails", {inventory_token:item}) }

    render(){        
        return(
            <View style={{flex:1,}}>
                <TouchableOpacity style={styles.top_container} onPress = {() => this.accessInventoryDetails(this.state.inventory_token)} >
                    <Text style={styles.title_container}>{"Inventaire en cours : " + this.state.inventory_token.name}</Text>
                    <Text style={{color:'white'}}>{"Id de l'inventaire " + this.state.inventory_token.id + " | Date du "+ this.state.inventory_token.date}</Text>
                </TouchableOpacity>
                {this.props.user_token.isAdmin == 1 &&
                <View style={styles.checkbox_container}>
                    <Text>{this.state.withoutQuantity ? "Inventaire unitaire": "Inventaire quantitatif"}</Text>
                    <CheckBox style={{margin:5}} value={this.state.withoutQuantity} onValueChange={(withoutQuantity) => this.setState({ withoutQuantity })} />
                </View>
                }
                <View style={styles.main_container}>
                        <Text style={styles.text_container}>Code emplacement</Text>
                        <TextInput
                        ref={(input) => { this.firstTextInput = input }}
                        value={this.state.location} 
                        onChangeText={(location) => this.setState({ location })} 
                        style={styles.input_container} 
                        autoFocus={true}
                        onFocus={() => this.setState({location: ''})}
                        placeholder= "Emplacement"
                        //blurOnSubmit={false}
                        onSubmitEditing={() => { this.getLocationDescription(this.state.location).then(()=>{ this.secondTextInput.focus() }).catch(()=>{ this.firstTextInput.focus() }) }}/>
                        {this.state.withLocationVerification &&
                        <Text style={styles.description}>{this.state.locationName}</Text>}
                        <Text style={styles.error_message}>{this.state.message_location}</Text>
                        <Text style={styles.text_container}>Code article</Text>
                        <TextInput
                        value={this.state.barcode} 
                        ref={(input) => { this.secondTextInput = input }}
                        onChangeText={(barcode) => this.setState({ barcode })} 
                        style={styles.input_container} 
                        onFocus={() => this.setState({barcode: ''})}
                        blurOnSubmit={false}
                        placeholder= "Code à barre"
                        onSubmitEditing={() => { this.getBarcodeDescription(this.state.barcode).then(()=>{
                            if (!this.state.withoutQuantity){ this.thirdTextInput.focus() }
                            else { if (this.state.isFormValid) {
                                this.verify_to_submit({Location:this.state.location, Barcode: this.state.barcode, Quantity: this.state.quantity})} } 
                            }).catch(()=>{ this.setState({barcode:''}); this.secondTextInput.focus() })}}
                        />
                        {this.state.withBarcodeVerification &&
                        <Text style={styles.description}>{this.state.barcodeName}</Text>}
                        <Text style={styles.error_message}>{this.state.message_barcode}</Text>
                        <Text style={{color:'green', margin:1}}>{this.state.message}</Text>
                        {!this.state.withoutQuantity &&
                        <View style={{width:100, alignItems:'center', marginBottom:5, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                            <Text style={styles.text_container}>Quantité</Text>
                            <TextInput
                                value={this.state.quantity} 
                                keyboardType="numeric"
                                ref={(input) => { this.thirdTextInput = input }}
                                onChangeText={(quantity) => this.setState({ quantity })} 
                                style={styles.input_container} 
                                placeholder= "Quantité"
                                blurOnSubmit={false}
                                onSubmitEditing={() => {
                                    if (this.state.isFormValid) {
                                        this.verify_to_submit({Location:this.state.location, Barcode: this.state.barcode, Quantity: this.state.quantity})
                                        this.secondTextInput.focus()
                                    }
                                }}
                            />
                        </View>
                        }
                        <Button 
                        title='                                   submit                                   '
                        disabled={!this.state.isFormValid}
                        onPress={() => {
                            this.verify_to_submit({Location:this.state.location, Barcode: this.state.barcode, Quantity: this.state.quantity})
                            this.secondTextInput.focus()
                        }
                                }
                        autoFocus={true}/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    top_container:{
        backgroundColor:'#607d8b', 
        justifyContent:'center', 
        alignItems:'center', 
        height:50
    },
    checkbox_container:{
        height:20,
        flexDirection:'row',
        alignItems:'center', 
        justifyContent:'flex-end', 
        margin:5
    },
    main_container:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:0,
    },
    input_container:{
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'black',
        backgroundColor:'white',
        borderRadius: 5,
        borderWidth: 1,
        padding: 2,
        paddingLeft:5,
        marginBottom: 3,
        width: "80%",
        height: 35,
    },
    description:{ 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderColor: 'grey', 
        backgroundColor:'lightgrey', 
        borderRadius: 5, 
        borderWidth: 1, 
        paddingLeft:5,
        padding: 2, 
        width: "80%", 
        height: 30,
    },
    title_container:{
        fontWeight:'bold',
        color:'white',
        fontSize:16
    },
    text_container:{
        marginRight:10,
        fontWeight:'bold',
    },
    error_message:{
        color:'red', 
        marginBottom:1
    }
})

const mapStateToProps = (state) => {
    return {
        user_token: state.authReducer.user_token,
    }
  }

export default connect(mapStateToProps)(InventorierForm)