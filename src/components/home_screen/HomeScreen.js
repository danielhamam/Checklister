import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import TodoListLinks from './TodoListLinks';
import { getFirestore } from 'redux-firestore';

class HomeScreen extends Component {
    state = {
        isNewItem : false,
        list_index : 101010,
        rerender : false,
    }

    handleNewList = () => {
        let answer = Math.floor(Math.random() * 1000) + 100;
        let id = Math.floor(Math.random() * 1000) + 100;
        const fireStore = getFirestore();
        // new item
        fireStore.collection('todoLists').add ({
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
            
            <div className="dashboard container">
                <div className="row">
                    <div id="your_lists">Your Lists</div> 
                    <div className="col s12 m4" onClick={this.updateList}>
                        <TodoListLinks/>
                    </div>

                    <div className="col s8" >
                        <div className="banner">
                            @todo<br />
                            List Maker
                        </div>
                        
                        <div className="home_new_list_container">
                                <button className="home_new_list_button" onClick={this.handleNewList}>
                                    Create a New To Do List
                                </button>
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