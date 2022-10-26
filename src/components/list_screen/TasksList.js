import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { NavLink, Redirect } from 'react-router-dom';
import TaskCard from './TaskCard';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';

class TasksList extends React.Component {
    state = {
        CurrentSortingCriteria: "",
        goItemScreenKey: -1,
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
            this.props.checklist.items.sort(function(one,two) {
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
            this.props.checklist.items.sort(function(one,two) {
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
            )}
    }

    sortDueDate = () => {

        if (this.state.CurrentSortingCriteria === this.ItemSortCriteria.SORT_BY_DUE_DATE_INCREASING) {
            this.setState({CurrentSortingCriteria: this.ItemSortCriteria.SORT_BY_DUE_DATE_DECREASING})
            this.props.checklist.items.sort(function(one,two) {
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
            this.props.checklist.items.sort(function(one,two) {
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
            )}

    }

    sortStatus = () => {

        if (this.state.CurrentSortingCriteria === this.ItemSortCriteria.SORT_BY_STATUS_INCREASING) {
            this.setState({CurrentSortingCriteria: this.ItemSortCriteria.SORT_BY_STATUS_DECREASING})
            this.props.checklist.items.sort(function(one,two) {
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
            this.props.checklist.items.sort(function(one,two) {
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
            )}

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
        this.setState({goItemScreenKey : new_item.key}); // Make it navigate to edit screen of this new item. 
    }

    render() {

        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }
        if (this.state.goItemScreenKey != -1) {
            return <Redirect to={'/checklist/' + this.props.checklist.id + '/' + this.state.goItemScreenKey} />;
        }
        const checklist = this.props.checklist ? this.props.checklist : null;
        const tasks = this.props.checklist ? checklist.tasks : [];
        
        return (

            <div className="todo-lists section">
            <div className="header_container">
                    <span className="list_item_task_header" onClick= {this.sortTask}> Task </span>
                    <span className="list_item_due_date_header" onClick= {this.sortDueDate}>Due Date</span>
                    <span className="list_item_status_header" onClick= {this.sortStatus}> Status </span>
            </div>
                              
                {tasks && tasks.map((task,index) => (
                        <Link to={'/checklist/' + checklist.id + '/' + index} key={task.key} task={task}>
                            <TaskCard checklist={checklist} task={task} />
                        </Link>
                )
                    )
                }
                    <div id="add_item" > 
                        <i class="material-icons large" onClick={this.addTask}> add_circle_outline</i>
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