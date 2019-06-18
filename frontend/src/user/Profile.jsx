import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Avatar, Grid, Paper } from '@material-ui/core';
import { getUserById } from './apiUser';
import DefaultAvatar from '../image/avatar.png';
import { isAuthenticated } from '../auth/index';
import AddCircleOutlineWhite from '../image/outline_add_circle_white_18dp.png';
import MenuAppbar from '../core/MenuAppbar';

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: 900,
        margin: 'auto'
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
        color: theme.palette.text.secondary,
        background: '#f5f5f5'
    },
    paperInfo: {
        padding: 32,
        color: theme.palette.text.secondary,
        background: '#f5f5f5'
    },
    textError: {
        textAlign: 'left',
        color: theme.palette.error.main
    },
    leftIcon: {
        marginRight: 8
    },
    follow: {
        textAlign: 'center'
    }
});

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            user: []
        };
    }

    initUser = userId => {
        getUserById(userId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    user: data
                });
            }
        });
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.userId !== this.props.match.params.userId) {
            this.initUser(this.props.match.params.userId);
        }
    }

    componentDidMount() {
        this.initUser(this.props.match.params.userId);
    }

    render() {
        const { classes } = this.props;
        const { user } = this.state;
        const photoUrl = `${process.env.REACT_APP_API_URL}/user/photo/${
            user._id
        }?${new Date().getTime()}`;
        const renderField = (name, value) => {
            return (
                <div>
                    <span style={{ fontWeight: 'bold' }}>{name}:</span> {value}{' '}
                </div>
            );
        };
        return (
            <div>
                <MenuAppbar />
                <div className="mt-64">
                    <Grid container spacing={16} className={classes.root}>
                        <Grid item xs={3}>
                            <Paper className={classes.paper}>
                                <Avatar
                                    alt={isAuthenticated().user.name}
                                    src={photoUrl}
                                    onError={i => {
                                        i.target.src = DefaultAvatar;
                                    }}
                                    className={classes.avatar}
                                />
                                {isAuthenticated().user._id !==
                                    this.props.match.params.userId && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component="span"
                                    >
                                        <img
                                            src={AddCircleOutlineWhite}
                                            alt="Follow"
                                            className={classes.leftIcon}
                                        />
                                        <span style={{ color: '#fff' }}>
                                            Follow
                                        </span>
                                    </Button>
                                )}
                            </Paper>
                        </Grid>
                        <Grid item xs={9}>
                            <Paper className={classes.paperInfo}>
                                <h2
                                    style={{
                                        color: 'black',
                                        margin: 0,
                                        marginBottom: 8
                                    }}
                                >
                                    {user.name}
                                </h2>
                                <br />
                                {renderField('Email', user.email)}
                                <br />
                                {renderField(
                                    'Joined',
                                    new Date(user.created).toDateString()
                                )}
                                <br />
                                <hr />
                                <Grid container>
                                    <Grid
                                        className={classes.follow}
                                        item
                                        xs={6}
                                    >
                                        <h1 style={{ color: 'black' }}>
                                            <strong>
                                                {user.followers
                                                    ? user.followers.length
                                                    : ''}
                                            </strong>
                                        </h1>
                                        Followers
                                    </Grid>
                                    <Grid
                                        className={classes.follow}
                                        item
                                        xs={6}
                                    >
                                        <h1 style={{ color: 'black' }}>
                                            <strong>
                                                {user.following
                                                    ? user.following.length
                                                    : ''}
                                            </strong>
                                        </h1>
                                        Following
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Profile);
