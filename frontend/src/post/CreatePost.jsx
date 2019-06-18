import React, { Component } from 'react';
import { InputBase, Button, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { isAuthenticated } from '../auth/index';
import { CloudUpload } from '@material-ui/icons';
import { createPost } from './apiPost';

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    title: {
        height: '30px',
        lineHeight: '30px',
        background: '#f5f6f7',
        paddingLeft: 10
    },
    hr: {
        margin: 0
    },
    buttonUpload: {
        marginRight: 10
    },
    form: {
        padding: 10
    },
    inputImage: {
        display: 'none'
    },
    rightIcon: {
        marginLeft: theme.spacing.unit
    },
    button: {
        marginTop: 10
    },
    imgPost: {
        height: 100,
        width: 'auto'
    }
});

class CreatePost extends Component {
    constructor() {
        super();
        this.state = {
            image: '',
            content: '',
            file: ''
        };
    }

    handleSubmit = () => {
        createPost(
            this.postData,
            isAuthenticated().token,
            isAuthenticated().user._id
        ).then(data => {
            window.location.reload();
        });
    };

    handleInputChange = name => event => {
        if (name === 'photo') {
            this.setState({
                file: URL.createObjectURL(event.target.files[0]),
                image: event.target.files[0]
            });
        } else {
            this.setState({ content: event.target.value });
        }
        const value =
            name === 'photo' ? event.target.files[0] : event.target.value;
        this.postData.set(name, value);
    };

    componentDidMount() {
        this.postData = new FormData();
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.title}>Create Post</div>
                <hr className={classes.hr} />
                <div className={classes.form}>
                    <InputBase
                        fullWidth
                        multiline
                        value={this.state.content}
                        placeholder={`What's on your mind, ${
                            isAuthenticated().user.name
                        }?`}
                        onChange={this.handleInputChange('content')}
                    />
                    {this.state.image ? (
                        <img
                            alt="Remy Sharp"
                            src={this.state.file}
                            className={classes.imgPost}
                        />
                    ) : (
                        ''
                    )}
                    <Grid container>
                        <Grid item xs={6} />
                        <Grid item xs={6} className={classes.button}>
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
                                    className={classes.buttonUpload}
                                >
                                    Upload Image
                                    <CloudUpload
                                        className={classes.rightIcon}
                                    />
                                </Button>
                            </label>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={!this.state.content}
                                onClick={this.handleSubmit}
                            >
                                Post
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

CreatePost.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CreatePost);
