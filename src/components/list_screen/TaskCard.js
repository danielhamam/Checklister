import React from 'react';
// import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import {Button} from 'react-materialize';
import Icon from '@material-ui/core/Icon';
import { Redirect } from 'react-router-dom'

class TaskCard extends React.Component {

    state = {
        goList : false,
    }

processMoveUp = (e) => {
    // "description": "Give You Up",
    // "due_date": "2019-09-30",
    // "assigned_to": "Rick",
    // "completed": true,
    //  "key": 0
    e.preventDefault();
    let original_key = this.props.task.key;

    let first_index = this.props.checklist.tasks.map(function (task) {return task.key;}).indexOf(original_key);
    let second_index = first_index - 1; // Above

    // First item:
    let first_task = {
        description: this.props.checklist.tasks[first_index].description,
        due_date: this.props.checklist.tasks[first_index].due_date,
        assigned_to: this.props.checklist.tasks[first_index].assigned_to,
        completed: this.props.checklist.tasks[first_index].completed,
        key : original_key
    }

    // Second task:
    let second_task = {
        description: this.props.checklist.tasks[second_index].description,
        due_date: this.props.checklist.tasks[second_index].due_date,
        assigned_to: this.props.checklist.tasks[second_index].assigned_to,
        completed: this.props.checklist.tasks[second_index].completed,
        key : this.props.checklist.tasks[second_index].key
    }

    // Swap 

    this.props.checklist.tasks.splice(first_index, 1);
    this.props.checklist.tasks.splice(second_index, 1);

    this.props.checklist.tasks.splice(second_index, 0, first_task);
    this.props.checklist.tasks.splice(first_index, 0, second_task);

    const fireStore = getFirestore();
    fireStore.collection("checklists").doc(this.props.checklist.id).update({ tasks: this.props.checklist.tasks});
}

processMoveDown = (e) => {

    e.preventDefault();
    let original_key = this.props.task.key;

    let first_index = this.props.checklist.tasks.map(function (task) {return task.key;}).indexOf(original_key);
    let second_index = first_index + 1; // Below

    // First task:
    let first_task = {
        description: this.props.checklist.tasks[first_index].description,
        due_date: this.props.checklist.tasks[first_index].due_date,
        assigned_to: this.props.checklist.tasks[first_index].assigned_to,
        completed: this.props.checklist.tasks[first_index].completed,
        key : original_key
    }

    // Second task:
    let second_task = {
        description: this.props.checklist.tasks[second_index].description,
        due_date: this.props.checklist.tasks[second_index].due_date,
        assigned_to: this.props.checklist.tasks[second_index].assigned_to,
        completed: this.props.checklist.tasks[second_index].completed,
        key : this.props.checklist.tasks[second_index].key
    }

    // Swap 

    this.props.checklist.tasks.splice(second_index, 1);
    this.props.checklist.tasks.splice(first_index, 1);

    this.props.checklist.tasks.splice(first_index, 0, second_task);
    this.props.checklist.tasks.splice(second_index, 0, first_task);

    const fireStore = getFirestore();
    fireStore.collection("checklists").doc(this.props.checklist.id).update({ tasks: this.props.checklist.tasks});

}

processDelete = (e) => {

    e.preventDefault();

    const fireStore = getFirestore();
    // let reference = fireStore.collection('checklists').doc(this.props.checklist.id);

    let index = this.props.checklist.tasks.map(function (task) {return task.key;}).indexOf(this.props.task.key);

    this.props.checklist.tasks.splice(index, 1);
    fireStore.collection("checklists").doc(this.props.checklist.id).update({ tasks: this.props.checklist.tasks});

    this.setState({goList : true});

    }

checkColor = () => {

    let index = this.props.checklist.tasks.map(function (task) {return task.key;}).indexOf(this.props.task.key);
    if (index === this.props.checklist.tasks.length - 1) {
        document.getElementById("item_button2").style.backgroundColor = "gray";
        }
    }

    render() {
        
        if (this.state.goList) {
            return <Redirect to={"/checklist/" + this.props.checklist.id} />
        }

        const { task } = this.props;  
        let { completedValue } = "";
        let { style_card } = "";
        
        if (task.completed === true) {
            completedValue = "Completed";
            style_card = "style_green";
        }
        else {
            completedValue = "Pending";
            style_card = "style_red";
        }

        let moveUpClass = "item_button3";
        let moveDownClass = "item_button2";
        let index = this.props.checklist.tasks.map(function (task) {return task.key;}).indexOf(this.props.task.key);
        if (index === 0)
            moveUpClass += " disabled";
        if (index === (this.props.checklist.tasks.length - 1))
            moveDownClass += " disabled";


        return (

            <div className="white card todo-list-link pink-lighten-3">

            <div className="row">

                <div className="card-content grey-text text-darken-3">
                    <span className="col s12" id="description" >{task.description} </span>
                    <span className="col s3" id="assigned_to"> Assigned to: {task.assigned_to}</span>
                    <span id="due_date" >{task.due_date} </span>
                    <span id="completed" className={style_card}> {completedValue} </span>   
                </div>
                 
            </div>

            <Button id="floating_button" floating fab={{direction: 'left'}} className="green" large >
                <Button floating id="item_button1">
                    <Icon fontSize="large" onClick={this.processDelete}>close</Icon>
                </Button>
                <Button floating className={moveDownClass} >
                    <Icon fontSize="large" onClick={this.processMoveDown}>arrow_downward</Icon>
                </Button>
                <Button floating className={moveUpClass} >
                    <Icon fontSize="large" onClick={this.processMoveUp}>arrow_upward</Icon>
                </Button>
            </Button>

            {/* {this.checkColor()} */}
            </div>
        );
                }
}
export default TaskCard;