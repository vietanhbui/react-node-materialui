import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography, TextField, Grid, Paper, Button } from '@material-ui/core';
import { signin } from './apiUser';
import { Redirect } from 'react-router-dom';
import { authenticate } from '../auth/index';

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary
    },
    form: {
        margin: 'auto',
        maxWidth: '800px'
    },
    textField: {
        // maxWidth: '600px'
    },
    title: {
        marginBottom: '50px',
        marginTop: '20px'
    },
    button: {
        float: 'right'
    },
    input: {
        maxWidth: '600px',
        margin: 'auto'
    },
    textError: {
        textAlign: 'left',
        color: theme.palette.error.main
    },
    textSuccess: {
        textAlign: 'left',
        color: theme.palette.text.secondary
    },
    submit: {
        marginTop: '20px',
        height: '250px'
    }
});


class Signin extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            name: '',
            password: '',
            error: '',
            redirectToHome: false
        };
    }

    handleInputChange = name => event => {
        this.setState({
            [name]: event.target.value,
            error: ''
        });
    };

    handleSubmit = () => {
        let { email, password } = this.state;
        let user = { email, password };
        signin(user).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                authenticate(data);
                this.setState({
                    email: '',
                    password: '',
                    error: '',
                    redirectToHome: true
                });
            }
        });
    };

    render() {
        const { classes } = this.props;
        if (this.state.redirectToHome) {
            return <Redirect to="/" />;
        }
        return (
            <div className={classes.root}>
                <Grid className={classes.form}>
                    <Paper className={classes.paper}>
                        <Typography
                            variant="h2"
                            gutterBottom
                            color="inherit"
                            className={classes.title}
                        >
                            Sign in
                        </Typography>
                        <div className={classes.input}>
                            <TextField
                                id="filled-email-input"
                                label="Email"
                                className={classes.textField}
                                type="email"
                                name="email"
                                value={this.state.email}
                                onChange={this.handleInputChange('email')}
                                fullWidth
                                autoComplete="email"
                                margin="normal"
                                variant="filled"
                            />
                            <br />
                            <TextField
                                id="filled-password-input"
                                label="Password"
                                name="password"
                                value={this.state.password}
                                className={classes.textField}
                                onChange={this.handleInputChange('password')}
                                type="password"
                                fullWidth
                                autoComplete="current-password"
                                margin="normal"
                                variant="filled"
                            />
                            <br />
                            <Grid container className={classes.submit}>
                                <Grid item xs={8}>
                                    <div className={classes.textError}>
                                        {this.state.error
                                            ? this.state.error
                                            : ''}
                                    </div>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.handleSubmit}
                                        className={classes.button}
                                    >
                                        Sign in
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Paper>
                </Grid>
            </div>
        );
    }
}

Signin.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Signin);
