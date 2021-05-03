import React from 'react';
import { getFirestore } from 'redux-firestore';

class TodoListCard extends React.Component {

    putListFirst = () => {

    // let initialKey = this.props.todoList.key;
    // this.props.todoList.key = 0;
    // let first_list = fireStore.collect

    //     const fireStore = getFirestore();
    //     fireStore.collection('todoLists').add({
    //             name: 'Unknown',
    //             owner: 'Unknown',
    //             items: [],
    // })

    }

    render() {

        const { todoList } = this.props;
        console.log("TodoListCard, todoList.id: " + todoList.id);
        return (
            <div className="card z-depth-0 todo-list-link">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title" onClick={this.putListFirst}> {todoList.name} </span>
                </div>
            </div>
        );
    }
}
export default TodoListCard;