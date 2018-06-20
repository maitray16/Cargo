import React, { Component } from 'react';
import { AppSwitch } from '@coreui/react';
import {Card, CardBody, CardFooter, Container, CardHeader, Col, Row } from 'reactstrap';

import Export from './Export/Export';
import Sidebar from './Sidebar/Sidebar';
import Footer from './Footer/Footer';

const cardHeaderColor = '#52616a';
const cardHeaderTextColor = '#fff';
const cardHeaderStyle = {background: cardHeaderColor, color: cardHeaderTextColor};

class Dashboard extends Component {

  render(){
    return (
    
      <div className="app">
        <div className="app-body">
          <Sidebar />
          <main className="main">
            <Container fluid style={{marginTop: '2%' }}>
            <div className="animated fadeIn">
              
              <Row>
                <Col md="12">
                {/* Export Component */}
                <Export /> 
                </Col>
              </Row>

              <Row>
              {/* Audit card */}
                <Col md="12">
                  <Card>
                    <CardHeader style={cardHeaderStyle}>
                      <i className="icon-grid"></i><strong>Data </strong> History
                    </CardHeader>
                    <CardBody>
                  
                    </CardBody>
                  </Card>
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

export default Dashboard;
