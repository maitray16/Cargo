import React, { Component } from 'react';
import axios from 'axios';
import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, Row } from 'reactstrap';
import logo from '../../assets/img/package.svg'
import { withRouter } from 'react-router-dom'

class Connect extends Component {
  state = {
    url: ''
  }

  handleChange = event => {
    this.setState({ url: event.target.value });
  }

  handleSubmit = event => {
    event.preventDefault();
    axios.post('http://192.168.99.100/connect',{ 
      url:this.state.url
    })
    .then(res => {
      console.log(res);
      console.log(res.data.status);
      this.props.history.push('/dashboard')
    })
    .catch(error => {
      console.log(error);
    })
  }


 componentDidMount(){}


  render() {
    return (
      <div className="app flex-row align-items-center align-self-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4 py-5 d-md-down-none">
                  <CardBody>
                    <h3><strong>Connect to Elastic Host</strong></h3>
                    <p></p>
                   
                    <InputGroup className="mb-3">
                      <Input onChange={this.handleChange} name="url" bsSize="lg" type="text" placeholder="Host URL" />
                    </InputGroup>
                    <Row>
                      <Col xs="12">
                        <Button onClick={this.handleSubmit} size="md" color="primary" className="px-4">Connect</Button>
      
                        {/*<Alert color="danger">
                            This is a danger alert — check it out!
                        </Alert> */}
                      </Col>
                    </Row>

                  </CardBody>
                </Card>

                <Card className="text-white py-5 d-md-down-none" style={{ width: 40 + '%', background:'#273c75' }}>
                  <CardBody className="text-center">
                    <div>
                      <img src={logo} height="70" width="70" alt="Logo"></img>
                      <p></p>
                      <h2><strong>Cargo</strong></h2>
                      <p>A simple elasticsearch CSV export tool with a few tricks.</p>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Connect;
