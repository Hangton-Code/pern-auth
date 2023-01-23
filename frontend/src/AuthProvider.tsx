import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
  useContext,
} from "react";
import { IUser } from "./type";
import axios, { RawAxiosRequestConfig } from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const UserContext = createContext({
  user: {} as IUser,
  refreshToken: "",
  accessToken: "",
  isReady: false,
});

const useUser = () => useContext(UserContext);

const AuthContext = createContext({
  // return value refer to error message, which mean null refer to no error
  login: async (email: string, password: string): Promise<string | null> => {
    return null;
  },
  googleLogin: (
    _refresh_token: string,
    _access_token: string,
    _user: IUser
  ) => {},
  signupEmail: async (email: string): Promise<string | null> => {
    return null;
  },
  signup: async (
    userName: string,
    password: string,
    token: string
  ): Promise<string | null> => {
    return null;
  },
});

const useAuth = () => useContext(AuthContext);

type AuthProviderProp = {
  children: ReactNode;
};

function getAccessToken(refresh_token: string) {
  return axios({
    url: `${process.env.REACT_APP_SERVER_URL}/auth/refresh_token`,
    method: "POST",
    data: {
      refresh_token,
    },
  })
    .then((res) => res.data.body.access_token as string)
    .catch(() => null);
}

function AuthProvider({ children }: AuthProviderProp) {
  const [user, setUser] = useState({} as IUser);
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refresh_token") || ""
  );
  const [accessToken, setAccessToken] = useState("");
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // return value refer to api response, which mean null refer to error occur
  const callProtectedAPI = useCallback(
    // this function prevent access_token from expiring
    // to prevent failing to call the API
    (options: RawAxiosRequestConfig, _access_token?: string) => {
      return axios({
        ...options,
        headers: {
          Authorization: `Bearer ${_access_token || accessToken}`,
        },
      })
        .then((res) => res.data) // success
        .catch(async (err) => {
          // if success
          if (err.response.status === 200) return err.response.data;

          // if error is unauth
          if (err.response.status === 401) {
            // if access_token is invalid (maybe expired), try to get new one
            if (err.response.data.body.invalidToken) {
              const newAccessToken = await getAccessToken(refreshToken);
              if (newAccessToken) {
                // if new access token is gained successfully,
                // meaning that current refresh_token is valid
                setAccessToken(newAccessToken);
                return await axios({
                  ...options,
                  headers: {
                    Authorization: `Bearer ${newAccessToken}`,
                  },
                })
                  .then((res) => res.data)
                  .catch((err) => err.response.data); // here null refer to other server error
              }

              // if fail to get a new access token, meaning refresh_token is invalid,
              // then process like facing other auth problem (go bottom)
            }
            // if not the access_token is invalid,
            // and fail to get a new access token
            // it means that the refresh_token is invalid (maybe user no lonhger exists),
            // then logout
            localStorage.removeItem("refresh_token");
            setRefreshToken("");
            setAccessToken("");
            setUser({} as IUser);
            return err.response.data;
          }

          // for other server error
          return err.response.data;
        });
    },
    [accessToken, refreshToken]
  );

  // login function
  const login = useCallback(async (email: string, password: string) => {
    const res = await axios({
      url: `${process.env.REACT_APP_SERVER_URL}/auth/login`,
      method: "POST",
      data: {
        email,
        password,
      },
    })
      .then((res) => res.data)
      .catch((err) => err.response.data);

    // if no error, login
    if (!res.error) {
      setUser(res.body.user);
      setAccessToken(res.body.access_token);
      localStorage.setItem("refresh_token", res.body.refresh_token);
      setRefreshToken(res.body.refresh_token);
      return null;
    }

    // if any error
    return res.message as string;
  }, []);

  // google login function
  const googleLogin = useCallback(
    (_refresh_token: string, _access_token: string, _user: IUser) => {
      setUser(_user);
      setAccessToken(_access_token);
      localStorage.setItem("refresh_token", _refresh_token);
      setRefreshToken(_refresh_token);
      setIsReady(true);
    },
    []
  );

  // signup email
  const signupEmail = useCallback(async (email: string) => {
    const res = await axios({
      url: `${process.env.REACT_APP_SERVER_URL}/auth/signup_email`,
      method: "POST",
      data: {
        email,
      },
    })
      .then((res) => res.data)
      .catch((err) => err.response.data);

    // null refer to no error
    return res.error ? (res.message as string) : null;
  }, []);

  // signup
  const signup = useCallback(
    async (userName: string, password: string, token: string) => {
      let res = await axios({
        url: `${process.env.REACT_APP_SERVER_URL}/auth/signup`,
        method: "POST",
        data: {
          token,
          password,
        },
      })
        .then((res) => res.data)
        .catch((err) => err.response.data);

      if (res.error) return res.message as string;

      const user = res.body.user;
      const refresh_token = res.body.refresh_token;
      const access_token = res.body.access_token;

      res = await callProtectedAPI(
        {
          url: `${process.env.REACT_APP_SERVER_URL}/profile/edit`,
          method: "POST",
          data: {
            user_name: userName,
          },
        },
        access_token
      );

      setUser({
        ...user,
        user_name: userName,
      });
      setAccessToken(access_token);
      localStorage.setItem("refresh_token", refresh_token);
      setRefreshToken(refresh_token);

      return res.error ? (res.message as string) : null;
    },
    []
  );

  // init
  useEffect(() => {
    (async () => {
      if (refreshToken) {
        const access_token = await getAccessToken(refreshToken);

        if (access_token) {
          // if refresh_token is valid
          setAccessToken(access_token);
          const res = await callProtectedAPI(
            {
              url: `${process.env.REACT_APP_SERVER_URL}/auth/me`,
              method: "GET",
            },
            access_token
          );
          if (!res.error) setUser(res.body.user);
        } else {
          // if refresh_token is invalid, delete the invalid refresh_token
          localStorage.removeItem("refresh_token");
          setRefreshToken("");
        }
      }
      setIsReady(true);
    })();
  }, []);

  // listen to user state and redirect
  useEffect(() => {
    const routeForAuthedUser = ["/"];
    // redirect unauthed user
    if (
      isReady &&
      !refreshToken &&
      routeForAuthedUser.includes(location.pathname)
    )
      navigate("/auth/credentials/login");

    // redirect logined user
    const routeForUnauthedUser = [
      "/auth/credentials/login",
      "/auth/credentials/signup_email",
      "/auth/credentials/signup",
      "/auth/credentials/forget_password",
    ];
    if (
      isReady &&
      refreshToken &&
      routeForUnauthedUser.includes(location.pathname)
    )
      navigate("/");
  }, [isReady, refreshToken]);

  return (
    <UserContext.Provider
      value={{
        user,
        refreshToken,
        accessToken,
        isReady,
      }}
    >
      <AuthContext.Provider value={{ login, googleLogin, signupEmail, signup }}>
        {children}
      </AuthContext.Provider>
    </UserContext.Provider>
  );
}

export default AuthProvider;
export { useUser, useAuth };
