import React from 'react';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import {Button} from 'react-materialize';
import Icon from '@material-ui/core/Icon';
import { Redirect } from 'react-router-dom'

class ItemCard extends React.Component {

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
    let original_key = this.props.item.key;

    let first_index = this.props.todoList.items.map(function (item) {return item.key;}).indexOf(original_key);
    let second_index = first_index - 1; // Above

    // First item:
    let first_item = {
        description: this.props.todoList.items[first_index].description,
        due_date: this.props.todoList.items[first_index].due_date,
        assigned_to: this.props.todoList.items[first_index].assigned_to,
        completed: this.props.todoList.items[first_index].completed,
        key : original_key
    }

    // Second item:
    let second_item = {
        description: this.props.todoList.items[second_index].description,
        due_date: this.props.todoList.items[second_index].due_date,
        assigned_to: this.props.todoList.items[second_index].assigned_to,
        completed: this.props.todoList.items[second_index].completed,
        key : this.props.todoList.items[second_index].key
    }

    // Swap 

    this.props.todoList.items.splice(first_index, 1);
    this.props.todoList.items.splice(second_index, 1);

    this.props.todoList.items.splice(second_index, 0, first_item);
    this.props.todoList.items.splice(first_index, 0, second_item);

    const fireStore = getFirestore();
    fireStore.collection("todoLists").doc(this.props.todoList.id).update({ items: this.props.todoList.items});


    // this.setState({goList : true}); // re render

}

processMoveDown = (e) => {

    e.preventDefault();
    let original_key = this.props.item.key;

    let first_index = this.props.todoList.items.map(function (item) {return item.key;}).indexOf(original_key);
    let second_index = first_index + 1; // Below

    // First item:
    let first_item = {
        description: this.props.todoList.items[first_index].description,
        due_date: this.props.todoList.items[first_index].due_date,
        assigned_to: this.props.todoList.items[first_index].assigned_to,
        completed: this.props.todoList.items[first_index].completed,
        key : original_key
    }

    // Second item:
    let second_item = {
        description: this.props.todoList.items[second_index].description,
        due_date: this.props.todoList.items[second_index].due_date,
        assigned_to: this.props.todoList.items[second_index].assigned_to,
        completed: this.props.todoList.items[second_index].completed,
        key : this.props.todoList.items[second_index].key
    }

    // Swap 

    this.props.todoList.items.splice(first_index, 1);
    this.props.todoList.items.splice(second_index, 1);

    this.props.todoList.items.splice(first_index, 0, second_item);
    this.props.todoList.items.splice(second_index, 0, first_item);

    const fireStore = getFirestore();
    fireStore.collection("todoLists").doc(this.props.todoList.id).update({ items: this.props.todoList.items});


}

processDelete = (e) => {

    e.preventDefault();

    const fireStore = getFirestore();
    let reference = fireStore.collection('todoLists').doc(this.props.todoList.id);

    let index = this.props.todoList.items.map(function (item) {return item.key;}).indexOf(this.props.item.key);

    this.props.todoList.items.splice(index, 1);
    fireStore.collection("todoLists").doc(this.props.todoList.id).update({ items: this.props.todoList.items});

    this.setState({goList : true});
}

    render() {
        if (this.state.goList) {
            return <Redirect to={"/todoList/" + this.props.todoList.id} />
        }

        const { item } = this.props;  
        let { completedValue } = "";
        let { style_card } = "";
        
        if (item.completed == true) {
            completedValue = "Completed";
            style_card = "style_green";
        }
        else {
            completedValue = "Pending";
            style_card = "style_red";
        }

        return (

            <div class="white card todo-list-link pink-lighten-3">
            <div class="row">

            <Button id="floating_button" floating fab={{direction: 'right'}} className="green" large >
                <Button floating className="red" >
                    <Icon fontSize="large" onClick={this.processDelete}>close</Icon>
                </Button>
                <Button floating className="purple">
                    <Icon fontSize="large" onClick={this.processMoveDown}>arrow_downward</Icon>
                </Button>
                <Button floating className="blue">
                    <Icon fontSize="large" onClick={this.processMoveUp}>arrow_upward</Icon>
                </Button>
            </Button>

                <div className="card-content grey-text text-darken-3">
                    <span class="col s12" id="description" >{item.description} </span>
                    <span class="col s3" id="assigned_to"> Assigned to: {item.assigned_to}</span>
                    <span id="due_date" >{item.due_date} </span>
                    <span id="completed" class = {style_card}> {completedValue} </span>   
                </div>
                 
            </div>
            </div>

            
        );
                }
}
export default ItemCard;