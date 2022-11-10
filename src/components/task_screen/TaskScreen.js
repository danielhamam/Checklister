import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';


class TaskScreen extends Component {
    state = {
        goList : false,
        // checklist : this.props.checklist ? this.props.checklist[0] : null,
        // task : this.props.checklist && this.props.checklist.tasks ? this.props.checklist.tasks[this.props.match.params.key] : null
    }

    goListScreen = () => { this.setState({goList : true}); }

    handlePropertyChange = (e, property) => {
        const propertyVal = e.target.value;
        const checklist = this.props.checklist ? this.props.checklist[0] : null;
        if (checklist) checklist.tasks[this.props.match.params.key][property] = propertyVal
    }

    processCancelChanges = () => { this.setState({goList : true}); }

    processSubmitChanges = () => {
        const fireStore = getFirestore();
        const checklist = this.props.checklist ? this.props.checklist[0] : null;
        if (checklist) fireStore.collection('accounts').doc(this.props.auth.uid).collection('checklists').doc(checklist.id).update({ tasks: checklist.tasks});
        this.setState({goList : true});
    }

    render() {
        // console.log('ItemScreen.render: this.props -> ', this.props);
        // const list_id = this.props.todoList.id;
        const checklist = this.props.checklist ? this.props.checklist[0] : null;
        const task = checklist ? checklist.tasks[this.props.match.params.key] : null;

        if (this.state.goList && checklist) {
            return <Redirect to={"/checklist/" + this.props.match.params.id} />
        }

        return (
        <div className='dashboard'>
            <div className="container">
                <h4 id="item_heading">Task</h4>
                <div id="item_form_container">

                    <div id="item_description_prompt" className="item_prompt">Description:</div>
                    <input id= "item_description_textfield" onChange = {(e) => this.handlePropertyChange(e, 'description')} defaultValue = {task ? task.description : ''} className="item_input" type="input" />
                    
                    <div id="item_assigned_to_prompt" className="item_prompt">Assigned To:</div>
                    <input id="item_assigned_to_textfield" onChange = {(e) => this.handlePropertyChange(e, 'assigned_to')} defaultValue = {task ? task.assigned_to : ''} className="item_input" type="input" />

                    <div id= "item_due_date_prompt"  className="item_prompt">Due Date:</div>
                    <input id="item_due_date_picker" onChange = {(e) => this.handlePropertyChange(e, 'due_date')} defaultValue = {task ? task.due_date : ''} className="item_input" type="date" />

                    <div id="item_completed_prompt" className="item_prompt">Completed:</div>
                    <input id="item_completed_checkbox" className="form_checkbox" type="checkbox" onChange = {(e) => this.handlePropertyChange(e, 'completed')} defaultChecked= {task ? task.completed : ''} />
                    
                </div>
                <br />
                <div className='item_form_buttons_container'>
                    <button id="item_form_button" className="item_button" onClick={this.processCancelChanges}>Cancel</button>
                    <button id="item_form_button" className="item_button" onClick= {this.processSubmitChanges} >Submit</button>
                </div> 
                <br />
                <br />
            </div>
        </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    // const { id } = ownProps.match.params;
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