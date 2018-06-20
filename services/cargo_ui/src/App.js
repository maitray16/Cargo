import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'mobx-react';
import hostStore from './stores/hostStore';
import exportStore from './stores/exportStore';

import './App.css';
import 'flag-icon-css/css/flag-icon.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'simple-line-icons/css/simple-line-icons.css';
import './scss/style.css'

import { Connect } from './containers';
import { Dashboard } from './containers';

const stores = {
  hostStore,
  exportStore
};


class App extends Component {
  
  render() {
    return (
      <Provider {...stores}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/dashboard" name="Dashboard" component={Dashboard}/>
            <Route path="/" name="Connect" component={Connect} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
