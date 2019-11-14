import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemsList from './ItemsList.js'
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';


class ListScreen extends Component {
    state = {
        name: '',
        owner: '',
        NavigateHome: false, 
        rerender : false,
    }

    handleChange = (e) => {
        const { target } = e;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));
    }

    toggleModal = () => {
        let result = document.getElementById("my_modal");
        if (result.style.display == "block") {
            document.getElementById("my_modal").style.animation = "fadeout .6s";
            result.style.visibility = "hidden";
        } else {
            result.style.visibility = "visible";
            document.getElementById("my_modal").style.animation = "fadein .6s";
            result.style.display = "block";
        }
    }

    onModal = () => {
        let result = document.getElementById("my_modal");
        result.style.visibility = "visible";
        document.getElementById("my_modal").style.animation = "fadein .6s";
        result.style.display = "block";
    }

    deleteList = () => {
        const fireStore = getFirestore();
        fireStore.collection('todoLists').doc(this.props.todoList.id).delete();
        this.toggleModal();
        this.setState({ NavigateHome : true});
   }

   deleteItem = () => {
    const fireStore = getFirestore();
    let reference = fireStore.collection('todoLists').doc(this.props.todoList.id);

    // DELETE ITEM:
    // reference.update({
    //     'items': fireStore.FieldValue.arrayRemove({
    //         assigned_to: this.state.assigned_to,
    //         completed: this.state.completed,
    //         description: this.state.description,
    //         due_date: this.state.due_date,
    //         key: this.state.key,
    //     })
    // });

   }

    render() {
        const auth = this.props.auth;
        const todoList = this.props.todoList;
        if (!auth.uid) {
            return <Redirect to="/" />;
        }
        if (this.state.NavigateHome == true) {
            return <Redirect to="/" />;
        }
        return (

            <div className="container white">
                <div class="modal-trigger" href="my_modal" id="list_trash" onClick={this.onModal}> &#128465; </div>
                <h5 className="grey-text text-darken-3">Todo List</h5>
                <div className="input-field">
                    <label htmlFor="email"></label>
                    <input className="active" type="text" name="name" id="name" onChange={this.handleChange} defaultValue={todoList.name} />
                </div>
                <div className="input-field">
                    <label htmlFor="password"></label>
                    <input className="active" type="text" name="owner" id="owner" onChange={this.handleChange} defaultValue={todoList.owner} />
                </div>

                <div id="my_modal" class="modal">
                    <div class="modal-content ">
                        <h4>Delete list?</h4>
                        <br />
                        <p> Are you sure you want to delete this list?</p>
                    </div>
                        <button id="yes" onClick={this.deleteList} class="modal-close waves-effect waves-white btn-flat">Yes</button>
                        <button id="no" onClick={this.toggleModal} class="modal-close waves-effect waves-white btn-flat">No</button>
                        <div id="last_line"> This list will not be retrievable.</div>
                </div>

                <ItemsList todoList={todoList} />

            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const { todoLists } = state.firestore.data;
  const todoList = todoLists ? todoLists[id] : null;
  todoList.id = id;

  return {
    todoList,
    auth: state.firebase.auth,
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'todoLists' },
  ]),
)(ListScreen);