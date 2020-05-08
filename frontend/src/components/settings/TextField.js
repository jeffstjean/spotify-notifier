import React, { useState, useEffect } from 'react'

const TextField = (props) => {

    const [field_value, set_value] = useState(props.value);

    const on_change = (event) => {
        set_value(event.target.value)
        update_form(event.target.id, event.target.value)
    }

    const { value, placeholder, id, type, update_form } = props;
    if(field_value === undefined || field_value === null || field_value.trim() === '') { return (
        <input type={type} className="form-control my-1" id={ id } value='' placeholder={placeholder} onChange={on_change}/>
    )}
    else {return (
        <input type={type} className="form-control my-1" id={ id } value={field_value} onChange={on_change}/>
    )}
}

export default TextField
