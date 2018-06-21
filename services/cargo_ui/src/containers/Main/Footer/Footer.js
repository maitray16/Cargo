import React, { Component } from 'react';
import { AppFooter } from '@coreui/react';
import DefaultFooter from './DefaultFooter';


class Footer extends Component {
    render(){
        return(
            <AppFooter>
                <DefaultFooter />
            </AppFooter>
        );
    }
}

export default Footer;

