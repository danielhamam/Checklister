import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import TodoListCard from './TodoListCard';
import { getFirestore } from 'redux-firestore';

class TodoListLinks extends React.Component {

    render() {
        const todoLists = this.props.todoLists;
        console.log(todoLists);
        return (
            <div className="todo-lists section">
                {todoLists && todoLists.map(todoList => (
                    <Link to={'/todoList/' + todoList.id} key={todoList.id} >
                        <TodoListCard todoList={todoList}/>
                    </Link>
                ))}
            </div>
        );
    }
}

// Each component is deciding which things it wants from the store, and we're deciding it right here. 
const mapStateToProps = (state) => { // Give me the following things from the database: 
    return {
        todoLists: state.firestore.ordered.todoLists, //.ordered something we can map through. 
        auth: state.firebase.auth,
    };
};

export default compose(connect(mapStateToProps))(TodoListLinks); // makes todolist available as a prop.