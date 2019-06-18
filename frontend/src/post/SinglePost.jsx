import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import CommentIcon from '@material-ui/icons/Comment';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DefaultAvatar from '../image/avatar.png';
import { Link } from 'react-router-dom';
import Comment from './Comment';
import { like, unlike } from './apiPost';
import { isAuthenticated } from '../auth';

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

class SinglePost extends React.Component {
    constructor() {
        super();
        this.state = {
            expanded: false,
            comments: [],
            like: false,
            likes: 0
        };
    }

    handleExpandClick = () => {
        this.setState({ expanded: true });
    };

    handleLike = () => {
        let callApi = this.state.like ? unlike : like;
        this.setState({
            like: !this.state.like,
            likes:
                callApi === unlike ? this.state.likes - 1 : this.state.likes + 1
        });
        callApi(
            this.props.post._id,
            isAuthenticated().token,
            isAuthenticated().user._id
        ).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
            }
        });
    };

    checkLike = likes => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        return likes.indexOf(userId) !== -1;
    };

    componentDidMount() {
        const { post } = this.props;
        this.setState({
            likes: post.likes.length,
            like: this.checkLike(post.likes)
        });
    }

    render() {
        const { classes, post } = this.props;
        return (
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Link
                            className="link"
                            to={`/user/${post.postedBy._id}`}
                        >
                            <Avatar
                                alt="Remy Sharp"
                                src={`${
                                    process.env.REACT_APP_API_URL
                                }/user/photo/${this.props.post.postedBy._id}`}
                                onError={i => {
                                    i.target.src = DefaultAvatar;
                                }}
                                className={classes.avatar}
                            />
                        </Link>
                    }
                    action={
                        <IconButton>
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={
                        <Link
                            className="link"
                            to={`/user/${post.postedBy._id}`}
                        >
                            {post.postedBy.name}
                        </Link>
                    }
                    subheader={new Date(post.created).toDateString()}
                />
                <CardContent>
                    <Typography component="p">{post.content}</Typography>
                </CardContent>
                {post.photo ? (
                    <CardMedia
                        className={classes.media}
                        image={`${process.env.REACT_APP_API_URL}/post/photo/${
                            post._id
                        }`}
                        title={post.content}
                    />
                ) : (
                    ''
                )}
                <hr className={classes.hr} />
                <CardActions className={classes.actions} disableActionSpacing>
                    <IconButton
                        onClick={this.handleLike}
                        aria-label="Add to favorites"
                    >
                        <Badge badgeContent={this.state.likes} color="primary">
                            <FavoriteIcon
                                style={{
                                    color: this.state.like
                                        ? 'rgb(225, 0, 80)'
                                        : ''
                                }}
                            />
                        </Badge>
                    </IconButton>
                    <IconButton
                        onClick={this.handleExpandClick}
                        aria-expanded={this.state.expanded}
                    >
                        <CommentIcon />
                    </IconButton>
                    <IconButton aria-label="Share">
                        <ShareIcon />
                    </IconButton>
                </CardActions>
                <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                    <hr className={classes.hr} />
                    <Comment post={post} />
                </Collapse>
            </Card>
        );
    }
}

SinglePost.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SinglePost);
