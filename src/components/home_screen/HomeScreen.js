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
        todoList_id : 101010,
    }

    handleNewList = (e) => {
        let answer = Math.floor(Math.random() * 1000) + 100;
        const fireStore = getFirestore();
        let reference = fireStore.collection('todoLists');

        // new item
        const new_item = {
            created_time: new Date(),
            key: answer, // key is just used to distinguish, doesn't really matter. We sort with index.
            name: 'Unknown',
            owner: 'Unknown',
            items: [],
        };
        // let value = e.target.value;
        // let being_replaced = this.props.todoLists[0]; // At index 0, remove 1 element.
        // this.props.todoLists.splice(0, 0, new_item); // Put new element at index 0
        // this.props.todoLists.splice(1, 0, being_replaced); // Put old element at index 1
        this.props.todoLists.push(new_item);

        reference.add({
            created_time: new Date(),
            key: answer, // key is just used to distinguish, doesn't really matter. We sort with index.
            name: 'Unknown',
            owner: 'Unknown',
            items: [],
        });

        reference.orderBy('created_time', 'desc');
        let index = this.props.todoLists.map(function (todoList) {return todoList.key;}).indexOf(answer);
        let todoList = this.props.todoLists[index].id;

        this.setState({todoList_id: todoList});
        this.setState({isNewItem : true});
        
    }

    render() {

        if (this.state.isNewItem) {
           return <Redirect to={'/todoList/' + this.state.todoList_id} />;
        }

        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }
        return (
            
            <div className="dashboard container">
                <div className="row">
                    <div id="your_lists">Your Lists</div> 
                    <div className="col s12 m4">
                        <TodoListLinks />
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
      { collection: 'todoLists' },
    ]),
)(HomeScreen);