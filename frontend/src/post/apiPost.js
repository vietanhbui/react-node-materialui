const axios = require('axios');

export const createPost = (postData, token, userId) => {
    return axios(`${process.env.REACT_APP_API_URL}/post/new/${userId}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + token
        },
        data: postData
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        })
}

export const getAllPosts = token => {
    return axios(`${process.env.REACT_APP_API_URL}/posts`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        }
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        })
}

export const comment = (userId, postId, token, text) => {
    return axios(`${process.env.REACT_APP_API_URL}/post/comment`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        },
        data: { userId, postId, comment: { text } }
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        })
}

export const uncomment = (postId, token, comment) => {
    return axios(`${process.env.REACT_APP_API_URL}/post/uncomment`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        },
        data: { postId, comment }
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        })
}

export const like = (postId, token, userId) => {
    return axios(`${process.env.REACT_APP_API_URL}/post/like`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        },
        data: { postId, userId }
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        })
}

export const unlike = (postId, token, userId) => {
    return axios(`${process.env.REACT_APP_API_URL}/post/unlike`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        },
        data: { postId, userId }
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        })
}