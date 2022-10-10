import React, { Component } from 'react'

export default class Banner extends Component {
  render() {
    return (
        <div className='banner'> 
            <p style={{fontSize:'3.9vw'}}>
                <span>Checklister&trade;</span>
                <br/>
                <span style={{fontSize:'1.8vw'}}>Easy, Customizable and Fun </span>
            </p>
        </div>
    )
  }
}
