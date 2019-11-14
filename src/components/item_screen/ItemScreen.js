import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';


class ItemScreen extends Component {

    state = {
        goList : false,

        old_description: this.props.todoList.items[this.props.match.params.key].description,
        old_assigned_to: this.props.todoList.items[this.props.match.params.key].assigned_to,
        old_due_date: this.props.todoList.items[this.props.match.params.key].due_date,
        old_completed: this.props.todoList.items[this.props.match.params.key].completed,

        new_description: this.props.todoList.items[this.props.match.params.key].description,
        new_assigned_to: this.props.todoList.items[this.props.match.params.key].assigned_to,
        new_due_date: this.props.todoList.items[this.props.match.params.key].due_date,
        new_completed: this.props.todoList.items[this.props.match.params.key].completed,

        key: this.props.todoList.items[this.props.match.params.key].key
    }

    goListScreen = () => {
        this.setState({goList : true});
    }

    handleDescriptionChange = (event) => {
        this.setState({new_description: event.target.value});
    }

    handleAssignedToChange = (event) => {
        this.setState({new_assigned_to: event.target.value});
    }

    handleDueDateChange = (event) => {
        this.setState({new_due_date: event.target.value});
    }

    handleCompletedChange = (event) => {
        this.setState({new_completed: event.target.value});
    }

    processSubmitChanges = () => {

        const fireStore = getFirestore();
        let reference = fireStore.collection('todoLists').doc(this.props.todoList.id);
        
        // Delete from firestore:
        reference.update({
            'items': fireStore.FieldValue.arrayRemove({
                assigned_to: this.state.old_assigned_to,
                completed: this.state.old_completed,
                description: this.state.old_description,
                due_date: this.state.old_due_date,
                key: this.state.key,
            })
        });
        // Add to firestore (new)
        reference.update({
            'items': fireStore.FieldValue.arrayUnion({
                assigned_to: this.state.new_assigned_to,
                completed: this.state.new_completed,
                description: this.state.new_description,
                due_date: this.state.new_due_date,
                key: this.state.key,
            })
        });
        
        this.setState({goList : true});
    }

    render() {

        const list_id = this.props.todoList.id;

        if (this.state.goList) {
            return <Redirect to={"/todoList/" + list_id} />
        }
        return (

        <div class="container">
        <h3 id="item_heading">Item</h3>

        <div id="item_form_container">

            <div id="item_description_prompt" class="item_prompt">Description:</div>
            <input id= "item_description_textfield" onChange = {this.handleDescriptionChange} defaultValue = {this.state.old_description} class="item_input" type="input" />
            
            <div id="item_assigned_to_prompt" class="item_prompt">Assigned To:</div>
            <input id="item_assigned_to_textfield" onChange = {this.handleAssignedToChange} defaultValue = {this.state.old_assigned_to} class="item_input" type="input" />

            <div id= "item_due_date_prompt"  class="item_prompt">Due Date:</div>
            <input id="item_due_date_picker" onChange = {this.handleDueDateChange} defaultValue = {this.state.old_due_date} class="item_input" type="date" />

            <div id="item_completed_prompt" class="item_prompt">Completed:</div>
            <input id="item_completed_checkbox" onChange= {this.handleCompletedChange} defaultChecked= {this.state.old_completed} class="item_input" type="checkbox" />
        </div>

        <br />
        <button id="item_form_submit_button" class="item_button" onClick= {this.processSubmitChanges} >Submit</button>
        <button id="item_form_cancel_button" class="item_button" onClick={this.goListScreen}>Cancel</button>

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
  )(ItemScreen);