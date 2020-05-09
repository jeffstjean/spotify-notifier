import React, { Component } from 'react'
import SearchArtists from '../artists/SearchArtists'
import Artists from '../artists/Artists'
import axios from 'axios'

export class Search extends Component {
  state = {
    heading: 'Top Artists',
    artist_list: [],
    top: [],
    is_loading: true
  }

  on_change = (new_list) => {
    if(new_list !== null && new_list.length === 0) this.setState({ artist_list: this.state.top, heading: 'Top Artists' });
    else this.setState({ artist_list: new_list, heading: 'Search Results' });
  }

  set_loading = (val) => {
    this.setState({ is_loading: val });
  }
  
  componentDidMount() {
    axios.get(`${process.env.REACT_APP_BACKEND}/top?limit=4`)
      .then(result => {
        this.setState({ top: result.data, artist_list: result.data , is_loading: false });
      })
      .catch(error => {
        console.log(error)
      });
  }

  render() {
    return (
      <React.Fragment>
        <SearchArtists on_change={ this.on_change } set_loading={ this.set_loading }/>
        <Artists heading={ this.state.heading } artist_list={ this.state.artist_list } is_loading={ this.state.is_loading } btn_state={'Follow'} />
      </React.Fragment>
    )
  }
}

export default Search

