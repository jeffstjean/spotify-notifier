import React, { useState, useRef } from 'react'
import axios from 'axios'
import * as _ from "underscore";

const SearchArtists = (props) => {
    const [search_term, set_search_term] = useState('')

    const throttled_search = useRef(_.debounce(search_term => {
        if(search_term.trim() === '') {
            props.set_loading(false);
            props.on_change([]);
            return;
        }
        axios.get(`http://localhost:5000/search?type=artist&limit=4&q=${search_term}`)
            .then(result => {
                props.set_loading(false);
                if(result.data.items.length === 0) {
                    props.on_change(null);
                }
                else props.on_change(result.data.items);
            })
            .catch(error => {
                props.on_change([]);
                console.log(error)
            });
    }, 200)).current


    const onChange = (e) => {
        props.set_loading(true);
        set_search_term(e.target.value);
        throttled_search(e.target.value);
    }

    return (
        <div className='card card-body mb-4 p-4'>
            <h1 className='display-5 text-center'>
                Search For An Artist <i className='fas fa-music'/> 
            </h1>
            <p className='lead text-center'>Receive notifications for any artist</p>
            {/* <form onSubmit=''> */}
                <div className='form-group'>
                    <input type='text' className='form-control form-control-lg' autoComplete='off'
                        placeholder='Artist name...' name='search_term' value={search_term} onChange={onChange}/>
                </div>
            {/* </form> */}
        </div>
    )
}

export default SearchArtists 


