import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import TodoListLinks from './TodoListLinks';
import { getFirestore } from 'redux-firestore';

import Banner from '../others/Banner';

class HomeScreen extends Component {
    state = {
        isNewItem : false,
        list_index : 101010,
        rerender : false,
    }

    handleNewList = () => {
        let answer = Math.floor(Math.random() * 1000) + 100;
        const fireStore = getFirestore();
        // new item
        fireStore.collection('accounts').doc(this.props.auth.uid).update({
            created_time: new Date(),
            key: answer, // key is just used to distinguish, doesn't really matter. We sort with index.
            name: 'Unknown',
            owner: 'Unknown',
            items: [],
        }).then(ref => {
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
                                <TodoListLinks/>
                            </div>
                        </div> 
                        <div className="col s5 offset-s2">
                            <div className='banner-flex'>
                                <Banner/>
                                <div className="home_new_list_container">
                                    <button className="home_new_list_button" onClick={this.handleNewList}>
                                        Create a New To Do List
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