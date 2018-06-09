import React, { Component } from 'react';
import {
  AppFooter,
  AppSidebar,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarNav,
  AppHeader,
  AppSwitch
} from '@coreui/react';
import axios from 'axios';
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
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Row
} from 'reactstrap';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import ReactJson from 'react-json-view'

const cardHeaderColor = '#444f59';
const cardHeaderTextColor = '#fff';
const appSidebarColor = '#1e272e';
const cardHeaderStyle = {background: cardHeaderColor, color: cardHeaderTextColor};
const appSidebarStyle = {background: appSidebarColor};

class Dashboard extends Component {

  state = {
    indexList: [],
    fields: [],
    url: 'http://172.16.123.1:9200',
    value: null,
    dropdownOpen: new Array(19).fill(false)
  }
  

  constructor(props) {
    super(props);
    let index = [];
    this._updateValue = this._updateValue.bind(this);
    this.toggle = this.toggle.bind(this);

    axios.post('http://192.168.99.100/cargo/indexlist',{ 
      url:this.state.url
    })
    .then(res => {
      index = res.data.data.map((item) => {
        return item;
      });
     
      this.setState({
        indexList: index
      });
    })
    .catch(error => {
      console.log(error);
    }) 
  }

  _updateValue(newValue) {
    let mapping = [];
    console.log(newValue);
		this.setState({
			value: newValue
    });
    // axios.post('http://192.168.99.100/cargo/mapping',{ 
    //   url:this.state.url,
    //   index: this.state.value
    // })
    // .then(res => {
    //   mapping = res.data.data.map((item) => {
    //     return item;
    //   });
     
    //   this.setState({
    //     fields: mapping
    //   });
    // })
    // .catch(error => {
    //   console.log(error);
    // }) 
  }
  
  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => { return (index === i ? !element : false); });
    this.setState({
      dropdownOpen: newArray,
    });
  }



  render() {
    return (
      <div className="app">
        {/* SideBar component */}
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
            {/* Download card */}
            <Col md="12">
              <Card>
                <CardHeader style={cardHeaderStyle}>
                <i className="fa fa-tasks"></i><strong>Download</strong> Information
                <div className="card-header-actions"> 
                    <span className="text-muted" >Data Obfuscation &nbsp;</span>
                    <AppSwitch className={'float-right mb-0'} variant={'pill'} label color={'success'} size={'sm'}/>
                </div>
                </CardHeader>
                <CardBody>
                  <Form action="" method="post" className="form-horizontal">
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="hf-email">Index Names</Label>
                      </Col>
                      <Col xs="12" md="9">
                      
                      <Select 
                          id="index-select"
                          ref={(ref) => { this.select = ref; }}
                          options={this.state.indexList}
                          simpleValue
                          clearable
                          multi
                          name="select-index"
                          value={this.state.value}
                          searchable
                          labelKey="name"
                          valueKey="name"
                        />
            
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="hf-password">GTE - @timestamp</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><i className="fa fa-clock-o"></i></InputGroupText>
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
                        <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><i className="fa fa-clock-o"></i></InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" id="hf-password" name="hf-password" placeholder="15m" autoComplete="current-password"/>
                          </InputGroup>
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
                        <Label htmlFor="hf-email">Choose Fields</Label>
                      </Col>
                      <Col xs="12" md="9">
                      
                      <Select 
                          id="index-select"
                          ref={(ref) => { this.select = ref; }}
                          options={this.state.fields}
                          simpleValue
                          clearable
                          multi
                          name="select-index"
                          value={this.state.value}
                          onChange={this._updateValue}
                          searchable
                          labelKey="field"
                          valueKey="field"
                        />
            
                      </Col>
                    </FormGroup>

                     <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="hf-email">Choose Primary Key</Label>
                      </Col>
                      <Col xs="12" md="9">
                      
                      <Select 
                          id="index-select"
                          ref={(ref) => { this.select = ref; }}
                          options={this.state.indexList}
                          simpleValue
                          clearable
                          name="select-index"
                          value={this.state.value}
                          onChange={this._updateValue}
                          searchable
                          labelKey="name"
                          valueKey="name"
                        />
            
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
                  <ButtonDropdown className="mr-1" isOpen={this.state.dropdownOpen[18]} toggle={() => { this.toggle(18); }}>
                    <DropdownToggle caret color="primary">
                        Export data
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem >Export CSV</DropdownItem>
                      <DropdownItem>Export MongoDB</DropdownItem>
                      <DropdownItem>Export SQL</DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                
                </CardFooter>
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
