import React from 'react';

class ItemCard extends React.Component {

    render() {
        const { item } = this.props;  
        
        let { completedValue } = "";
        if (item.completed == true) {
            completedValue = "Completed";
            // document.getElementById("completed").style.color = "green";
        }
        else {
            completedValue = "Pending";
            // document.getElementById("completed").style.color = "red";
        }

        return (

            <div class="white card todo-list-link pink-lighten-3">
            <div class="row">
                <div className="card-content grey-text text-darken-3">
                    <span class="col s12" id="description" >{item.description} </span>
                    <span class="col s3" id="assigned_to"> Assigned to: {item.assigned_to}</span>
                    <span id="due_date" >{item.due_date} </span>
                    <span id="completed"> {completedValue} </span>      
                 </div>

            </div>

            </div>
        );
    }
}
export default ItemCard;