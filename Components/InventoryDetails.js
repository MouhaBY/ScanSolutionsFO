import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native'
import Detail from '../Models/Details'


const detail = new Detail()


export default class InventoryDetails extends React.Component {
    constructor(props){
        super(props)
        this.state={
            inventory_token: {},
            inventorylist: []
        }
        this.renderItem = this.renderItem.bind(this);
    }

    get_inventory_details = async (id_inv) => {
        this.setState({inventorylist:[]})
        try{
            const inventorylist = await detail.getDetailsInventaires(id_inv)
            this.setState({inventorylist})
        }catch(err){
            console.log('catch getting inventaires')
        }
    }

    componentDidMount(){
        const { navigation, route } = this.props;
        const inventory_token = route.params.inventory_token
        this.setState({inventory_token})
        this.get_inventory_details(inventory_token.id)
    }

    delete_Row(item_to_delete){
        Alert.alert('Supprimer', 'Êtes vous sur de supprimer cette ligne ?', 
        [   { text: 'Annuler' },
            { text: 'Confirmer', 
            onPress: () => {
                detail.deleteDetailInventaire(item_to_delete)
                this.get_inventory_details(this.state.inventory_token.id)
            }
            },
        ])
    }

    renderItem({item}){
        return(
        <TouchableOpacity 
        style={styles.table_row}
        onLongPress={() => { if (item.isSynced == null ){this.delete_Row(item.id)} }}>
            <Text style={[styles.table_row_txt, {width: "30%"}]}>{item.location}</Text>
            <Text style={[styles.table_row_txt, {width: "30%"}]}>{item.barcode}</Text>
            <Text style={[styles.table_row_txt, {width: "15%"}]}>{item.quantity}</Text>
            <Text style={[styles.table_row_txt, {width: "25%"}]}>{item.date}</Text>
        </TouchableOpacity>
        )
    }

    keyExtractor(item){
        return item.id
    }

    render(){
        return(
            <View style={styles.main_container} >
                <TouchableOpacity style={styles.top_container} onPress={() => this.props.navigation.goBack()}>
                    <Text style={styles.title_container}>{"Détails de l'inventaire : " + this.state.inventory_token.name}</Text>
                    <Text style={{color:'white'}}>{"Id de l'inventaire " + this.state.inventory_token.id + " | Date du "+ this.state.inventory_token.date}</Text>
                </TouchableOpacity>
                <View style={{alignItems: 'center', justifyContent: 'center', height:"80%"}}>
                    <View style={styles.table_header}>
                        <Text style={[styles.table_header_txt, {width: "30%"}]}>Emp.</Text>
                        <Text style={[styles.table_header_txt, {width: "30%"}]}>Code.</Text>
                        <Text style={[styles.table_header_txt, {width: "15%"}]}>Qté</Text>
                        <Text style={[styles.table_header_txt, {width: "25%"}]}>Date</Text>
                    </View>
                    <FlatList
                        data={this.state.inventorylist}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem}
                    >
                    </FlatList>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container:{
        flex:1,
        backgroundColor:'white',
        marginBottom:0
    },
    top_container:{
        backgroundColor:'#2196F3',
        justifyContent:'center',
        alignItems:'center',
        height:50
    },
    title_container:{
        fontWeight:'bold',
        color:'white',
        fontSize:20
    },
    table_header:{
        flexDirection:'row', 
        marginTop:3, 
        backgroundColor:'#71afe5'
    },
    table_header_txt:{
        fontWeight:'bold', 
        textAlign:"center", 
        padding:5, 
        color:'white', 
        fontSize:16, 
        height:40
    },
    table_row:{
        flexDirection: "row", 
        height: 40, 
        alignItems:"center",
        justifyContent:'center',
    },
    table_row_txt:{
        padding:5, 
        height:35,
        textAlign:"center",
        alignItems:"center",
        justifyContent:'center',
        fontSize:11, 
        backgroundColor:'#eff6fc',
    },    
})