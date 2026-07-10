import axios from 'axios';

const KALON_URL: string = import.meta.env.VITE_KALON_URL;

export const kalon = axios.create({ baseURL: KALON_URL });
