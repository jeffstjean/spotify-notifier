import React, { Component } from 'react'
import Artists from '../artists/Artists'
import axios from 'axios'

export class Search extends Component {
  state = {
    artist_list: [],
    is_loading: true
  }

  set_loading = (val) => {
    this.setState({ is_loading: val });
  }
  
  componentDidMount() {
    axios.get('http://localhost:5000/settings/artists', { withCredentials: true })
      .then(result => {
        this.setState({ artist_list: result.data , is_loading: false });
      })
      .catch(error => {
        console.log(error)
      });
  }

  render() {
    this.state.artist_list.map(artist => {
      return artist.id = artist.spotify_id
    })
    return (
      <React.Fragment>
        <Artists heading='Followed Artists' artist_list={ this.state.artist_list } is_loading={ this.state.is_loading } btn_state={'Unfollow'}/>
      </React.Fragment>
    )
  }
}

export default Search

