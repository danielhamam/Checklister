import React from 'react';
// import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import {Button} from 'react-materialize';
import Icon from '@material-ui/core/Icon';
import { Redirect } from 'react-router-dom'

class TaskCard extends React.Component {
    state = { goList : false, }

    processMovePos = (event, direction) => {
        event.preventDefault();
        const fireStore = getFirestore();
        let targetIndex = this.props.checklist.tasks.map(function (task) {return task.key;}).indexOf(this.props.task.key);
        let otherTargetIndex = direction !== 'down' ? targetIndex - 1 : targetIndex + 1; 
        this.props.checklist.tasks[targetIndex] = this.props.checklist.tasks.splice(otherTargetIndex, 1, this.props.checklist.tasks[targetIndex])[0];
        fireStore.collection("accounts").doc(this.props.authUid).collection("checklists").doc(this.props.checklist.id).update({ tasks: this.props.checklist.tasks});
    }

    processDelete = (e) => {
        e.preventDefault();
        const fireStore = getFirestore();
        let targetIndex = this.props.checklist.tasks.map(function (task) {return task.key;}).indexOf(this.props.task.key);
        this.props.checklist.tasks.splice(targetIndex, 1);
        fireStore.collection("accounts").doc(this.props.authUid).collection("checklists").doc(this.props.checklist.id).update({ tasks: this.props.checklist.tasks});
        this.setState({goList : true});
    }

    checkColor = () => {

        let index = this.props.checklist.tasks.map(function (task) {return task.key;}).indexOf(this.props.task.key);
        if (index === this.props.checklist.tasks.length - 1) {
            document.getElementById("item_button2").style.backgroundColor = "gray";
            }
        }

    render() {
        
        if (this.state.goList) return <Redirect to={"/checklist/" + this.props.checklist.id} />

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

        let moveUpClass = "item_button_up";
        let moveDownClass = "item_button_down";
        let index = this.props.checklist.tasks.map(function (task) {return task.key;}).indexOf(this.props.task.key);
        if (index === 0)
            moveUpClass += " disabled";
        if (index === (this.props.checklist.tasks.length - 1))
            moveDownClass += " disabled";

        return (
            <div className="white card todo-list-link pink-lighten-3">
                <div className="row">
                    <div className="card-content grey-text text-darken-3">
                        <span className='description col s12' >{task.description} </span>
                        <span className='assigned_to col s4'> Assigned to: {task.assigned_to}</span>
                        <span className='due_date col s4' >{task.due_date} </span>
                        <span className={'completed ' + style_card + ' col s1'}> {completedValue} </span>   
                    </div>
                    <Button id="floating_button" floating fab={{direction: 'left'}} className="green" large > </Button>
                    <Button floating className="item_button item_button_delete">
                        <Icon fontSize="large" onClick={this.processDelete}>close</Icon>
                    </Button>
                    <Button floating className={"item_button " + moveDownClass} >
                        <Icon fontSize="large" onClick={(e) => this.processMovePos(e, 'down')}>arrow_downward</Icon>
                    </Button>
                    <Button floating className={"item_button " + moveUpClass} >
                        <Icon fontSize="large" onClick={(e) => this.processMovePos(e, 'up')}>arrow_upward</Icon>
                    </Button>
                </div>
            </div>
        );
    }
}
export default TaskCard;