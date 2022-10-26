import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';


class ItemScreen extends Component {

    // use the index

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

        const fireStore = getFirestore();
        let reference = fireStore.collection('todoLists').doc(this.props.todoList.id);

        this.setState({new_description: event.target.value});
    }

    handleAssignedToChange = (event) => {

        const fireStore = getFirestore();
        let reference = fireStore.collection('todoLists').doc(this.props.todoList.id);

        this.setState({new_assigned_to: event.target.value});
    }

    handleDueDateChange = (event) => {

        const fireStore = getFirestore();
        let reference = fireStore.collection('todoLists').doc(this.props.todoList.id);

        this.setState({new_due_date: event.target.value});
    }

    handleCompletedChange = (event) => {

        const fireStore = getFirestore();
        let reference = fireStore.collection('todoLists').doc(this.props.todoList.id);

        if (event.target.checked == true) {
            this.setState({new_completed: true});
        }
        if (event.target.checked == false) {
            this.setState({new_completed: false});
        }

    }

    processCancelChanges = () => {

        const fireStore = getFirestore();
        let reference = fireStore.collection('todoLists').doc(this.props.todoList.id);

        // If original states were the default, it was add item
        let description = this.state.old_description;
        let assigned_to = this.state.old_assigned_to;
        let completed = this.state.old_completed;
        let due_date = this.state.old_due_date;

        if (this.props.todoList.items[this.props.match.params.key].isOldItem == false && description == "Unknown" && assigned_to == "Unknown" && completed == false && due_date == "0000-00-00") {

            let index = this.props.todoList.items.map(function (item) {return item.key;}).indexOf(this.props.todoList.items[this.props.match.params.key].key);

            this.props.todoList.items.splice(index, 1);
            fireStore.collection("todoLists").doc(this.props.todoList.id).update({ items: this.props.todoList.items});

            // Remove from frontend
            this.props.todoList.items.pop();
        } 
        this.setState({goList : true});
    }

    processSubmitChanges = () => {

       const fireStore = getFirestore();
       let reference = fireStore.collection('todoLists').doc(this.props.todoList.id);

       let index = this.props.todoList.items.map(function (item) {return item.key;}).indexOf(this.props.todoList.items[this.props.match.params.key].key);

      this.props.todoList.items.splice(index, 1);
      fireStore.collection("todoLists").doc(this.props.todoList.id).update({ items: this.props.todoList.items});

        const new_item = {
            assigned_to: this.state.new_assigned_to,
            completed: this.state.new_completed,
            description: this.state.new_description,
            due_date: this.state.new_due_date,
            key: this.state.key,
        };
        this.props.todoList.items.splice(index, 0, new_item);
        fireStore.collection("todoLists").doc(this.props.todoList.id).update({ items: this.props.todoList.items});

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
            <label> <input id="item_completed_checkbox" className="form_checkbox" type="checkbox" onChange= {this.handleCompletedChange} defaultChecked= {this.state.old_completed} /> </label>
        </div>

        <br />
        <button id="item_form_submit_button" class="item_button" onClick= {this.processSubmitChanges} >Submit</button>
        <button id="item_form_cancel_button" class="item_button" onClick={this.processCancelChanges}>Cancel</button>

        </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { id } = ownProps.match.params;
    // const { todoLists } = state.firestore.data;
    // const todoList = todoLists ? todoLists[id] : null;
    // todoList.id = id;
  
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