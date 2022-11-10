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
        let index = this.props.checklist.tasks.map(function (task) {return task.key;}).indexOf(this.props.task.key);
        let moveUpClass = "item_button_up" + (index === 0 ? " disabled" : "");
        let moveDownClass = "item_button_down" + (index === (this.props.checklist.tasks.length - 1) ? " disabled" : "");;
        return (
            <div className="task_dashboard white card todo-list-link pink-lighten-3">
                <div className="task_contents row">
                    <div className="card-content grey-text text-darken-3">
                        <span className='description col s12' >{task.description} </span>
                        <span className='assigned_to col s4'> Assigned to: {task.assigned_to}</span>
                        <span className='due_date col s4' >{task.due_date} </span>
                        <span className={'completed ' + (task.completed ? "style_green" : "style_red") + ' col s1'}> {task.completed ? "Completed" : "Pending"} </span>   
                        <div className="action_buttons_wrapper col s3"> 
                            <div className="action_buttons"> 
                                <span className='space_between_buttons'> </span>
                                <Button floating className={"floating_action_button " + moveUpClass} >
                                    <Icon fontSize="large" onClick={(e) => this.processMovePos(e, 'up')}>arrow_upward</Icon>
                                </Button>
                                <span className='space_between_buttons'> </span>
                                <Button floating className={"floating_action_button " + moveDownClass} >
                                    <Icon fontSize="large" onClick={(e) => this.processMovePos(e, 'down')}>arrow_downward</Icon>
                                </Button>
                                <span className='space_between_buttons'> </span>
                                <Button floating className="floating_action_button item_button_delete">
                                    <Icon fontSize="large" onClick={this.processDelete}>close</Icon>
                                </Button>
                                <span className='space_between_buttons'> </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default TaskCard;