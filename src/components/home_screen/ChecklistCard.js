import React from 'react';

class ChecklistCard extends React.Component {
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
        const { checklist } = this.props;
        // console.log("ChecklistCard.render -> checklist.id: " + checklist.id);
        return (
            <div className="todo_card card todo-list-link indigo lighten-5">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title" onClick={this.putListFirst}> {checklist.name} </span>
                </div>
            </div>
        );
    }
}
export default ChecklistCard;