import React, { Component } from 'react';
import Artist from './Artist'
import Spinner from '../layout/Spinner'

class Artists extends Component {
  render() {
    const { artist_list, is_loading, heading } = this.props
      if(artist_list === undefined || is_loading) {
        return <Spinner/>
      }
      else if(artist_list === null) {
        return (
          <div class="alert alert-dark">Your search came back with no results.</div>
        )
      }
      else {
        return (
          <React.Fragment>
            <h3 className='text-center mb-4'>{ heading }</h3>
            <div className='row'>
                {artist_list.map(item => (
                  <Artist key={ item.id } artist={ item } btn_state={ this.props.btn_state }/>
                ))}
              </div>
            </React.Fragment>
        )
      }
  }
}

export default Artists;
