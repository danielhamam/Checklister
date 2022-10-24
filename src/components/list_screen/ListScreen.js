import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemsList from './ItemsList.js'
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';


class ListScreen extends Component {
    state = {
        // name: this.props.checklist.name,
        // owner: this.props.checklist.owner,
        name: '',
        owner: '',
        NavigateHome: false, 
        rerender : false,
    }

    handleNameChange = (event) => {

        getFirestore().collection('todoLists').doc(this.props.checklist.id).update({
            name: event.target.value,
         });

        this.setState({ name: event.target.value});

    }
    handleOwnerChange = (event) => {

        getFirestore().collection('todoLists').doc(this.props.checklist.id).update({
            owner: event.target.value,
         });

        this.setState({ owner: event.target.value});
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

    onModal = (e) => {

        let result = document.getElementById("my_modal");
        result.style.visibility = "visible";
        document.getElementById("my_modal").style.animation = "fadein .6s";
        result.style.display = "block";
    }

    deleteList = () => {

        const fireStore = getFirestore();
        fireStore.collection('todoLists').doc(this.props.checklist.id).delete();
        this.toggleModal();
        this.setState({ NavigateHome : true});
   }

    render() {
        const auth = this.props.auth;
        const checklist = this.props.checklist ? this.props.checklist[0] : null;

        console.log('---------------PROPS:', this.props);
        if (!auth.uid) {
            return <Redirect to="/" />;
        }
        if (this.state.NavigateHome == true) {
            return <Redirect to="/" />;
        }
        return (
            <div className='dashboard'> 
                <div className="container white">
                    <div class="modal_trigger" href="my_modal" id="list_trash" onClick={this.onModal}> &#128465; </div>
                    <h5 className="grey-text text-darken-3" id="todolist_header">Todo List</h5>
                    <div class="test_class">    Test-Class  </div>
                    <div className="input-field">
                        <label className="active" htmlFor="email">Name:</label>
                        <input className="active" type="text" name="name" id="name" onChange={this.handleNameChange} defaultValue={checklist ? checklist.name : ''} />
                    </div>
                    <div className="input-field">
                        <label className="active" htmlFor="password">Owner:</label>
                        <input className="active" type="text" name="owner" id="owner" onChange={this.handleOwnerChange} defaultValue={checklist ? checklist.owner : ''} />
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

                    {/* <ItemsList checklist={this.props.checklist} /> */}

                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        checklist: state.firestore.ordered.checklist
    };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    console.log('---------------PROPS:', props);
    return [
        { 
        collection: 'accounts',
        doc: props.auth.uid,
        subcollections: [
            {
                collection : 'checklists', 
                doc: props.match.params.id,
            }
        ],
        storeAs: 'checklist' // abstracts data in redux store
        },
    ]
    }),
)(ListScreen);