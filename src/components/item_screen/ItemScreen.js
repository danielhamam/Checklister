import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';


class ItemScreen extends Component {

    state = {
        goList : false,
        description: this.props.todoList.items[this.props.match.params.key].description,
        assigned_to: this.props.todoList.items[this.props.match.params.key].assigned_to,
        due_date: this.props.todoList.items[this.props.match.params.key].due_date,
        completed: this.props.todoList.items[this.props.match.params.key].completed
    }

    goListScreen = () => {
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
            <input id= "item_description_textfield" defaultValue = {this.state.description} class="item_input" type="input" />
            
            <div id="item_assigned_to_prompt" class="item_prompt">Assigned To:</div>
            <input id="item_assigned_to_textfield" defaultValue = {this.state.assigned_to} class="item_input" type="input" />

            <div id= "item_due_date_prompt"  class="item_prompt">Due Date:</div>
            <input id="item_due_date_picker" defaultValue = {this.state.due_date} class="item_input" type="date" />

            <div id="item_completed_prompt" class="item_prompt">Completed:</div>
            <input id="item_completed_checkbox" defaultChecked= {this.state.completed} class="item_input" type="checkbox" />
        </div>

        <br />
        <button id="item_form_submit_button" class="item_button" onClick= {this.props.processSubmitChanges} >Submit</button>
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