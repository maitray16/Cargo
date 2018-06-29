import React, { Component } from "react";
import { AppSwitch } from "@coreui/react";
import { inject, observer } from "mobx-react";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
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
  DropdownItem
} from "reactstrap";

import AceEditor from "react-ace";
import ReactLoading from "react-loading";
import Select from "react-select";

import "loaders.css/src/animations/line-scale.scss";
import "react-select/dist/react-select.css";
import "brace/mode/json";
import "brace/theme/monokai";
import "brace/ext/language_tools";

const cardHeaderColor = "#52616a";
const cardHeaderTextColor = "#fff";
const cardHeaderStyle = {
  background: cardHeaderColor,
  color: cardHeaderTextColor
};

@inject("mainStore")
@observer
export default class Export extends Component {
  state = {
    gte: "",
    lte: ""
  };

  constructor(props) {
    super(props);
    this.props.mainStore.toggle();
    this._onChangeHandler = this._onChangeHandler.bind(this);
    this._onClickHandler = this._onClickHandler.bind(this);
  }

  _onClickHandler(e, tag) {
    switch (tag) {
      case "app-switch":
        this.props.mainStore.timeRangeToggle();
        break;

      case "doc_count":
        this.props.mainStore.getDocCount();
        break;

      case "csv":
      case "mongo":
      case "sql":
        this.props.mainStore.export(tag);
        break;

      default:
        break;
    }
  }

  _onChangeHandler(e, tag) {
    switch (tag) {
      case "gte":
        this.setState({ gte: e.target.value });
        break;
      case "lte":
        this.setState({ lte: e.target.value });
        break;
      case "index-select":
        this.props.mainStore.setIndex(e);
        break;
      case "mapping-select":
        this.props.mainStore.setMapping(e);
        break;
      case "editor-value":
        this.props.mainStore.setEditorString(e);
        break;

      default:
        break;
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader style={cardHeaderStyle}>
            <i className="fa fa-tasks" />
            <strong>Export</strong> Data
            <div className="card-header-actions">
              <span className="text-muted">
                <strong>Custom Query </strong>&nbsp;
              </span>
              <AppSwitch
                onClick={e => this._onClickHandler(e, "app-switch")}
                className={"float-right mb-0"}
                variant={"pill"}
                label
                color={"success"}
                size={"sm"}
                checked
              />
            </div>
          </CardHeader>
          <CardBody>
            <Form action="" method="post" className="form-horizontal">
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="indexnames">Index Names</Label>
                </Col>

                <Col
                  xs="12"
                  md="9"
                  style={{ position: "relative", zIndex: 999 }}
                >
                  <Select
                    id="index-select"
                    ref={ref => {
                      this.select = ref;
                    }}
                    options={this.props.mainStore.indexList}
                    simpleValue
                    clearable
                    name="select-index"
                    value={this.props.mainStore.indexValue}
                    onChange={e => this._onChangeHandler(e, "index-select")}
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
                <Col
                  xs="12"
                  md="9"
                  style={{ position: "relative", zIndex: 995 }}
                >
                  <Select
                    id="mapping-select"
                    ref={ref => {
                      this.select = ref;
                    }}
                    options={this.props.mainStore.fieldList}
                    simpleValue
                    clearable
                    multi
                    name="select-mapping"
                    value={this.props.mainStore.fieldValue}
                    onChange={e => this._onChangeHandler(e, "mapping-select")}
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
                    <Input
                      className="form-check-input"
                      type="radio"
                      id="inline-radio1"
                      name="inline-radios"
                      value="option1"
                      autoComplete="off"
                    />
                    <Label
                      className="form-check-label"
                      check
                      htmlFor="inline-radio1"
                    >
                      80/20
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input
                      className="form-check-input"
                      type="radio"
                      id="inline-radio2"
                      name="inline-radios"
                      value="option2"
                      autoComplete="off"
                    />
                    <Label
                      className="form-check-label"
                      check
                      htmlFor="inline-radio2"
                    >
                      70/30
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input
                      className="form-check-input"
                      type="radio"
                      id="inline-radio3"
                      name="inline-radios"
                      value="option3"
                      autoComplete="off"
                    />
                    <Label
                      className="form-check-label"
                      check
                      htmlFor="inline-radio3"
                    >
                      60/40
                    </Label>
                  </FormGroup>
                </Col>
              </FormGroup>

              {this.props.mainStore.isTimeRangeVisible ? (
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="gte">GTE - @timestamp</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <InputGroup className="input-prepend">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-clock-o" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        id="gte"
                        name="gte"
                        placeholder="now-15m"
                        onChange={e => this._onChangeHandler(e, "gte")}
                        required
                      />
                    </InputGroup>
                  </Col>
                </FormGroup>
              ) : null}

              {this.props.mainStore.isTimeRangeVisible ? null : (
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="custom-query">Custom Query</Label>
                  </Col>
                  <Col md="9">
                    <AceEditor
                      mode="json"
                      theme="monokai"
                      value={this.props.mainStore.editorString}
                      onChange={e => this._onChangeHandler(e, "editor-value")}
                      name="editor"
                      fontSize={14}
                      editorProps={{ $blockScrolling: true }}
                      setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 2
                      }}
                    />
                  </Col>
                </FormGroup>
              )}

              {this.props.mainStore.isTimeRangeVisible ? (
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="lte">LTE - @timestamp</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <InputGroup className="input-prepend">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-clock-o" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        id="lte"
                        name="lte"
                        placeholder="now"
                        onChange={e => this._onChangeHandler(e, "lte")}
                        required
                      />
                    </InputGroup>
                  </Col>
                </FormGroup>
              ) : null}
            </Form>
          </CardBody>

          <CardFooter>
            <Button outline color="danger">
              Enable Data Obfuscation
            </Button>&nbsp; &nbsp;
            <Button
              onClick={e => this._onClickHandler(e, "doc_count")}
              color="primary"
            >
              {this.props.mainStore.countText}
            </Button>&nbsp; &nbsp;
            {this.props.mainStore.loading ? (
              <ReactLoading
                className="float-right"
                type={"bars"}
                color={"#3498db"}
                height={42}
                width={42}
              />
            ) : null}
            {this.props.mainStore.loading ? null : (
              <ButtonDropdown
                className="mr-1 float-right"
                isOpen={this.props.mainStore.dropdownOpen[18]}
                toggle={() => {
                  this.props.mainStore.toggle(18);
                }}
              >
                <DropdownToggle caret color="primary">
                  Export Data
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={e => this._onClickHandler(e, "csv")}>
                    Export CSV{" "}
                  </DropdownItem>
                  <DropdownItem onClick={e => this._onClickHandler(e, "mongo")}>
                    Export MongoDB
                  </DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            )}{" "}
            &nbsp; &nbsp;
          </CardFooter>
        </Card>
      </div>
    );
  }
}
