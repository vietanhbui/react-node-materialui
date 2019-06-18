import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { CardHeader, TextField, Avatar } from '@material-ui/core';
import DefaultAvatar from '../image/avatar.png';
import { Link } from 'react-router-dom';
import { comment, uncomment } from './apiPost';
import { isAuthenticated } from '../auth';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';

const styles = theme => ({
    card: {
        marginTop: 8
    },
    media: {
        height: 0,
        paddingTop: '56.25%' // 16:9
    },
    actions: {
        display: 'flex'
    },
    avatar: {
        backgroundColor: 'rgba(0, 0, 0, 0.53)'
    },
    hr: {
        margin: 0,
        borderColor: 'rgba(0, 0, 0, 0.1)'
    }
});

class Comment extends React.Component {
    constructor() {
        super();
        this.state = {
            text: '',
            comments: []
        };
    }

    handleChange = e => {
        e.preventDefault();
        this.setState({ text: e.target.value });
    };

    handleSubmit = e => {
        e.preventDefault();
        if (this.state.text) {
            comment(
                isAuthenticated().user._id,
                this.props.post._id,
                isAuthenticated().token,
                this.state.text
            ).then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    console.log(data);
                    this.setState({ text: '' });
                    this.setState({ comments: data.comments.reverse() });
                }
            });
        }
    };

    deleteConfirm = comment => {
        let answer = window.confirm(
            'Are you sure you want to delete this comment?'
        );
        if (answer) {
            this.handleDeleteComment(comment);
        }
    };

    handleDeleteComment = comment => {
        uncomment(this.props.post._id, isAuthenticated().token, comment).then(
            data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    console.log(data);
                    this.setState({ text: '' });
                    this.setState({ comments: data.comments.reverse() });
                }
            }
        );
    };

    componentDidMount() {
        this.setState({ comments: this.props.post.comments.reverse() });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <CardHeader
                    avatar={
                        <Link
                            className="link"
                            to={`/user/${isAuthenticated().user._id}`}
                        >
                            <Avatar
                                alt={isAuthenticated().user.name}
                                src={`${
                                    process.env.REACT_APP_API_URL
                                }/user/photo/${
                                    isAuthenticated().user._id
                                }?${new Date().getTime()}`}
                                onError={i => {
                                    i.target.src = DefaultAvatar;
                                }}
                                className={classes.avatar}
                            />
                        </Link>
                    }
                    title={
                        <form onSubmit={this.handleSubmit}>
                            <TextField
                                id="outlined-full-width"
                                value={this.state.text}
                                autoComplete="off"
                                onChange={this.handleChange}
                                placeholder="Write a comment..."
                                fullWidth
                            />
                            <input type="submit" style={{ display: 'none' }} />
                        </form>
                    }
                />
                {this.state.comments.map((comment, index) => {
                    return (
                        <CardHeader
                            key={index}
                            avatar={
                                <Link
                                    className="link"
                                    to={`/user/${comment.postedBy._id}`}
                                >
                                    <Avatar
                                        alt="Remy Sharp"
                                        src={`${
                                            process.env.REACT_APP_API_URL
                                        }/user/photo/${
                                            comment.postedBy._id
                                        }?${new Date().getTime()}`}
                                        onError={i => {
                                            i.target.src = DefaultAvatar;
                                        }}
                                        className={classes.avatar}
                                    />
                                </Link>
                            }
                            title={
                                <div>
                                    <Link
                                        className="link"
                                        to={`/user/${comment.postedBy._id}`}
                                    >
                                        {comment.postedBy.name}
                                    </Link>{' '}
                                    {comment.text}
                                    {comment.postedBy._id ===
                                        isAuthenticated().user._id && (
                                        <DeleteRoundedIcon
                                            onClick={() =>
                                                this.deleteConfirm(comment)
                                            }
                                            style={{
                                                float: 'right',
                                                fontSize: 20,
                                                marginTop: 5
                                            }}
                                        />
                                    )}
                                </div>
                            }
                            subheader={new Date(comment.created).toDateString()}
                        />
                    );
                })}
            </div>
        );
    }
}

Comment.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Comment);
