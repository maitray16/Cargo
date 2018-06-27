import React, { Component } from 'react';
import DefaultHeader from './DefaultHeader';
import {AppHeader, AppSidebar, AppSidebarForm, AppSidebarHeader, AppSidebarNav } from '@coreui/react';
import navigation from '../../../utils/_nav';

const appSidebarColor = '#1e272e';
const appSidebarStyle = {background: appSidebarColor};

export default class Sidebar extends Component {
    render(){
        return(
            <AppSidebar style={appSidebarStyle} fixed minimized display="lg">
                <AppSidebarHeader />
                <AppSidebarForm />
                <AppSidebarNav navConfig={navigation} {...this.props} />
            </AppSidebar>
        );
    }
}
