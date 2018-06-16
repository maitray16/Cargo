import React, { Component } from 'react';
import { AppFooter, AppSidebar, AppSidebarForm, AppSidebarHeader, AppSidebarNav, 
  AppSwitch } from '@coreui/react';
import axios from 'axios';
import AceEditor from 'react-ace';
import navigation from '../../_nav';
import DefaultFooter from './DefaultFooter';
import FileDownload from 'react-file-download';
import ReactLoading from 'react-loading';
import 'loaders.css/src/animations/line-scale.scss';

import {Card, CardBody, CardFooter, Button, Container, CardHeader, Col, Form, FormGroup, Label, Input, InputGroup,
  InputGroupText, InputGroupAddon, ButtonDropdown, DropdownMenu, DropdownToggle, DropdownItem, Row } from 'reactstrap';

import Select from 'react-select';
import 'react-select/dist/react-select.css';
import 'brace/mode/json';
import 'brace/theme/monokai';

// import ReactTable from "react-table";

const cardHeaderColor = '#52616a';
const cardHeaderTextColor = '#fff';
const appSidebarColor = '#1e272e';
const cardHeaderStyle = {background: cardHeaderColor, color: cardHeaderTextColor};
const appSidebarStyle = {background: appSidebarColor};

class Dashboard extends Component {

  state = {
    dropdownOpen: new Array(19).fill(false),
    host: 'http://172.16.123.1:9200',
    indexList: [],
    fieldList: [],
    indexValue: null,
    fieldValue: null,
    gte: '',
    lte: '',
    editorString: '{\n\t "query": {\n\t\t"match_all": {} \n\t}\n}',
    isTimeRangeVisible: false,
    hideData: false,
    countText: 'Check doc count',
    loading: false,
    hideDataButton: <Button outline color="secondary" onClick={(e) => this._onClickHandler(e, 'data_obfs_button')}>Enable Data Obfuscation</Button>
  }

  constructor(props) {
    super(props);
    this._getIndexList();
    this.toggle = this.toggle.bind(this);
    this._onChangeHandler = this._onChangeHandler.bind(this);
    this._onClickHandler = this._onClickHandler.bind(this);
  }


