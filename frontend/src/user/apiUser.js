const axios = require('axios');

export const signup = user => {
    return axios(`${process.env.REACT_APP_API_URL}/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        data: user
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        });
};

export const signin = user => {
    return axios(`${process.env.REACT_APP_API_URL}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        data: user
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        });
};

export const signout = () => {
    localStorage.removeItem('jwt');
    return axios(`${process.env.REACT_APP_API_URL}/signout`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        });
}

export const getUserById = userId => {
    return axios(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.reponse.data;
        });
};

export const editUser = (user, token, userId) => {
    return axios(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + token
        },
        data: user
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        })
}
