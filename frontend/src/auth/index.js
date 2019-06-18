export const authenticate = jwt => {
    if (typeof window !== undefined) {
        localStorage.setItem('jwt', JSON.stringify(jwt))
    }
}

export const isAuthenticated = () => {
    if (typeof window == undefined) {
        return false;
    }
    return JSON.parse(localStorage.getItem('jwt'));
}