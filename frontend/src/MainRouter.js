import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './core/Home';
import Signup from './user/Signup';
import Signin from './user/Signin';
import Profile from './user/Profile';
import EditProfile from './user/EditProfile';

const MainRouter = () => {
    return (
        <div>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/signup" component={Signup} />
                <Route exact path="/signin" component={Signin} />
                <Route exact path="/user/:userId" component={Profile} />
                <Route exact path="/user/edit/:userId" component={EditProfile} />
            </Switch>
        </div>
    );
};

export default MainRouter;