import React, { Component } from 'react';
import {Container, Col, Row } from 'reactstrap';
import Export from './Export/Export';
import Sidebar from './Sidebar/Sidebar';
import Footer from './Footer/Footer';

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
