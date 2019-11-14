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
    }

    sortTask = () => {
    //    this.setState({ CurrentSortingCriteria : "SORT_BY_TASK_INCREASING"});
    }

    sortDueDate = () => {

    }

    sortStatus = () => {

    }

    render() {
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
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
{/* 
                {items && items.map(function(item) {
                    item.id = item.key;
                    return (
                        <Link to={'/todoList/' + todoList.id + '/' + item.id} key={item.id}>
                            <ItemCard todoList={todoList} item={item} />
                        </Link>
                    );})
                } */}
                              
                {items && items.map(item => (
                        <Link to={'/todoList/' + todoList.id + '/' + item.key} key={item.key} item={item}>
                            <ItemCard todoList={todoList} item={item} />
                        </Link>
                )
                    )
                } 

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