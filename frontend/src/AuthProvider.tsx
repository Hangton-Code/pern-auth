import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
  useContext,
} from "react";
import { IUser, UserAvatarType } from "./type";
import axios, { RawAxiosRequestConfig } from "axios";

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
  setPasswordEmail: async (_email?: string): Promise<string | null> => {
    return null;
  },
  setPassword: async (
    password: string,
    token: string
  ): Promise<string | null> => {
    return null;
  },
  logout: async (): Promise<string | null> => {
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

const ProfileContext = createContext({
  editProfile: async (
    payload: {
      user_name?: string;
    },
    access_token?: string
  ): Promise<string | null> => {
    return null;
  },
  editAvatar: async (
    avatarType: UserAvatarType,
    avatarContent: File | string | null
  ): Promise<string | null> => {
    return null;
  },
});

const useProfile = () => useContext(ProfileContext);

function AuthProvider({ children }: AuthProviderProp) {
  const [user, setUser] = useState({} as IUser);
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refresh_token") || ""
  );
  const [accessToken, setAccessToken] = useState("");
  const [isReady, setIsReady] = useState(false);

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

  //  ------------- auth -------------

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
      const res = await axios({
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

      const _user = res.body.user;
      const refresh_token = res.body.refresh_token;
      const access_token = res.body.access_token;

      await callProtectedAPI(
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
        ..._user,
        user_name: userName,
      });
      setAccessToken(access_token);
      localStorage.setItem("refresh_token", refresh_token);
      setRefreshToken(refresh_token);

      return null;
    },
    [callProtectedAPI]
  );

  // set password email
  const setPasswordEmail = useCallback(
    async (_email?: string) => {
      const requested_email = _email || user.email;

      const res = await axios({
        url: `${process.env.REACT_APP_SERVER_URL}/auth/set_password_email`,
        method: "POST",
        data: {
          email: requested_email,
        },
      })
        .then((res) => res.data)
        .catch((err) => err.response.data);

      // null refer to no error
      return res.error ? (res.message as string) : null;
    },
    [user.email]
  );

  // set password
  const setPassword = useCallback(async (password: string, token: string) => {
    const res = await axios({
      url: `${process.env.REACT_APP_SERVER_URL}/auth/set_password`,
      method: "POST",
      data: {
        token,
        password,
      },
    })
      .then((res) => res.data)
      .catch((err) => err.response.data);

    // null refer to no error
    return res.error ? (res.message as string) : null;
  }, []);

  // logout
  const logout = useCallback(async () => {
    const res = await axios({
      url: `${process.env.REACT_APP_SERVER_URL}/auth/logout`,
      method: "POST",
      data: {
        refresh_token: refreshToken,
      },
    })
      .then((res) => res.data)
      .catch((err) => err.response.data);

    if (res.error) return res.message as string;

    setAccessToken("");
    localStorage.removeItem("refresh_token");
    setRefreshToken("");
    setUser({} as IUser);

    return null;
  }, [refreshToken]);

  // ------------- profile -------------

  // edit profile
  const editProfile = useCallback(
    async (payload: { user_name?: string }) => {
      const res = await callProtectedAPI({
        url: `${process.env.REACT_APP_SERVER_URL}/profile/edit`,
        method: "POST",
        data: payload,
      });
      if (!res.error) {
        setUser((prev) => {
          return {
            ...prev,
            ...payload,
          };
        });
        return null;
      }
      return res.message as string;
    },
    [callProtectedAPI]
  );

  // edit avatar
  const editAvatar = useCallback(
    async (avatarType: UserAvatarType, avatarContent: File | string | null) => {
      const data = new FormData();
      data.append("avatar_type", String(avatarType));
      switch (avatarType) {
        case UserAvatarType.UPLOADED_IMAGE:
          data.append("image", avatarContent as File);
          break;
        case UserAvatarType.URL:
          data.append("avatar_url", avatarContent as string);
          break;
        default:
          break;
      }

      const res = await callProtectedAPI({
        url: `${process.env.REACT_APP_SERVER_URL}/profile/edit/avatar`,
        method: "POST",
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!res.error) {
        setUser({
          ...user,
          user_avatar_type: res.body.new_user_avatar_type,
          user_avatar_content: res.body.new_user_avatar_content,
        });
        return null;
      }
      return res.message as string;
    },
    [callProtectedAPI, user]
  );

  return (
    <UserContext.Provider
      value={{
        user,
        refreshToken,
        accessToken,
        isReady,
      }}
    >
      <AuthContext.Provider
        value={{
          login,
          googleLogin,
          signupEmail,
          signup,
          setPasswordEmail,
          setPassword,
          logout,
        }}
      >
        <ProfileContext.Provider value={{ editProfile, editAvatar }}>
          {children}
        </ProfileContext.Provider>
      </AuthContext.Provider>
    </UserContext.Provider>
  );
}

export default AuthProvider;
export { useUser, useAuth, useProfile };
