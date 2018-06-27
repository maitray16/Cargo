import axios from 'axios';
const API_ROOT = 'http://localhost/cargo';


export const get = (path) => {
    return new Promise((resolve, reject) => {
      axios.get(`${API_ROOT}${path}`)
        .then(response => { resolve(response) })
        .catch(error => { reject(error.response) });
    });
  };

export const post = (path, data) => {
    return new Promise((resolve, reject) => {
        axios.post(`${API_ROOT}${path}`, data)
        .then(response => { resolve(response) })
        .catch(error => { reject(error.response) });
    });
};
