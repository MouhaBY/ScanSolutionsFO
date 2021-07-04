import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import { connect } from 'react-redux'


class BottomBar extends React.Component
{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <View style={styles.main_container}>
                <Text style={[styles.text_container,{fontWeight:'bold'}]}>{ this.props.user_token.isAdmin == '1' ? 'Administrateur connecté :' : 'Opérateur connecté :' }</Text>
                <Text style={styles.text_container}>{ this.props.user_token.contact }</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
        main_container:{
            backgroundColor:'#0078d4',
            height:30,
            justifyContent:'flex-start',
            alignItems:'center',
            flexDirection:'row'
        },
        text_container:{
            color:'white',
            fontSize:14,
            justifyContent:'center',
            marginLeft:5,
        }
    })

const mapStateToProps = state => {
    return {
      user_token: state.authReducer.user_token
    }
}

export default connect(mapStateToProps)(BottomBar)