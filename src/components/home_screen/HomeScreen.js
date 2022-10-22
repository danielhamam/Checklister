import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import ChecklistCard from './ChecklistCard';
import { getFirestore } from 'redux-firestore';
import { constants } from '../../constants';

import Banner from '../others/Banner';

class HomeScreen extends Component {
    state = {
        isNewItem : false,
        list_index : 101010,
        rerender : false,
    }

    handleNewList = () => {
        const fireStore = getFirestore();
        fireStore.collection('accounts').doc(this.props.auth.uid).collection('checklists').add(constants.newChecklist)
        .then(ref => {
            this.setState({list_index: ref.id});
            this.setState({isNewItem : true});
        }).catch((error) => {
            console.log(error);
        });
    }
    
    updateList = (event) => {
        // Update the created_time so it can be on top
        const fireStore = getFirestore();
        let baseURI = event.target.baseURI;
        let TARGET_ID = baseURI.split('/').pop();
        
        let reference = fireStore.collection("todoLists").doc(TARGET_ID);
        reference.update({
            created_time: new Date()
        })
    }

    render() {

        if (this.state.isNewItem) {
           return <Redirect to={'/todoList/' + this.state.list_index} />;
        }

        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }
        return (
            
            <div className="dashboard">
                <div className='container fit_nav_width'>
                    <div className="row row-margin">
                        <div className="col s5">
                            <div id="your_lists">Your Lists</div> 
                            <div onClick={this.updateList}>
                                <div className="todo-lists section">
                                    {this.props.todoLists && this.props.todoLists.map(todoList => (
                                        <Link to={'/todoList/' + todoList.id} key={todoList.id} >
                                            <ChecklistCard todoList={todoList}/>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div> 
                        <div className="col s5 offset-s2">
                            <div className='banner-flex'>
                                <Banner/>
                                <div className="home_new_list_container">
                                    <button className="home_new_list_button" onClick={this.handleNewList}>
                                        Create a new Checklist
                                    </button>
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        );
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
    firestoreConnect([
      { collection: 'todoLists', orderBy: ['created_time', 'desc']},
    ]),
)(HomeScreen);