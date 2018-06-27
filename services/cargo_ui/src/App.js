import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'mobx-react';
import mainStore from './stores/mainStore';
import commonStore from './stores/commonStore';
import './App.css';
import 'flag-icon-css/css/flag-icon.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'simple-line-icons/css/simple-line-icons.css';
import './css/style.css'

import { Main } from './containers';

const stores = {
  mainStore,
  commonStore
};


class App extends Component {
  
  render() {
    return (
      <Provider {...stores}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" name="Main" component={Main}/>
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
