import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { NavLink, Redirect } from 'react-router-dom';
import ItemCard from './ItemCard';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';

class ItemsList extends React.Component {
    state = {
        CurrentSortingCriteria: "",
        goItemScreen: false,
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
            this.props.todoList.items.sort(function(one,two) {
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
            this.props.todoList.items.sort(function(one,two) {
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
            this.props.todoList.items.sort(function(one,two) {
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
            this.props.todoList.items.sort(function(one,two) {
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
            this.props.todoList.items.sort(function(one,two) {
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
            this.props.todoList.items.sort(function(one,two) {
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

    addItem = () => {

        const fireStore = getFirestore();
        let reference = fireStore.collection('todoLists').doc(this.props.todoList.id);

        reference.update({
            'items': fireStore.FieldValue.arrayUnion({
                isOldItem: false,
                assigned_to: "Unknown",
                completed: false,
                description: "Unknown",
                due_date: "0000-00-00",
                key: this.props.todoList.items.length,
            })
        });

        // Add it to front end too
        const new_item = {
            isOldItem: false,
            assigned_to: "Unknown",
            completed: false,
            description: "Unknown",
            due_date: "0000-00-00",
            key: this.props.todoList.items.length,
        };
        this.props.todoList.items.push(new_item);

        // Make it navigate to edit screen of this new item. 

        this.setState({goItemScreen : true});

        // this.props.history.push() 
    
       }

    render() {
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }
        if (this.state.goItemScreen) {
            return <Redirect to={'/todoList/' + this.props.todoList.id + '/' + this.props.todoList.items[this.props.todoList.items.length - 1].key} />;
        }
        const todoList = this.props.todoList;
        const items = todoList.items;
        console.log("ItemsList: todoList.id " + todoList.id);
        return (

            <div className="todo-lists section">
            <div className="header_container">
                    <span className="list_item_task_header" onClick= {this.sortTask}> Task </span>
                    <span className="list_item_due_date_header" onClick= {this.sortDueDate}>Due Date</span>
                    <span className="list_item_status_header" onClick= {this.sortStatus}> Status </span>
            </div>
                              
                {items && items.map(item => (
                        <Link to={'/todoList/' + todoList.id + '/' + this.props.todoList.items.map(function (item) {return item.key;}).indexOf(item.key)} key={item.key} item={item}>
                            <ItemCard todoList={todoList} item={item} />
                        </Link>
                )
                    )
                } 
                    <div id="add_item" > 
                        <i class="material-icons large" onClick={this.addItem}> add_circle_outline</i>
                    </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const todoList = ownProps.todoList;
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
)(ItemsList);