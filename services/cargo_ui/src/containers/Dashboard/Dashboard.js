import React, { Component } from 'react';
import {
  AppFooter,
  AppSidebar,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarNav,
} from '@coreui/react';

import navigation from '../../_nav';
import DefaultFooter from './DefaultFooter';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Container,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Row,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from 'reactstrap';

const cardHeaderColor = '#273c75';
const cardHeaderTextColor = '#fff';
const appSidebarColor = '#2f3640';

const cardHeaderStyle = {background: cardHeaderColor, color: cardHeaderTextColor};
const appSidebarStyle = {background: appSidebarColor};

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="app">
       
        <div className="app-body">
          <AppSidebar style={appSidebarStyle} fixed minimized display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <AppSidebarNav navConfig={navigation} {...this.props} />
          </AppSidebar>
          <main className="main">
            <Container fluid style={{marginTop: '2%' }}>

      <div className="animated fadeIn">

          <Row>
          <Col md="8">
            <Card>
              <CardHeader style={cardHeaderStyle}>
              <i className="fa fa-tasks"></i><strong>CSV</strong> Download Information
              </CardHeader>
              <CardBody>
                <Form action="" method="post" className="form-horizontal">
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="hf-email">Index Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="hf-email" name="hf-email" placeholder="Enter Index Name" autoComplete="email" required/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="hf-password">GTE - @timestamp</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <InputGroup className="input-prepend">
                          <InputGroupAddon addonType="prepend">
                              <InputGroupText>now-</InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" id="hf-password" name="hf-password" placeholder="15m" autoComplete="current-password"/>
                        </InputGroup>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="hf-password">LTE - @timestamp</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="hf-password" name="hf-password" placeholder="now" autoComplete="current-password"/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="hf-password">Count</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="number" id="hf-password" name="hf-password" placeholder="Number of log samples" />
                    </Col>
                  </FormGroup>
                 
                  <FormGroup row>
                    <Col md="3">
                      <Label>Train-Test Split</Label>
                    </Col>
                    <Col md="9">
                      <FormGroup check inline>
                        <Input className="form-check-input" type="radio" id="inline-radio1" name="inline-radios" value="option1" />
                        <Label className="form-check-label" check htmlFor="inline-radio1">80/20</Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Input className="form-check-input" type="radio" id="inline-radio2" name="inline-radios" value="option2" />
                        <Label className="form-check-label" check htmlFor="inline-radio2">70/30</Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Input className="form-check-input" type="radio" id="inline-radio3" name="inline-radios" value="option3" />
                        <Label className="form-check-label" check htmlFor="inline-radio3">60/40</Label>
                      </FormGroup>
                    </Col>
                  </FormGroup>

                </Form>
              </CardBody>
              <CardFooter>
                <Button type="reset" size="md" color="success"><i className="fa fa-download"></i> Download</Button>
              </CardFooter>
            </Card>
          </Col>

          <Col md="4">
            <Card>
              <CardHeader style={cardHeaderStyle}>
                <i className="fa fa-file-o"></i><strong>Elastic</strong> Information
              </CardHeader>
              <CardBody>
                <ListGroup>
                  <ListGroupItem action>
                    <ListGroupItemHeading>Elastic Version</ListGroupItemHeading>
                    <ListGroupItemText>
                      5.4.1
                    </ListGroupItemText>
                  </ListGroupItem>
                  <ListGroupItem action>
                    <ListGroupItemHeading>List group item heading</ListGroupItemHeading>
                    <ListGroupItemText>
                      Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.
                    </ListGroupItemText>
                  </ListGroupItem>
                </ListGroup>
                
              </CardBody>
            </Card>
          </Col>
        
        </Row>
  
      </div>
      </Container>
      </main>
      
      </div>
      <AppFooter>
          <DefaultFooter />
        </AppFooter>
      </div>
    );
  }
}

export default Dashboard;
