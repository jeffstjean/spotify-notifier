import React, { useState } from 'react';
import axios from 'axios'

const Index = () => {
  const [btn_class, set_btn_class] = useState('btn btn-info')
  const [btn_text, set_btn_text] = useState('Simulate Release')

  const change = () => {
    setTimeout(() => {
      set_btn_class('btn btn-secondary');
      set_btn_text('Running...');
    }, 300)
    setTimeout(() => {
      set_btn_text('Running..');
      axios.get(`http://localhost:5000/sim`, { withCredentials: true })
    }, 600)
    setTimeout(() => {
      set_btn_text('Running...');
    }, 900)
    setTimeout(() => {
      set_btn_class('btn btn-success');
      set_btn_text('Done.');
    }, 1200)
  }

  return (
    <button type="button" onClick={change}class={btn_class}>{btn_text}</button>
  )
}

export default Index;
