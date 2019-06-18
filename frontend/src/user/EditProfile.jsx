import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Avatar, Grid, Paper, Input } from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import { getUserById, editUser } from './apiUser';
import DefaultAvatar from '../image/avatar.png';
import { isAuthenticated } from '../auth/index';
import { Redirect } from 'react-router-dom';
import ReactLoading from 'react-loading';
import MenuAppbar from '../core/MenuAppbar';

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: 900,
        margin: 'auto'
    },
    button: {
        margin: 'auto'
    },
    inputImage: {
        display: 'none'
    },
    rightIcon: {
        marginLeft: theme.spacing.unit
    },
    avatar: {
        margin: 'auto',
        marginBottom: 10,
        width: 150,
        height: 150
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        background: '#f5f5f5',
        color: theme.palette.text.secondary
    },
    input: {
        margin: theme.spacing.unit
    },
    textError: {
        textAlign: 'left',
        color: theme.palette.error.main
    },
    label: {
        display: 'flex',
        alignItems: 'center'
    },
    buttonSubmit: {
        float: 'right',
        marginTop: 10
    }
});

class EditProfile extends Component {
    constructor() {
        super();
        this.state = {
            id: '',
            name: '',
            error: '',
            redirectToSignin: false,
            redirectToProfile: false,
            file: '',
            loading: false
        };
    }

    initUser = userId => {
        getUserById(userId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    id: data._id,
                    name: data.name
                });
            }
        });
    };

    isValid = () => {
        if (this.state.name.length === 0) {
            this.setState({ error: 'Name is required', loading: false });
            return false;
        }
        return true;
    };

    handleInputChange = name => event => {
        let files = event.target.files;
        if (name === 'photo') {
            if (files.length) {
                this.setState({
                    file: URL.createObjectURL(files[0])
                });
                this.userData.set(name, files[0]);
            }
            console.log(this.state.file);
        } else {
            let value = event.target.value;
            this.setState({ [name]: value, error: '' });
            this.userData.set(name, value);
        }
    };

    handleSubmit = e => {
        e.preventDefault();
        if (this.isValid()) {
            this.setState({ loading: true });
            editUser(
                this.userData,
                isAuthenticated().token,
                this.state.id
            ).then(data => {
                console.log(data);
                this.setState({ loading: false, redirectToProfile: true });
            });
        }
    };

    componentDidMount() {
        if (
            isAuthenticated() &&
            isAuthenticated().user._id === this.props.match.params.userId
        ) {
            this.userData = new FormData();
            this.initUser(this.props.match.params.userId);
        } else {
            this.setState({ redirectToSignin: true });
        }
    }

    render() {
        const { classes } = this.props;
        const photoUrl = this.state.id
            ? `${process.env.REACT_APP_API_URL}/user/photo/${
            this.state.id
            }?${new Date().getTime()}`
            : DefaultAvatar;
        if (this.state.loading) {
            return (
                <div
                    style={{
                        height: '100vh',
                        width: '100%'
                    }}
                >
                    <ReactLoading
                        type="spokes"
                        color="grey"
                        style={{
                            position: 'relative',
                            left: '50%',
                            top: '50%',
                            height: '100px',
                            width: '100px',
                            transform: 'translate(-50%, -50%)'
                        }}
                    />
                </div>
            );
        }
        if (this.state.redirectToSignin) {
            return <Redirect to="/signin" />;
        }
        if (this.state.redirectToProfile) {
            return <Redirect to={'/user/' + this.state.id} />;
        }
        return (
            <div>
                <MenuAppbar />
                <div className="mt-64">
                    <Grid container spacing={16} className={classes.root}>
                        <Grid item xs={3}>
                            <Paper className={classes.paper}>
                                <Avatar
                                    alt={isAuthenticated().user.name}
                                    src={
                                        this.state.file
                                            ? this.state.file
                                            : photoUrl
                                    }
                                    onError={i => {
                                        i.target.src = DefaultAvatar;
                                    }}
                                    className={classes.avatar}
                                />
                                <input
                                    accept="image/*"
                                    className={classes.inputImage}
                                    id="contained-button-file"
                                    onChange={this.handleInputChange('photo')}
                                    multiple
                                    type="file"
                                />
                                <label htmlFor="contained-button-file">
                                    <Button
                                        variant="contained"
                                        color="default"
                                        component="span"
                                        className={classes.button}
                                    >
                                        Upload
                                        <CloudUpload
                                            className={classes.rightIcon}
                                        />
                                    </Button>
                                </label>
                            </Paper>
                        </Grid>
                        <Grid item xs={9}>
                            <Paper className={classes.paper}>
                                <Grid container className={classes.inputField}>
                                    <Grid item xs={2} className={classes.label}>
                                        <label>
                                            <h3>Name:</h3>
                                        </label>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <Input
                                            fullWidth
                                            onChange={this.handleInputChange(
                                                'name'
                                            )}
                                            value={
                                                this.state.name
                                                    ? this.state.name
                                                    : ''
                                            }
                                            className={classes.input}
                                            inputProps={{
                                                'aria-label': 'Description'
                                            }}
                                        />
                                    </Grid>
                                    <div className={classes.textError}>
                                        {this.state.error
                                            ? this.state.error
                                            : ''}
                                    </div>
                                </Grid>
                            </Paper>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleSubmit}
                                className={classes.buttonSubmit}
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

EditProfile.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EditProfile);