  _getIndexList(){
    let index = [];
    axios.post('http://192.168.99.100/cargo/index',{ 
      host:this.state.host
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

  _generateID(){
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 4; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  _getMappingList(index){
    // Gets mapping for only one index
    axios.post('http://192.168.99.100/cargo/mapping',{ 
      host:this.state.host,
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

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => { return (index === i ? !element : false); });
    this.setState({
      dropdownOpen: newArray,
    });
  }

  _onClickHandler(e, tag){
    switch(tag){
      case 'app-switch':
        if(this.state.isTimeRangeVisible)
          this.setState({isTimeRangeVisible: false})
        else
          this.setState({isTimeRangeVisible: true})
        break;
      
      case 'doc_count':
        this.setState({countText: 'Crunching some numbers..'})
        axios.post('http://192.168.99.100/cargo/doc_count',{ 
          host: this.state.host,
          index: this.state.indexValue
          }).then(res => {
            this.setState({
            countText: 'Doc Count - ' + res.data.data
              })
            }).catch(error => {
            console.log(error);
          }) 
        break;

      case 'data_obfs_button':
        if(!this.state.hideData){
          this.setState({hideData: true, hideDataButton: <Button color="danger" onClick={(e) => this._onClickHandler(e, 'data_obfs_button')}>Data Obfuscation Enabled</Button>})
        } else{
          this.setState({hideData: false, hideDataButton: <Button outline color="secondary" onClick={(e) => this._onClickHandler(e, 'data_obfs_button')}>Enable Data Obfuscation</Button>})
        }
        break;

      case 'csv':
      case 'mongo':
      case 'sql':
        this.setState({loading: true})
        axios.post('http://192.168.99.100/cargo/export',{ 
          host: this.state.host,
          index: this.state.indexValue.split(','),
          fields: this.state.fieldValue.split(','),
          query: this.state.editorString,
          type: tag
          }).then(res => {
            this.setState({loading: false})
            FileDownload(res.data, this.state.indexValue + "-" + this._generateID() + ".csv");
          }).catch(error => {
            console.log(error);
          })
        break;
      
      default:
          break;
    }
  }

  _onChangeHandler(e, tag){
    switch(tag){
      case 'gte':
        this.setState({gte: e.target.value})
        break;
      case 'lte':
        this.setState({lte: e.target.value})
        break;
      case 'index-select':
        this.setState({indexValue: e});
          if(e === ''){
            this.setState({fieldList: []})
          }
          else{
          this.setState({fieldList: []})
          this._getMappingList(e);
          }
        break;
      case 'mapping-select':
        this.setState({fieldValue: e});
        break;
      case 'editor-value':
        this.setState({editorString: e});
        break;
      
      default:
        break;
    }
  }

  render(){
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
                  <span className="text-muted"><strong>Custom Query </strong>&nbsp;</span>
                  <AppSwitch onClick={(e) => this._onClickHandler(e, 'app-switch')}className={'float-right mb-0'} variant={'pill'} label color={'success'} size={'sm'} checked/>
                </div>
                </CardHeader>
                <CardBody>
                  <Form action="" method="post" className="form-horizontal">
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="indexnames">Index Names</Label>
                      </Col>
                      
                      <Col xs="12" md="9"  style={{position: 'relative' , zIndex: 999}}>
                      
                      <Select
                          id="index-select"
                          ref={(ref) => { this.select = ref; }}
                          options={this.state.indexList}
                          simpleValue
                          clearable
                          name="select-index"
                          value={this.state.indexValue}
                          onChange={(e) => this._onChangeHandler(e, 'index-select')}
                          searchable
                          labelKey="index"
                          valueKey="index"
                        />
                    
                      </Col>
                    </FormGroup>
                    
                     <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="hf-email">Choose Fields</Label>
                      </Col>
                      <Col xs="12" md="9" style={{position: 'relative' , zIndex: 995}}>
                      <Select 
                          id="mapping-select"
                          ref={(ref) => { this.select = ref; }}
                          options={this.state.fieldList}
                          simpleValue
                          clearable
                          multi
                          name="select-mapping"
                          value={this.state.fieldValue}
                          onChange={(e) => this._onChangeHandler(e, 'mapping-select')}
                          searchable
                          labelKey="field"
                          valueKey="field"
                        /> 
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Col md="3">
                        <Label>Train-Test Split</Label>
                      </Col>
                      <Col md="9">
                        <FormGroup check inline>
                          <Input className="form-check-input" type="radio" id="inline-radio1" name="inline-radios" value="option1" autoComplete="off"/>
                          <Label className="form-check-label" check htmlFor="inline-radio1">80/20</Label>
                        </FormGroup>
                        <FormGroup check inline>
                          <Input className="form-check-input" type="radio" id="inline-radio2" name="inline-radios" value="option2" autoComplete="off"/>
                          <Label className="form-check-label" check htmlFor="inline-radio2">70/30</Label>
                        </FormGroup>
                        <FormGroup check inline>
                          <Input className="form-check-input" type="radio" id="inline-radio3" name="inline-radios" value="option3" autoComplete="off"/>
                          <Label className="form-check-label" check htmlFor="inline-radio3">60/40</Label>
                        </FormGroup>
                      </Col>
                    </FormGroup>


                     { this.state.isTimeRangeVisible ? 
                     <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="gte">GTE - @timestamp</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><i className="fa fa-clock-o"></i></InputGroupText>
                            </InputGroupAddon>
                          <Input type="text" id="gte" name="gte" placeholder="now-15m" onChange={(e) => this._onChangeHandler(e, 'gte')} required />
                        </InputGroup>
                      </Col>
                    </FormGroup> : null}
                    
                    { this.state.isTimeRangeVisible ? null : 
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="custom-query">Custom Query</Label>
                      </Col>
                      <Col md="9">
                        <AceEditor
                          mode="json"
                          theme="monokai"
                          value={this.state.editorString}
                          onChange={(e) => this._onChangeHandler(e, 'editor-value')}
                          name="editor"
                          fontSize={14}
                          editorProps={{$blockScrolling: true}}
                          setOptions={{
                            enableBasicAutocompletion: false,
                            enableLiveAutocompletion: false,
                            enableSnippets: false,
                            showLineNumbers: true,
                            tabSize: 2
                          }}/> 
                        </Col>
                      </FormGroup>}

                    { this.state.isTimeRangeVisible ?
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="lte">LTE - @timestamp</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><i className="fa fa-clock-o"></i></InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" id="lte" name="lte" placeholder="now" onChange={(e) => this._onChangeHandler(e, 'lte')} required/>
                          </InputGroup>
                      </Col>
                    </FormGroup>: null}

                  </Form>
                </CardBody>

                <CardFooter>
                  {this.state.hideDataButton}&nbsp; &nbsp; 
                  <Button onClick={(e) => this._onClickHandler(e, 'doc_count')} color="primary">{this.state.countText}</Button>&nbsp; &nbsp; 
                  {this.state.loading ? <ReactLoading className="float-right" type={'bars'} color={'#3498db'} height={42} width={42} /> : null}
                  
                  {this.state.loading ? null : 
                    <ButtonDropdown className="mr-1 float-right" isOpen={this.state.dropdownOpen[18]} toggle={() => { this.toggle(18); }}>
                      <DropdownToggle caret color="primary">
                          Export Data
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={(e) => this._onClickHandler(e, 'csv')}>Export CSV </DropdownItem>
                        <DropdownItem onClick={(e) => this._onClickHandler(e, 'mongo')}>Export MongoDB</DropdownItem>
                        <DropdownItem onClick={(e) => this._onClickHandler(e, 'sql')}>Export SQL</DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown> } &nbsp; &nbsp; 
                </CardFooter>
              </Card>
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
      <AppFooter>
          <DefaultFooter />
        </AppFooter>
      </div>
    );
  }
}

export default Dashboard;
