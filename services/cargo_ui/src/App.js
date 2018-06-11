import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import 'flag-icon-css/css/flag-icon.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'simple-line-icons/css/simple-line-icons.css';
import './scss/style.css'
// Containers
import { Connect } from './containers'
import { Dashboard } from './containers';

class App extends Component {
  
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/dashboard" name="Dashboard" component={Dashboard}/>
          <Route path="/" name="Connect" component={Connect} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
