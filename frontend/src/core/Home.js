import React, { Component } from 'react';
import CreatePost from '../post/CreatePost';
import SinglePost from '../post/SinglePost';
import { Grid, Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { isAuthenticated } from '../auth';
import { getAllPosts } from '../post/apiPost';
import MenuAppbar from './MenuAppbar';

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: 900,
        margin: 'auto'
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary
    },
    form: {
        margin: 'auto',
        maxWidth: '800px',
        marginTop: 64
    }
});

class Home extends Component {
    constructor() {
        super();
        this.state = {
            posts: []
        };
    }

    initPosts = () => {
        getAllPosts(isAuthenticated().token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ posts: data });
            }
        });
    };

    componentDidMount() {
        this.initPosts();
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <MenuAppbar />
                <Grid className={classes.form} container spacing={8}>
                    <Grid item xs={8}>
                        <Paper>
                            <CreatePost />
                        </Paper>
                        {/* {this.state.posts.reverse().map((post, index) => {
                            return <SinglePost post={post} key={index} />;
                        })} */}
                    </Grid>
                    <Grid item xs={4}>
                        <Paper className={classes.paper}>
                            Add friend
                            <br />
                            Add friend
                            <br />
                            Add friend
                            <br />
                            Add friend
                            <br />
                            Add friend
                            <br />
                            Add friend
                            <br />
                            Add friend
                            <br />
                            Add friend
                            <br />
                            Add friend
                            <br />
                            Add friend
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);
