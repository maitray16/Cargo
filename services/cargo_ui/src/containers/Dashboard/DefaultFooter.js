import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {
    const { children, ...attributes } = this.props;
    return (
      <React.Fragment>
        <span><a href="https://coreui.io">House Rules</a></span>
        <span className="ml-auto"><a href="https://coreui.io">Cargo</a> - <strong>Elastic Export Tool</strong></span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
