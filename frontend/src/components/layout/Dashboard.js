import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios'
import Spinner from './Spinner'
import Settings from '../settings/Settings'

const Dashboard = (props) => {
  const [user, set_user] = useState('')
  const [email, set_email] = useState('')
  const [phone, set_phone] = useState('')
  
  const update_user = () => {
    console.log('UPDATE');
    axios.get(`${process.env.REACT_APP_BACKEND}/settings`, { withCredentials: true })
      .then(result => {
        set_user(result.data)
        set_email(result.data.email)
        set_phone(result.data.phone)
      })
      .catch(error => {
        console.log(error)
      });
  }

  useEffect(() => {
    update_user();
  }, []);


  if(user === '') {
    return (
      <div className='jumbotron'>
        <h1 className='display-4'>Dashboard</h1>
        <hr className='my-5'/>
        <Spinner />
        <hr className='my-5'/>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      </div>
    )
  }
  else {
    return (
      <div className='jumbotron'>
        <h1 className='display-4'>Dashboard</h1>
        <hr className='my-5'/>
        <div className='container'>
          <div className='row'>
            <div className='col-7 my-auto'>
              <div className='lead mb-4'>Welcome {user.name} - <a style={{color: '#2ecc71'}} href={user.spotify_link} target='_blank' rel="noopener noreferrer">{user.spotify_id} <i style={{'textDecoration': 'none'}}className="fas fa-external-link-alt"></i></a></div>
              <p><span style={{'fontWeight': 'bold'}}>Role</span>: {user.role}</p>
              <p><span style={{'fontWeight': 'bold'}}>Email</span>: {user.email.email_address ? user.email.email_address : <i className="fas fa-ban"></i>}</p>
              <p><span style={{'fontWeight': 'bold'}}>Phone</span>: {user.phone.phone_number ? user.phone.phone_number : <i className="fas fa-ban"></i>}</p>
              <NavLink exact to='/following' style={{'textDecoration': 'none', 'color': '#2c3e50', 'fontWeight': 'bold'}}>Artists Followed<span className="mx-1 badge badge-dark text-center">{user.followed_artists.length}</span></NavLink>
            </div>
            <div className='col-5'>
              <a href={user.spotify_link} target='_blank' rel="noopener noreferrer">
                  <div className='mx-auto' style ={{
                  'width': '150px',
                  'height': '150px',
                  'overflow': 'hidden',
                  'WebkitBorderRadius': '50%',
                  'MozBorderRadius': '50%',
                  'msBorderRadius': '50%',
                  'OBorderRadius': '50%',
                  'borderRadius': '50%'
                }}><img width='150px' height='150px' src={user.image} alt='Spotify Profile'></img></div>
              </a>
            </div>
          </div>
          <hr className='my-5'/>
          <Settings email_address={user.email.email_address} phone_number={user.phone.phone_number} update_dashboard={update_user}/>
          <hr className='my-5'/>
        </div>
      </div>
    )
  }
}

export default Dashboard;
