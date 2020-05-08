import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom' 

import Navbar from './components/layout/Navbar';
import Index from './components/layout/Index';
import Search from './components/layout/Search';
import Dashboard from './components/layout/Dashboard';
import Following from './components/layout/Following';
import Error from './components/layout/Error';

import './App.css';

function App() {
  return (
    <Router>
      <React.Fragment>
        <Navbar />
        <div className='container'>
          <Switch>
          <Route exact path ='/' component={ Index }/>
            <Route exact path ='/search' component={ Search }/>
            <Route exact path ='/dashboard' component={ Dashboard }/>
            <Route exact path ='/following' component={ Following }/>
            <Route exact path ='/error' component={ Error }/>
          </Switch>
        </div>
      </React.Fragment>
    </Router>
  );
}

export default App;
