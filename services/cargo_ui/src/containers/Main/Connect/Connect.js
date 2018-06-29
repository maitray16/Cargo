import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  InputGroup,
  Row
} from "reactstrap";

@inject("mainStore")
@observer
export default class Connect extends Component {
  constructor(props) {
    super(props);
    this._onChangeHandler = this._onChangeHandler.bind(this);
  }

  _onChangeHandler(e) {
    this.props.mainStore.setHost(e.target.value);
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row className="justify-content-center">
          <Col md="3">
            <Card
              className="text-white py-5 d-md-down-none"
              style={{ background: "#b2bec3" }}
            >
              <CardBody className="text-center">
                <div style={{ background: "#b2bec3" }}>
                  <Container fluid>
                    <h1 className="display-4">Cargo</h1>
                    <hr className="my-2" />
                    <p className="lead">Bulk data export tool</p>
                  </Container>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md="9">
            <Card className="p-4 py-5 d-md-down-none">
              <CardBody>
                <h4>Connect to Elastic Host</h4>
                <InputGroup className="mb-3">
                  <Input
                    value={this.props.mainStore.host}
                    onChange={e => this._onChangeHandler(e)}
                    name="url"
                    bsSize="lg"
                    type="text"
                    placeholder="Host URL"
                    autoComplete="url"
                  />
                </InputGroup>
                <Row>
                  <Col xs="12">
                    <Button
                      onClick={() => this.props.mainStore.connect()}
                      size="md"
                      color="primary"
                      className="px-3"
                    >
                      {this.props.mainStore.connection_state}
                    </Button>&nbsp;&nbsp;
                    <Button
                      onClick={() => this.props.mainStore.reset()}
                      size="md"
                      color="danger"
                      className="px-3"
                    >
                      Reset
                    </Button>
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
