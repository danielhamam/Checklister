import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';


class TaskScreen extends Component {

    // use the index

    state = {

        goList : false,
        checklist : this.props.checklist ? this.props.checklist[0] : null,
        task : this.props.checklist ? this.props.checklist.tasks[this.props.match.params.key]: null

        // old_description: this.props.checklist.tasks[this.props.match.params.key].description,
        // old_assigned_to: this.props.checklist.tasks[this.props.match.params.key].assigned_to,
        // old_due_date: this.props.checklist.tasks[this.props.match.params.key].due_date,
        // old_completed: this.props.checklist.tasks[this.props.match.params.key].completed,

        // new_description: this.props.checklist.tasks[this.props.match.params.key].description,
        // new_assigned_to: this.props.checklist.tasks[this.props.match.params.key].assigned_to,
        // new_due_date: this.props.checklist.tasks[this.props.match.params.key].due_date,
        // new_completed: this.props.checklist.tasks[this.props.match.params.key].completed,

        // key: this.props.checklist.tasks[this.props.match.params.key].key
    }

    goListScreen = () => {
        this.setState({goList : true});
    }

    handlePropertyChange = (e, property) => {
        console.log("e", e)
        this.setState(prevState => ({
            task: {    
                ...prevState.task,
                [property] : e.target.value
            }
        })
    )}

    processCancelChanges = () => {

        const fireStore = getFirestore();
        let reference = fireStore.collection('todoLists').doc(this.props.todoList.id);

        // If original states were the default, it was add item
        let description = this.state.old_description;
        let assigned_to = this.state.old_assigned_to;
        let completed = this.state.old_completed;
        let due_date = this.state.old_due_date;

        if (this.props.todoList.tasks[this.props.match.params.key].isOldItem == false && description == "Unknown" && assigned_to == "Unknown" && completed == false && due_date == "0000-00-00") {

            let index = this.props.todoList.tasks.map(function (item) {return item.key;}).indexOf(this.props.todoList.tasks[this.props.match.params.key].key);

            this.props.todoList.tasks.splice(index, 1);
            fireStore.collection("todoLists").doc(this.props.todoList.id).update({ tasks: this.props.todoList.tasks});

            // Remove from frontend
            this.props.todoList.tasks.pop();
        } 
        this.setState({goList : true});
    }

    processSubmitChanges = () => {

       const fireStore = getFirestore();
       let reference = fireStore.collection('todoLists').doc(this.props.todoList.id);

       let index = this.props.todoList.tasks.map(function (item) {return item.key;}).indexOf(this.props.todoList.tasks[this.props.match.params.key].key);

      this.props.todoList.tasks.splice(index, 1);
      fireStore.collection("todoLists").doc(this.props.todoList.id).update({ tasks: this.props.todoList.tasks});

        const new_item = {
            assigned_to: this.state.new_assigned_to,
            completed: this.state.new_completed,
            description: this.state.new_description,
            due_date: this.state.new_due_date,
            key: this.state.key,
        };
        this.props.todoList.tasks.splice(index, 0, new_item);
        fireStore.collection("todoLists").doc(this.props.todoList.id).update({ tasks: this.props.todoList.tasks});

        this.setState({goList : true});
    }

    render() {

        console.log('ItemScreen.render: this.props -> ', this.props);

        // const list_id = this.props.todoList.id;
        const checklist = this.props.checklist ? this.props.checklist[0] : null;
        const task = checklist ? checklist.tasks[this.props.match.params.key]: null;

        // if (this.state.goList) {
        //     return <Redirect to={"/chec/" + list_id} />
        // }

        return (

        <div class="container">
        <h3 id="item_heading">Task</h3>

        <div id="item_form_container">

            <div id="item_description_prompt" class="item_prompt">Description:</div>
            <input id= "item_description_textfield" onChange = {this.handlePropertyChange('description')} defaultValue = {task ? task.description : ''} class="item_input" type="input" />
            
            <div id="item_assigned_to_prompt" class="item_prompt">Assigned To:</div>
            <input id="item_assigned_to_textfield" onChange = {this.handlePropertyChange('assigned_to')} defaultValue = {task ? task.assigned_to : ''} class="item_input" type="input" />

            <div id= "item_due_date_prompt"  class="item_prompt">Due Date:</div>
            <input id="item_due_date_picker" onChange = {this.handlePropertyChange('due_date')} defaultValue = {task ? task.due_date : ''} class="item_input" type="date" />

            <div id="item_completed_prompt" class="item_prompt">Completed:</div>
            <label> <input id="item_completed_checkbox" className="form_checkbox" type="checkbox" onChange = {this.handlePropertyChange('completed')} defaultChecked= {task ? task.completed : ''} /> </label>
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
    return {
      auth: state.firebase.auth,
      checklist: state.firestore.ordered.checklist
    };
  };
  
  export default compose(
    connect(mapStateToProps),
    firestoreConnect(props => {
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
  )(TaskScreen);