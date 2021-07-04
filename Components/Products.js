import React from 'react'
import { Text, View, StyleSheet, FlatList } from 'react-native'
import Product from '../Models/Products'


const product = new Product()


export default class Products extends React.Component {
    constructor(props){
        super(props)
        this.state={
            Productslist:[]
        }
    }

    get_Products = async () => {
        let Productslist = await product.getProducts()
        try{
            this.setState({Productslist})
        }
        catch(err){ 
            console.log('catch') 
        }
    }

    componentDidMount(){
        this.get_Products()
    }

    _renderItem({item}){
        return(
        <View 
        style={styles.table_row}>
            <Text style={[styles.table_row_txt, {width: "50%"}]}>{item.code}</Text>
            <Text style={[styles.table_row_txt, {width: "50%"}]}>{item.name}</Text>
        </View>
        )
    }

    keyExtractor(item){
        return item.id
    }

    render(){
        return(
            <View style={styles.main_container} >
                <View style={{alignItems: 'center', justifyContent: 'center', height:"95%"}}>
                    <View style={styles.table_header}>
                        <Text style={[styles.table_header_txt, {width: "50%"}]}>Code</Text>
                        <Text style={[styles.table_header_txt, {width: "50%"}]}>Name</Text>
                    </View>
                    <FlatList
                        data={this.state.Productslist}
                        keyExtractor={this.keyExtractor}
                        renderItem={this._renderItem}
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
        height:38,
        textAlign:"center",
        fontSize:14, 
        backgroundColor:'#eff6fc',
    },    
})