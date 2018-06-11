import React, { Component } from 'react';
import { AppFooter, AppSidebar, AppSidebarForm, AppSidebarHeader, AppSidebarNav, AppSwitch
} from '@coreui/react';
import axios from 'axios';
import navigation from '../../_nav';
import DefaultFooter from './DefaultFooter';

import {Card, CardBody, CardFooter, Badge, Button,
  Container, CardHeader, Col, Form, FormGroup, Label, Input, InputGroup,
  InputGroupText, InputGroupAddon, ButtonDropdown, DropdownMenu, DropdownToggle, DropdownItem, Row
} from 'reactstrap';

import Select from 'react-select';
import 'react-select/dist/react-select.css';
// import ReactTable from "react-table";

const cardHeaderColor = '#52616a';
const cardHeaderTextColor = '#fff';
const appSidebarColor = '#1e272e';
const cardHeaderStyle = {background: cardHeaderColor, color: cardHeaderTextColor};
const appSidebarStyle = {background: appSidebarColor};

class Dashboard extends Component {

  state = {
    indexList: [],
    fieldList: [],
    url: 'http://172.16.123.1:9200',
    indexValue: null,
    fieldValue: null,
    dropdownOpen: new Array(19).fill(false),
    isPrimaryKeyVisible: false,
    gte: '',
    lte: '',
    count: 0,
    first: false
  }

  constructor(props) {
    super(props);
    this._updateValue = this._updateValue.bind(this);
    this._handleFormInput = this._handleFormInput.bind(this);
    this._exportData = this._exportData.bind(this);
    this.toggle = this.toggle.bind(this);
    this._getIndexList();
  }


  _getIndexList(){
    let index = [];
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

  _getMappingList(index){
    // Gets mapping for only one index
    axios.post('http://192.168.99.100/cargo/mapping',{ 
      url:this.state.url,
      index: index
    })
    .then(res => {
      res.data.data.forEach(item => {
        this.setState({ 
          fieldList: this.state.fieldList.concat([item])
        })
      });
    })
    .catch(error => {
      console.log(error);
    }) 
  }

  _handleFormInput(e, formTag){
    if(formTag === 'gte'){
      this.setState({gte: e.target.value})
    }
    else if(formTag === 'lte'){
      this.setState({lte: e.target.value})
    }
    else if(formTag === 'count'){
      this.setState({count: e.target.value})
    }

  }


  _updateValue(newValue, flag) {
    if(flag === 'index'){
      this.setState({indexValue: newValue});
      if(newValue === ''){
        this.setState({fieldList: [], isPrimaryKeyVisible: false})
      }
      // else if(newValue.indexOf(',') > -1){
      //   // This condition is for checking if there are multiple indexes selected
      //   this.setState({isPrimaryKeyVisible: true});
      // }
      else{
        this.setState({fieldList: []})
        // This condition is for checking if there is a single index selected
        this.setState({isPrimaryKeyVisible: false});
        this._getMappingList(newValue);
      }
    }
    if(flag === 'mapping'){
      this.setState({fieldValue: newValue});
    }
  }

  _exportData(e, type){
    console.log(type);
    console.log(this.state.gte);
    console.log(this.state.lte);
    console.log(this.state.indexValue);
    console.log(this.state.fieldValue);


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
                        <Button size={'md'} color="primary">Index Names</Button>&nbsp;
                        <Button outline size={'md'} color="primary">Regex Names</Button>
                      </Col>
                      
                      <Col xs="12" md="9">
                      
                      <Select 
                          id="index-select"
                          ref={(ref) => { this.select = ref; }}
                          options={this.state.indexList}
                          simpleValue
                          clearable
                          name="select-index"
                          value={this.state.indexValue}
                          onChange={(e) => this._updateValue(e, 'index')}
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
                          <Input type="text" id="gte" name="gte" placeholder="now-15m" onChange={(e) => this._handleFormInput(e, 'gte')} />
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
                        <Input type="text" id="lte" name="lte" placeholder="now" onChange={(e) => this._handleFormInput(e, 'lte')} />
                          </InputGroup>
                      </Col>
                    </FormGroup>
                    
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="hf-password">Count</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="number" id="count" name="count" placeholder="Number of log samples" onChange={(e) => this._handleFormInput(e, 'count')} />
                      </Col>
                    </FormGroup>

                     <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="hf-email">Choose Fields</Label>
                      </Col>
                      <Col xs="12" md="9">
                      <Select 
                          id="mapping-select"
                          ref={(ref) => { this.select = ref; }}
                          options={this.state.fieldList}
                          simpleValue
                          clearable
                          multi
                          name="select-index"
                          value={this.state.fieldValue}
                          onChange={(e) => this._updateValue(e, 'mapping')}
                          searchable
                          labelKey="field"
                          valueKey="field"
                        /> 
                      </Col>
                    </FormGroup>

                     { this.state.isPrimaryKeyVisible ? <FormGroup row>
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
                    </FormGroup> : null }

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
                      <DropdownItem onClick={(e) => this._exportData(e, 'csv')}>Export CSV </DropdownItem>
                      <DropdownItem onClick={(e) => this._exportData(e, 'mongo')}>Export MongoDB</DropdownItem>
                      <DropdownItem onClick={(e) => this._exportData(e, 'sql')}>Export SQL</DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                
                </CardFooter>
              </Card>
            </Col>
          
          </Row>

          <Row>
            {/* Audit card */}
            <Col md="12">
              <Card>
                <CardHeader style={cardHeaderStyle}>
                  <i className="fa fa-tasks"></i><strong>Data </strong> History
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
      <AppFooter>
          <DefaultFooter />
        </AppFooter>
      </div>
    );
  }
}

export default Dashboard;
