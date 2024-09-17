import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://rickandmortyapi.com/api',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default {
  getCharacters(page = 1) {
    return apiClient.get(`/character?page=${page}`);
  },
  searchCharactersByName(name) {
    return apiClient.get(`/character/?name=${name}`);
  },
};
