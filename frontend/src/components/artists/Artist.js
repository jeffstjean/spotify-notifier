import React from 'react'
import axios from 'axios'

class Artist extends React.Component {
  state = {
    btn_class: 'btn btn-secondary btn-block',
    btn_text: 'Follow'
  }

  componentDidMount() {
    if(this.props.btn_state === 'Unfollow') {
      this.setState({ btn_class: 'btn btn-success btn-block', btn_text: 'Unfollow' });
    }
  }

  follow_artist = () => {
    const { artist } = this.props
    if(this.state.btn_text==='Follow') {
      axios.put(`http://localhost:5000/follow`, { spotify_id: artist.id }, { withCredentials: true })
        .then(result => { this.setState({ btn_class: 'btn btn-success btn-block', btn_text: 'Unfollow' }); })
        .catch((e) => { console.log(e) })
    }
    else {
      axios.post(`http://localhost:5000/follow`, { spotify_id: artist.id }, { withCredentials: true })
        .then(result => { this.setState({ btn_class: 'btn btn-secondary btn-block', btn_text: 'Follow' }); })
        .catch((e) => { console.log(e) })
    }
  }

  render(props) {
    const { artist } = this.props;
    return (
      <div className='col-md-6'>
        <div className='card mb-4 shadow-sm text-center'>
          <div className='card-body'>
            <h5 className='card-title'>{ artist.name }</h5>
            <button className={this.state.btn_class} onClick={() => {this.follow_artist()}}>{ this.state.btn_text }</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Artist;
