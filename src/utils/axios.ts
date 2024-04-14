import axios from 'axios';

// ----------------------------------------------------------------------

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);
console.log('axiosInstance', axiosInstance);
export default axiosInstance;
