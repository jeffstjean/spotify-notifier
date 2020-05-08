import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css'


class Navbar extends Component {
  get_cookie(cookie_name) {
    const cookies = document.cookie.split(';')
    var value = undefined;
    cookies.forEach(cookie => {
      cookie = cookie.trim();
      if(cookie.substring(0, cookie_name.length)=== cookie_name) {
        value = cookie.substring(cookie_name.length+1);
      }
    })
    return(value)
  }
  
  render() {
    const is_user = this.get_cookie('authorization');
    return (
      <nav className='navbar navbar-dark navbar-expand-md bg-dark mb-5'>
        <NavLink exact to='/' activeClassName='active' className='navbar-brand'>Spotify Notifier</NavLink>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            {is_user && (
              <React.Fragment>
                <NavLink exact to='/dashboard' activeClassName='active' className="nav-item nav-link">Dashboard</NavLink>
                <NavLink exact to='/following' activeClassName='active' className="nav-item nav-link">Following</NavLink>
                <NavLink exact to='/search' activeClassName='active' className="nav-item nav-link">Search</NavLink>
              </React.Fragment>
            )}
            {!is_user && (
              <React.Fragment>
                <button className="nav-item nav-link link-button" onClick={() => {
                  window.location.replace(`http://localhost:5000/login?origin=${encodeURI(window.location.href)}`);
                }}>Connect Spotify</button>
              </React.Fragment>
            )}
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
