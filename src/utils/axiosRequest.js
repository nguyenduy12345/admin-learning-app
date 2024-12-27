import axios from "axios";
import Cookies from "js-cookie"
const instance = axios.create({
    baseURL: 'http://localhost:8080/api/v1/',
    headers: {'Accept-Language': 'vi-vn'}
});

const token = Cookies.get("token")
instance.defaults.headers.common["Authorization"] = "Bearer " + token;
const createAxiosResponseInterceptor = () => {
  const refreshtoken = JSON.parse(localStorage.getItem("REFRESH_TOKEN"));
  const token = localStorage.getItem("Token");
  instance.defaults.headers.common["Authorization"] = "Bearer " + token;
    const interceptor = instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // if (error.response.status !== 401) {
        //   return Promise.reject(error);
        // }
        instance.interceptors.response.eject(interceptor);
        return instance
          .post("refresh-token", {
            refreshtoken,
          })
          .then((response) => {
            error.response.config.headers["Authorization"] =
              "Bearer " + response.data.accesstoken;
              instance.defaults.headers.common["Authorization"] = "Bearer " + response.data.accesstoken;
              localStorage.setItem("Token", JSON.stringify(response.data.accesstoken))  
              localStorage.setItem("REFRESH_TOKEN", JSON.stringify(response.data.refreshtoken))
            return instance(error.response.config);
          })
          .catch(() => {
           
          });
      }
    );
  };
// createAxiosResponseInterceptor()
export default instance
export {
  createAxiosResponseInterceptor
}