import React, { Component } from 'react';
import {Container, Col, Row } from 'reactstrap';
import Connect from './Connect/Connect';
import Export from './Export/Export';
import Sidebar from './Sidebar/Sidebar';
import Footer from './Footer/Footer';
import NotificationSystem from 'react-notification-system';
import { autorun } from "mobx";
import { inject, observer } from "mobx-react";

@inject("commonStore")
@observer
class Main extends Component {

  mobxHook = autorun(() => {
    if (this.props.commonStore.snackMessage.message !== null) {
      this.refs.notificationSystem.addNotification(
        this.props.commonStore.snackMessage
      );
      this.props.commonStore.setSnackMessage();
    }
  });
  
  render(){
    return (
      <div className="app">
        <div className="app-body">
          
         <Sidebar />
          
          <main className="main">
            <Container fluid style={{marginTop: '2%' }}>
            <div className="animated fadeIn">
              <NotificationSystem ref="notificationSystem" />

              <Row>
                <Col>
                  <Connect />
                </Col>
              </Row>

              <Row>
              </Row>

              <Row>
                <Col md="12">
                  <Export /> 
                </Col>
              </Row>
   
              </div>
              </Container>
            </main>
          </div>
        <Footer />
        </div>
    );
  }
}

export default Main;
