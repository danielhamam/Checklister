import React from 'react'
import { connect } from 'react-redux';
import accountJson from './TestChecklisterData.json'
import { getFirestore } from 'redux-firestore';
import { firebaseConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
// import { firestore } from 'firebase';

class AdminScreen extends React.Component {
    state = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        goHome : false,
        administator : false
      }
    // NOTE, BY KEEPING THE DATABASE PUBLIC YOU CAN
    // DO THIS ANY TIME YOU LIKE WITHOUT HAVING
    // TO LOG IN
    
    goHome = () => {
        this.setState({goHome : true});
      }

    /*
    * Clears all checklists in all accounts 
    */
    handleClear = () => {
        const fireStore = getFirestore();
        fireStore.collection('accounts').get()
            .then((querySnapshot) => {
                querySnapshot.forEach((account) => {
                    console.log('account: ', account);
                    fireStore.collection('accounts').doc(account.id).collection('checklists').get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((checklist) => {
                                console.log('deleting checklist: ', checklist.data());
                                fireStore.collection('accounts').doc(account.id).collection('checklists').doc(checklist.id).delete();
                            })
                        })
                });
        })
    }

    /*
    * Clears all checklists in all accounts 
    */
    clearAllChecklists = () => {
        console.log('AdminScreen.clearAllChecklists: clearing all checklists part of every account......');
        const fireStore = getFirestore();
        fireStore.collection('accounts').get()
            .then((querySnapshot) => {
                querySnapshot.forEach((account) => {
                    fireStore.collection('accounts').doc(account.id).collection('checklists').get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((checklist) => {
                                fireStore.collection('accounts').doc(account.id).collection('checklists').doc(checklist.id).delete();
                        })
                    })
                })
            })
    }
    
    handleReset = () => {
        this.handleClear(); // clears database
        const fireStore = getFirestore();
        const { firebase } = this.props;
        accountJson.accounts.forEach(accountJson => {
            firebase.auth().createUserWithEmailAndPassword(
                accountJson.email,
                accountJson.password
            ).then((resp) => {
                fireStore.collection('accounts').doc(resp.user.uid).set({
                    administrator : accountJson.administrator,
                    created_time: accountJson.created_time,
                }).then(() => {
                    accountJson.checklists.forEach(checklist => {
                        fireStore.collection('accounts').doc(resp.user.uid).collection('checklists').add({
                            name: checklist.name,
                            owner: checklist.owner,
                            created_time: checklist.created_time,
                            tasks : checklist.tasks
                        })
                    })
                });
            }).catch((err) => {
                console.log('adminScreen.registerHandler, error with registration: ', err.message);
            })
        })
    }

    checkAdministrator = () => {

        const fireStore = getFirestore();
        let reference = fireStore.collection('accounts').doc(this.props.auth.uid).get();
      
        reference.then(
        doc => {
          let info = doc.data();
          if (info.administrator === true) {
            this.setState({ administrator : true});
            // this.setState({administrator : true});
          }
          else {
            this.setState({ administrator : false});
          }
          }
        )
      }

    render() {

        if (this.state.goHome) {
            return <Redirect to="/" />;
          }

        if (!this.props.auth.uid) {
            return <Redirect to="/" />;
        }

        // if (this.state.administrator === false) {
        //     return <Redirect to="/" />;
        // }

        return ( 
            <div id="admin_wrapper">
                <div id="admin_options">
                  <button id="return_home" className="handle_button" onClick={this.goHome}> Return Home </button>
                  <button id="clear_checklists" className="handle_button" onClick={this.clearAllChecklists}> Clear All Checklists </button>
                  {/* <button id="reset_database" className="handle_button" onClick={this.handleReset}>Reset to Sample Database</button> */}
                  {/* <button id="clear_database" className="handle_button" onClick={this.handleClear}>Clear Database</button> */}
                  {/* <button id="clear_database" className="handle_button" onClick={this.handleClear}>Clear Database</button> */}
                </div>
                <div id="admin_notes"> 
                    THIS PAGE IS FOR ADMINISTRATORS ONLY!
                    <br/>
                    <br/>
                    Please be cautious when clearing the database. It will wipe the data of NON-ADMINS as dictated in the firestore. 
                    <br/>
                    <br/>
                    As for the Reset button, default users will be loaded into the database for testing purposes. 
                    <br/>
                    <br/>
                    For any questions, please contact danielhamam@outlook.com. Enjoy the
                    use of your controls as an administrative designer!
                </div>
            </div>)
    }
}

const mapStateToProps = state => ({
    auth: state.firebase.auth,
    authError: state.auth.authError,
  });

const mapDispatchToProps = dispatch => ({
    // register: (newUser, firebase) => dispatch(registerHandler(newUser, firebase)),
  });
  

  export default compose(
    firebaseConnect(),
    connect(mapStateToProps, mapDispatchToProps),
  )(AdminScreen);