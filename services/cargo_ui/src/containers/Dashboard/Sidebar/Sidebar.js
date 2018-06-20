import React, { Component } from 'react';
import {AppSidebar, AppSidebarForm, AppSidebarHeader, AppSidebarNav } from '@coreui/react';
import navigation from '../../../_nav';

const appSidebarColor = '#1e272e';
const appSidebarStyle = {background: appSidebarColor};

class Sidebar extends Component {
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

export default Sidebar;