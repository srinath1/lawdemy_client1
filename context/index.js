import { useReducer, createContext, useEffect } from "react";
import axios from "axios";
import { useRouter, userRouter } from "next/router";

// initial state
const intialState = {
  user: null

};

// create context
const Context = createContext();

// root reducer
const rootReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
};

// context provider
const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, intialState);

  // router
  const router = useRouter();

  useEffect(() => {
    dispatch({
      type: "LOGIN",
      payload: JSON.parse(window.localStorage.getItem("user")),
    });
  }, []);
 //  const state=JSON.parse(window.localStorage.getItem("user"))
  console.log('state1',state)
  const token = state && state.user && state.user.token ? state.user.token : "";
    axios.defaults.baseURL = `https://lawdemy.herokuapp.com/api`;

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//   axios.interceptors.response.use(
//     function (response) {
//       // any status code that lie within the range of 2XX cause this function
//       // to trigger
//       console.log('retres->',response')
//       return response;
//     },
//     function (error) {
//       // any status codes that falls outside the range of 2xx cause this function
//       // to trigger
//       let res = error.response;
//       console.log('res=>',res)
//       if (res.status === 401 ) {
//         return new Promise((resolve, reject) => {
//           axios
//             .get("https://lawdemy.herokuapp.com/api/logout")
//             .then((data) => {
//               console.log("/401 error > logout");
//               dispatch({ type: "LOGOUT" });
//               window.localStorage.removeItem("user");
//               router.push("/login");
//             })
//             .catch((err) => {
//               console.log("AXIOS INTERCEPTORS ERR", err);
//               reject(error);
//             });
//         });
//       }
//       return Promise.reject(error);
//     }
//   );

//   useEffect(() => {
//     const getCsrfToken = async () => {
//       const { data } = await axios.get("https://lawdemy.herokuapp.com/api/csrf-token");
//        console.log("CSRF", data);
//       axios.defaults.headers["X-CSRF-Token"] = data.getCsrfToken;
//     };
//     getCsrfToken();
//   }, []);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export { Context, Provider };
