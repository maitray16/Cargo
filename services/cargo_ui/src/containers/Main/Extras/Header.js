import React, { Component } from 'react';
import { AppHeader } from '@coreui/react';
import DefaultHeader from './DefaultHeader';


export default class Header extends Component {
    render(){
        return(
            <AppHeader>
                <DefaultHeader />
            </AppHeader>
        );
    }
}


