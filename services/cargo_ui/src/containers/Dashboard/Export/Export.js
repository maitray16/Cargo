import React, { Component } from 'react';
import { AppSwitch } from '@coreui/react';
import { inject, observer } from 'mobx-react';
import {Card, CardBody, CardFooter, Button, CardHeader, Col, Form, FormGroup, Label, Input, InputGroup,
    InputGroupText, InputGroupAddon, ButtonDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';

import AceEditor from 'react-ace';
import ReactLoading from 'react-loading';
import Select from 'react-select';

import 'loaders.css/src/animations/line-scale.scss';
import 'react-select/dist/react-select.css';
import 'brace/mode/json';
import 'brace/theme/monokai';

const cardHeaderColor = '#52616a';
const cardHeaderTextColor = '#fff';
const cardHeaderStyle = {background: cardHeaderColor, color: cardHeaderTextColor};

@inject('exportStore')
@observer
class Export extends Component {
    state = {
        gte: '',
        lte: '',
        hideData: false,
        loading: false,
        hideDataButton: <Button outline color="secondary" onClick={(e) => this._onClickHandler(e, 'data_obfs_button')}>Enable Data Obfuscation</Button>
      }

      constructor(props) {
        super(props);
          this.props.exportStore.getIndexList();
          this.props.exportStore.toggle()
          this._onChangeHandler = this._onChangeHandler.bind(this);
          this._onClickHandler = this._onClickHandler.bind(this);
      }

      _onClickHandler(e, tag){
        switch(tag){
          case 'app-switch':
            this.props.exportStore.timeRangeToggle();
            break;
          
          case 'doc_count':
            this.props.exportStore.getDocCount()
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
              this.props.exportStore.export(tag);
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
              this.props.exportStore.setIndex(e);
              break;
          case 'mapping-select':
              this.props.exportStore.setMapping(e);
              break;
          case 'editor-value':
              this.props.exportStore.setEditorString(e);
              break;
          
          default:
            break;
        }
      }

      render(){
          return(
            <div className="animated fadeIn">
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
                        options={this.props.exportStore.indexList}
                        simpleValue
                        clearable
                        name="select-index"
                        value={this.props.exportStore.indexValue}
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
                        options={this.props.exportStore.fieldList}
                        simpleValue
                        clearable
                        multi
                        name="select-mapping"
                        value={this.props.exportStore.fieldValue}
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


                   { this.props.exportStore.isTimeRangeVisible ? 
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
                  
                  { this.props.exportStore.isTimeRangeVisible ? null : 
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="custom-query">Custom Query</Label>
                    </Col>
                    <Col md="9">
                      <AceEditor
                        mode="json"
                        theme="monokai"
                        value={this.props.exportStore.editorString}
                        onChange={(e) => this._onChangeHandler(e, 'editor-value')}
                        name="editor"
                        fontSize={14}
                        editorProps={{$blockScrolling: true}}
                        setOptions={{
                          enableBasicAutocompletion: true,
                          enableLiveAutocompletion: true,
                          enableSnippets: false,
                          showLineNumbers: true,
                          tabSize: 2
                        }}/> 
                      </Col>
                    </FormGroup>}

                  { this.props.exportStore.isTimeRangeVisible ?
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
                <Button onClick={(e) => this._onClickHandler(e, 'doc_count')} color="primary">{this.props.exportStore.countText}</Button>&nbsp; &nbsp; 
                {this.props.exportStore.loading ? <ReactLoading className="float-right" type={'bars'} color={'#3498db'} height={42} width={42} /> : null}
                
                {this.state.loading ? null : 
                  <ButtonDropdown className="mr-1 float-right" isOpen={this.props.exportStore.dropdownOpen[18]} toggle={() => { this.props.exportStore.toggle(18); }}>
                    <DropdownToggle caret color="primary">
                        Export Data
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={(e) => this._onClickHandler(e, 'csv')}>Export CSV </DropdownItem>
                      <DropdownItem onClick={(e) => this._onClickHandler(e, 'mongo')}>Export MongoDB</DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown> } &nbsp; &nbsp; 
              </CardFooter>
            </Card>
        </div>
        );
      }
}

export default Export;