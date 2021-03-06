import React, { useState } from 'react';
import { Route, Switch, useHistory, Redirect } from 'react-router-dom';
import {
  Login,
  Patients,
  PatientInfo,
  Requests,
  Doctors,
  Administration,
  Profile
} from './containers';
import { Header } from './components';
import { CssBaseline, makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { actions } from './redux/actions';
import AddDoctor from './containers/AddDoctor';
import EditPatient from './containers/EditPatient';
import DoctorInfo from './containers/DoctorInfo';
import EditDoctor from './containers/EditDoctor';
import AttachIoT from './containers/AttachIoT';

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    backgroundColor: '#eee'
  }
});

const App = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  let isAuthed = false;

  const tryLogin = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      history.push('/login');
    } else {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        dispatch(actions.user.setUser(user));
        dispatch(actions.user.setToken(token));
        isAuthed = true;
      } catch (e) {
        history.push('/login');
      }
    }
  };

  useState(() => {
    tryLogin();
  }, []);

  let routes = (
    <>
      <Route exact path='/login' component={Login} />
      <Redirect to='/login' />
    </>
  );

  if (isAuthed) {
    routes = (
      <>
        <Route exact path='/patients' component={Patients} />
        <Route exact path='/patientinfo/:id' component={PatientInfo} />
        <Route exact path='/edit-patient/:id' component={EditPatient} />
        <Route exact path='/requests' component={Requests} />
        <Route exact path='/doctors' component={Doctors} />
        <Route exact path='/profile' component={Profile} />
        <Route exact path='/administration' component={Administration} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/add-doctor' component={AddDoctor} />
        <Route exact path='/doctorinfo/:id' component={DoctorInfo} />
        <Route exact path='/edit-doctor/:id' component={EditDoctor} />
        <Route exact path='/attach-iot/:patientId' component={AttachIoT} />
        <Redirect from='/' to='/patients' />
      </>
    );
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header />
      <Switch>{routes}</Switch>
    </div>
  );
};

export default App;
