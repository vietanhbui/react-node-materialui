import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Typography,
    TextField,
    Grid,
    Paper,
    Button,
    Link
} from '@material-ui/core';
import { signup } from './apiUser';

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
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

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            name: '',
            password: '',
            error: '',
            success: false,
        };
    }

    handleInputChange = name => event => {
        this.setState({
            [name]: event.target.value,
            error: ''
        });
    };

    handleSubmit = () => {
        let { email, name, password } = this.state;
        let user = { email, name, password };
        signup(user).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({
                    success: true,
                    email: '',
                    name: '',
                    password: '',
                    error: ''
                });
            }
        });
    };

    render() {
        const { classes } = this.props;
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
                            Sign up
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
                                id="filled-name"
                                label="Name"
                                name="name"
                                value={this.state.name}
                                fullWidth
                                className={classes.textField}
                                onChange={this.handleInputChange('name')}
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
                                    <div
                                        className={classes.textSuccess}
                                        style={{
                                            display: this.state.success
                                                ? ''
                                                : 'none'
                                        }}
                                    >
                                        Sign up success, please{' '}
                                        <Link href="/signin">Sign In</Link>
                                    </div>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.handleSubmit}
                                        className={classes.button}
                                    >
                                        Sign up
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

Signup.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Signup);
