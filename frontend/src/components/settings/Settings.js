import React, { useState } from 'react'
import TextField from './TextField'
import axios from 'axios'

const Settings = (props) => {
    const [email, set_email] = useState(props.email_address);
    const [phone, set_phone] = useState(props.phone_number);
    const [submit_class, set_submit_class] = useState('btn btn-success');

    const is_empty = (obj) => {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    const on_submit = (event) => {
        event.preventDefault();
        set_submit_class('btn btn-secondary')
        var options = {};
        if(email !== props.email_address) {
            if(!options.email) options.email = {}
            options.email.email_address = email;
            options.email.in_use = (email !== '')
        }
        if(phone !== props.phone_number) {
            if(!options.phone) options.phone = {}
            options.phone.phone_number = phone;
            options.phone.in_use = (phone !== '')
        }
        console.log(options)
        if(!is_empty(options)) axios.put('http://localhost:5000/settings', options, { withCredentials: true })
            .then(result => {
                setTimeout(() => {
                props.update_dashboard();
                set_submit_class('btn btn-success')
            }, 700);
            })
            .catch(error => {
                set_submit_class('btn btn-danger')
                console.log(error)
            })
    }

    const update_form = (id, value) => {
        if(id === 'email_address') {
            set_email(value);
        }
        if(id === 'phone_number') {
            set_phone(value);
        }
    }
    return (
        <form onSubmit={on_submit}>
            <div className="row">
              <div className="col-10">
                <TextField value={ email } placeholder='Email Address' id='email_address' type='email' update_form={update_form}/>
                <TextField value={ phone } placeholder='Phone Number' id='phone_number' type='tel' update_form={update_form}/>
              </div>
              <div className="col-2 my-3" style={{ 'display': 'flex', 'aligItems': 'center' }}>
              <input className={submit_class} type="submit" value="Submit" />
              </div>
              <figcaption className="figure-caption ml-3">To turn a notification method off, leave the field blank</figcaption>
            </div>
          </form>
    )
}

export default Settings