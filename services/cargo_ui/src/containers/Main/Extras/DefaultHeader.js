import React, { Component } from "react";
import { DropdownItem, DropdownMenu, DropdownToggle, Nav } from "reactstrap";
import PropTypes from "prop-types";

import { AppHeaderDropdown, AppNavbarBrand } from "@coreui/react";
import logo from "../../../assets/img/package-96.png";

const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        <AppNavbarBrand
          full={{ src: logo, width: 32, height: 32, alt: "Cargo" }}
        />

        <Nav className="ml-auto">
          <AppHeaderDropdown direction="down">
            <DropdownToggle color="success" nav>
              <i style={{ color: "#30a64a" }} className="icon-wrench" />
            </DropdownToggle>
            <DropdownMenu right style={{ right: "auto" }}>
              <DropdownItem header tag="div" className="dtext-center">
                <strong>Settings</strong>
              </DropdownItem>
              <DropdownItem>
                <i className="icon-docs" />
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="http://localhost/swagger"
                >
                  Docs
                </a>
              </DropdownItem>
              <DropdownItem>
                <i className="icon-social-github" />
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/maitray16/Cargo"
                >
                  Github
                </a>
              </DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
