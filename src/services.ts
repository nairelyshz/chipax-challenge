import axios from 'axios';
import { url } from 'inspector';
 
interface URLS {
	characters: string;
	locations: string;
	episodes: string;
}

const urls: URLS = {
	characters: "https://rickandmortyapi.com/api/character",
	locations: "https://rickandmortyapi.com/api/location",
	episodes: "https://rickandmortyapi.com/api/episode"
}

export function getByUrl(url: string){
	return axios.get(`${url}`);
}
