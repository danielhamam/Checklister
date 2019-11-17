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

    e.preventDefault();

    const fireStore = getFirestore();
    let reference = fireStore.collection('todoLists').doc(this.props.todoList.id);

    // Swap keys
    let original_key = this.props.item.key;
    let first_index = this.props.todoList.items.indexOf(original_key);
    let item1_assigned_to = this.props.item.assigned_to;
    let item1_completed = this.props.item.completed;
    let item1_description = this.props.item.description;
    let item1_due_date = this.props.item.due_date

    let second_key = this.props.item.key - 1;
    let second_index = this.props.todoList.items.indexOf(second_key);
    let item2_assigned_to = this.props.todoList.items[second_key].assigned_to;
    let item2_completed = this.props.todoList.items[second_key].completed;
    let item2_description = this.props.todoList.items[second_key].description;
    let item2_due_date = this.props.todoList.items[second_key].due_date;

    // Delete both then add back with new keys:
    // Delete from firestore:
    
    // Item 1 DELETE: (Original)
        reference.update({
            'items': fireStore.FieldValue.arrayRemove({
                assigned_to: this.props.item.assigned_to,
                completed: this.props.item.completed,
                description: this.props.item.description,
                due_date: this.props.item.due_date,
                key: this.props.item.key,
            })
        });
    // Item 2 DELETE: (ABOVE)
        reference.update({
            'items': fireStore.FieldValue.arrayRemove({
                assigned_to: this.props.todoList.items[second_key].assigned_to,
                completed: this.props.todoList.items[second_key].completed,
                description: this.props.todoList.items[second_key].description,
                due_date: this.props.todoList.items[second_key].due_date,
                key: this.props.todoList.items[second_key].key,
            })
        });
        // Item 1 ADD (Replace with above key) Item 1 = Item 2
        reference.update({
            'items': fireStore.FieldValue.arrayUnion({
                assigned_to: item1_assigned_to,
                completed: item1_completed,
                description: item1_description,
                due_date: item1_due_date,
                key: second_key,
            })
        });
        // Item 1 ADD (Replace with above key) Item 2 = Item 1
        reference.update({
            'items': fireStore.FieldValue.arrayUnion({
                assigned_to: item2_assigned_to,
                completed: item2_completed,
                description: item2_description,
                due_date: item2_due_date,
                key: original_key,
            })
        });
        
        this.props.todoList.items.sort(function(a, b) {
            return parseFloat(a.key) - parseFloat(b.key);
        });



}

processMoveDown = (e) => {

    e.preventDefault();

    const fireStore = getFirestore();
    let reference = fireStore.collection('todoLists').doc(this.props.todoList.id);

    this.setState({goList : true});

}

processDelete = (e) => {

    e.preventDefault();

    const fireStore = getFirestore();
    let reference = fireStore.collection('todoLists').doc(this.props.todoList.id);

    // Delete from firestore:
    reference.update({
        'items': fireStore.FieldValue.arrayRemove({
            assigned_to: this.props.item.assigned_to,
            completed: this.props.item.completed,
            description: this.props.item.description,
            due_date: this.props.item.due_date,
            key: this.props.item.key
        })
    });
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