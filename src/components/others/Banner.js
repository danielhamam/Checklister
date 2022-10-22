import React, { Component } from 'react'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';

class Banner extends Component {
  state = {
    adminRedirect : false
  }
  render() {

    if (this.state.adminRedirect) {
      return <Redirect to="/admin" />;
    }

    return (
        <div className='banner'> 
            <p style={{fontSize:'3.9vw'}}>
                <span>Checklister&trade;</span>
                <br/>
                <span style={{fontSize:'1.8vw'}}>Easy, Customizable and Fun </span>
                {this.props.isAdministrator === true ? 
                <button id="goAdmin" onClick={() => this.setState({adminRedirect: true})}> Go to Admin Page 🔐</button>
                : ''}
            </p>
        </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
      isAdministrator : state.firebase.profile.administrator,
      todoLists: state.firestore.ordered.todoLists, //.ordered something we can map through. 
      auth: state.firebase.auth
  };
};

export default compose(
  connect(mapStateToProps),
)(Banner);