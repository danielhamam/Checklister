import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import TasksList from './TasksList.js'
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';


class ListScreen extends Component {
    state = {
        // name: this.props.checklist.name,
        // owner: this.props.checklist.owner,
        // name: '',
        // owner: '',
        NavigateHome: false, 
        rerender : false,
        // propertyValWasChanged : false // keeps track if we made changes to name/owner
    }

    handleListChange = (event, property) => {
        const checklist = this.props.checklist ? this.props.checklist[0] : null;
        let propertyVal = event.target.value;
        console.log('ListScreen.handleListChange.propertyVal: ', propertyVal)
        // this.setState({propertyValWasChanged : true})
        checklist[property] = propertyVal;
    }

    toggleModal = () => {
        let result = document.getElementById("my_modal");
        if (result.style.display === "block") {
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
        const checklist = this.props.checklist ? this.props.checklist[0] : null;
        fireStore.collection('accounts').doc(this.props.auth.uid).collection('checklists').doc(checklist.id).delete();
        this.toggleModal();
        this.setState({ NavigateHome : true});
   }

   componentWillUnmount = () => {
        const fireStore = getFirestore();
        const checklist = this.props.checklist ? this.props.checklist[0] : null;
        console.log('ListScreen.componentWillUnmount : saving checklist name / owner. Name = ' + checklist.name + " and Owner = " + checklist.owner);
        if (checklist) {
            fireStore.collection('accounts').doc(this.props.auth.uid).collection('checklists').doc(checklist.id).update({ 
                'name' : checklist.name,
                'owner' : checklist.owner
            });
        }
    }

    render() {
        const auth = this.props.auth;
        const checklist = this.props.checklist ? this.props.checklist[0] : null;

        console.log('---------------LISTSCREEN.PROPS: ', this.props);
        console.log('---------------LISTSCREEN.CHECKLIST: ', this.props.checklist);
        if (!auth.uid) {
            return <Redirect to="/" />;
        }
        if (this.state.NavigateHome === true) {
            return <Redirect to="/" />;
        }
        return (
            <div className='dashboard'> 
                <div className="container white">
                    <div className="modal_trigger" href="my_modal" id="list_trash" onClick={this.onModal}> &#128465; </div>
                    <h5 className="grey-text text-darken-3" id="todolist_header">Checklist</h5>
                    <div className="test_class">    Test-Class  </div>
                    <div className="input-field">
                        <label className="active" htmlFor="email">Name:</label>
                        <input className="active" type="text" name="name" id="name" onChange={(e) => this.handleListChange(e, 'name')} key={checklist ? checklist.name : ''} defaultValue={checklist ? checklist.name : ''} />
                    </div>
                    <div className="input-field">
                        <label className="active" htmlFor="password">Owner:</label>
                        <input className="active" type="text" name="owner" id="owner" onChange={(e) => this.handleListChange(e, 'owner')} key={checklist ? checklist.name : ''} defaultValue={checklist ? checklist.owner : ''} />
                    </div>

                    <div id="my_modal" className="modal">
                        <div className="modal-content ">
                            <h4>Delete list?</h4>
                            <br />
                            <p> Are you sure you want to delete this list?</p>
                        </div>
                            <button id="yes" onClick={this.deleteList} className="modal-close waves-effect waves-white btn-flat">Yes</button>
                            <button id="no" onClick={this.toggleModal} className="modal-close waves-effect waves-white btn-flat">No</button>
                            <div id="last_line"> This list will not be retrievable.</div>
                    </div>
                    <TasksList checklist={checklist} />
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
    // console.log('---------------PROPS:', props);
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