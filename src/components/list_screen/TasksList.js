import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import TaskCard from './TaskCard';
// import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';

class TasksList extends React.Component {
    state = {
        CurrentSortingCriteria: "",
        goTaskScreenKey: -1,
        keytoUse: 10100,
    }

    ItemSortCriteria = {
        SORT_BY_TASK_INCREASING: "sort_by_task_increasing",
        SORT_BY_TASK_DECREASING: "sort_by_task_decreasing",
        SORT_BY_DUE_DATE_INCREASING: "sort_by_due_date_increasing",
        SORT_BY_DUE_DATE_DECREASING: "sort_by_due_date_decreasing",
        SORT_BY_STATUS_INCREASING: "sort_by_status_increasing",
        SORT_BY_STATUS_DECREASING: "sort_by_status_decreasing"
    };

    sortTask = () => {
        if (this.state.CurrentSortingCriteria === this.ItemSortCriteria.SORT_BY_TASK_INCREASING) {
            this.setState({CurrentSortingCriteria: this.ItemSortCriteria.SORT_BY_TASK_DECREASING})
            this.props.checklist.tasks.sort(function(one,two) {
                let first = one.description.toUpperCase();
                let second = two.description.toUpperCase();
                if (first < second) {
                    return -1; 
                }
                if (first > second) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
        } else {
            this.setState({CurrentSortingCriteria : this.ItemSortCriteria.SORT_BY_TASK_INCREASING}) 
            this.props.checklist.tasks.sort(function(one,two) {
                let first = one.description.toUpperCase();
                let second = two.description.toUpperCase();
                if (first < second) {
                    return 1;
                }
                if (first > second) {
                    return -1;
                }
                else {
                    return 0;
                }
                }
            )
        }
        const fireStore = getFirestore();
        fireStore.collection("accounts").doc(this.props.auth.uid).collection("checklists").doc(this.props.checklist.id).update({ tasks: this.props.checklist.tasks});
    }

    sortDueDate = () => {
        if (this.state.CurrentSortingCriteria === this.ItemSortCriteria.SORT_BY_DUE_DATE_INCREASING) {
            this.setState({CurrentSortingCriteria: this.ItemSortCriteria.SORT_BY_DUE_DATE_DECREASING})
            this.props.checklist.tasks.sort(function(one,two) {
                let first = one.due_date;
                let second = two.due_date;
                if (first < second) {
                    return -1; 
                }
                if (first > second) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
        } else {
            this.setState({CurrentSortingCriteria : this.ItemSortCriteria.SORT_BY_DUE_DATE_INCREASING}) 
            this.props.checklist.tasks.sort(function(one,two) {
                let first = one.due_date;
                let second = two.due_date;
                if (first < second) {
                    return 1;
                }
                if (first > second) {
                    return -1;
                }
                else {
                    return 0;
                }
                }
            )
        }
        const fireStore = getFirestore();
        fireStore.collection("accounts").doc(this.props.auth.uid).collection("checklists").doc(this.props.checklist.id).update({ tasks: this.props.checklist.tasks});
    }

    sortStatus = () => {
        if (this.state.CurrentSortingCriteria === this.ItemSortCriteria.SORT_BY_STATUS_INCREASING) {
            this.setState({CurrentSortingCriteria: this.ItemSortCriteria.SORT_BY_STATUS_DECREASING})
            this.props.checklist.tasks.sort(function(one,two) {
                let first = one.completed;
                let second = two.completed;
                if (first < second) {
                    return -1; 
                }
                if (first > second) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
        } else {
            this.setState({CurrentSortingCriteria : this.ItemSortCriteria.SORT_BY_STATUS_INCREASING}) 
            this.props.checklist.tasks.sort(function(one,two) {
                let first = one.completed;
                let second = two.completed;
                if (first < second) {
                    return 1;
                }
                if (first > second) {
                    return -1;
                }
                else {
                    return 0;
                }
                }
            )
        }
        const fireStore = getFirestore();
        fireStore.collection("accounts").doc(this.props.auth.uid).collection("checklists").doc(this.props.checklist.id).update({ tasks: this.props.checklist.tasks});
    }

    addTask = () => {
        const fireStore = getFirestore();
        let reference = fireStore.collection('accounts').doc(this.props.auth.uid).collection('checklists').doc(this.props.checklist.id);
        const new_item = {
            isOldItem: false,
            assigned_to: "Unknown",
            completed: false,
            description: "Unknown",
            due_date: "0000-00-00",
            key: Math.floor(Math.random() * 1000) + 100
        };
        reference.update({'tasks': fireStore.FieldValue.arrayUnion(new_item)});
        this.props.checklist.tasks.push(new_item); // Add it to front end too
        this.setState({goTaskScreenKey : this.props.checklist.tasks.length - 1}); // Make it navigate to edit screen of this new item. 
    }

    render() {

        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }
        if (this.state.goTaskScreenKey !== -1) {
            return <Redirect to={'/checklist/' + this.props.checklist.id + '/' + this.state.goTaskScreenKey} />;
        }
        const checklist = this.props.checklist ? this.props.checklist : null;
        const tasks = this.props.checklist ? checklist.tasks : [];
        
        return (

            <div className="checklists">
            <div className="header_container section row">
                    <span className="task_title title_task col s2" onClick= {this.sortTask}> <span style={{paddingLeft: '15px'}}> Task </span> </span>
                    <span className="task_title title_due_date offset-m1 col s4" onClick= {this.sortDueDate}> <span style={{paddingRight: '10px'}}> Due Date</span> </span>
                    <span className="task_title title_status col s3" onClick= {this.sortStatus}> <span style={{paddingRight: '10px'}}> Status </span> </span>
            </div>             
                {
                    tasks && tasks.map((task,index) => (
                            <Link to={'/checklist/' + checklist.id + '/' + index} key={task.key} task={task}>
                                <TaskCard checklist={checklist} task={task} authUid={this.props.auth.uid}/>
                            </Link>
                    ))
                }
                    <div id="add_item" > 
                        <i id="add_item_icon" className="material-icons large" onClick={this.addTask}> add_circle_outline</i>
                    </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const checklist = ownProps.checklist;
    return {
        checklist,
        auth: state.firebase.auth,
    };
};

export default compose(
    connect(mapStateToProps)
    (TasksList));