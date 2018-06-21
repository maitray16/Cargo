import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Card, CardBody, Col, Container, Input, InputGroup, Row } from 'reactstrap';
import logo from '../../../assets/img/package.svg';

@inject('mainStore')
@observer
export default class Connect extends Component{

    constructor(props) {
        super(props);
        this._onChangeHandler = this._onChangeHandler.bind(this);
      }

    _onChangeHandler(e) {
        this.props.mainStore.setHost(e.target.value);
    };

    render(){
    return (
        <div className="animated fadeIn">
        <Row className="justify-content-center">
            <Col md="4">
                <Card className="text-white py-5 d-md-down-none" style={{ background:'#52616a' }}>
                <CardBody className="text-center">
                    <div style={{background:'#52616a' }}>
                        <Container fluid>
                        <img src={logo} style={{color: '#FFA000'}} height="60" width="60" alt="Logo"></img>
                        <h5 className="display-4">Cargo</h5>
                        </Container>
                    </div>
                </CardBody>
                </Card>
            </Col>
            <Col md="8">
                <Card className="p-4 py-5 d-md-down-none">
                  <CardBody>
                    <h3>Connect to Elastic Host</h3>
                    <InputGroup className="mb-3">
                      <Input onChange={(e) => this._onChangeHandler(e)} name="url" bsSize="lg" type="text" placeholder="Host URL" />
                    </InputGroup>
                    <Row>
                        <Col xs="12">
                        <Button onClick={() => this.props.mainStore.connect()} size="md" color="primary" className="px-4">{this.props.mainStore.connection_state}</Button>&nbsp;&nbsp;
                        <Button onClick={() => this.props.mainStore.reset()} size="md" color="danger" className="px-4">Reset</Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
            </Col>
          </Row> 
        </div>
    );
    }
}

