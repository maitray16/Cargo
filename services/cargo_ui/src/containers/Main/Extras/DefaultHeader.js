import React, { Component } from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, Nav } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppHeaderDropdown, AppNavbarBrand } from '@coreui/react';
import logo from '../../../assets/img/package-96.png'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        <AppNavbarBrand
          full={{ src: logo, width: 32, height: 32, alt: 'Cargo' }}
        />

        <Nav className="ml-auto">
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
            <i className="icon-wrench"></i>
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
              <DropdownItem><i className="icon-rocket"></i><a target="_blank" rel="noopener" href="http://192.168.99.100:8080/"> Monitoring</a></DropdownItem>
              <DropdownItem><i className="icon-docs"></i><a target="_blank" rel="noopener" href="http://192.168.99.100/swagger"> Docs</a></DropdownItem>
              <DropdownItem><i className="icon-social-github"></i><a target="_blank" rel="noopener" href="https://github.com/maitray16/Cargo"> Github</a></DropdownItem>
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