import { createContext, ReactNode, useEffect, useReducer } from 'react';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
// @types
import { ActionMap, AuthState, AuthUser, JWTContextType } from '../@types/authentication';

// ----------------------------------------------------------------------

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Register = 'REGISTER'
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.Login]: {
    user: AuthUser;
  };
  [Types.Logout]: undefined;
  [Types.Register]: {
    user: AuthUser;
  };
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user
      };

    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        const conversationId = window.localStorage.getItem('conversationId');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken, conversationId);

          // const response = await axios.get('/api/account/my-account');
          // const { user } = response.data;
          // const response = await axios.get('/api/account/my-account');
          // const { user } = null

          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user: null
            }
          });
        } else {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (email: string, password: string) => {
    const body = {
      query: `
    mutation ($loginAuthInput: CreateLoginAuthInput!)  {
      login(loginAuthInput: $loginAuthInput) {
        accessToken
        refreshToken
        conversationId
      }
    }
  `,
      variables: {
        loginAuthInput: {
          username: email,
          password: password
        }
      }
    };

    const options = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const url = process.env.REACT_APP_BACKEND_HOST ?? ''; // Replace with your GraphQL endpoint URL

    const response = await axios.post(url, body, options);
    const { accessToken, conversationId } = response.data.data.login;
    console.log(response)
    setSession(accessToken, conversationId);
    dispatch({
      type: Types.Login,
      payload: {
        user: {}
      }
    });
  };
  const loginGoogle = async (idToken: string) => {
    console.log("🚀 ~ loginGoogle ~ idToken:", idToken)
    const body = {
      query: `  query ($idToken: String!) {
          googleLogin(googleIDToken: $idToken) {
            accessToken,
            refreshToken, 
            conversationId
          }
        }
  `,
      variables: {
        idToken: idToken
      }
    };

    const options = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const url = process.env.REACT_APP_BACKEND_HOST ?? ''; // Replace with your GraphQL endpoint URL

    const response = await axios.post(url, body, options);
    console.log("🚀 ~ loginGoogle ~ response:", response)

    const { accessToken, conversationId } = response.data.data.googleLogin;
    setSession(accessToken, conversationId);
    dispatch({
      type: Types.Login,
      payload: {
        user: {}
      }
    });
  };

  const loginFacebook = async (data: string) => {
    console.log("🚀 ~ facebook ~ idToken:", data['email'])
    const body = {
      query: `  query ($emailFacebook: String!) {
          facebookLogin(emailFacebook: $emailFacebook) {
            accessToken,
            refreshToken
          }
        }
  `,
      variables: {
        emailFacebook: data['email']
      }
    };

    const options = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const url = process.env.REACT_APP_BACKEND_HOST ?? ''; // Replace with your GraphQL endpoint URL

    const response = await axios.post(url, body, options);
    const accessToken = response.data.data.facebookLogin.accessToken;
    window.localStorage.setItem('accessToken', accessToken);

    dispatch({
      type: Types.Login,
      payload: {
        user: {}
      }
    });
  };
  const initializeGithubLogin = async () => {
    dispatch({
      type: Types.Initial,
      payload: {
        isAuthenticated: true,
        user: {}
      }
    });
  };
  const loginGitHub = async (code: string) => {
    await initializeGithubLogin();

    const body = {
      query: `query ($code: String!) {
      githubLogin(gitHubCode: { codeAuth: $code }) {
        accessToken,
        refreshToken
      }
    }`,
      variables: {
        code: code
      }
    };
    let options = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const domainBackend = process.env.REACT_APP_BACKEND_HOST
      ? process.env.REACT_APP_BACKEND_HOST
      : ' ';
    const response = await axios.post(domainBackend, body, options);

    const accessToken = response.data.data.githubLogin.accessToken;
    console.log('accessToken:', accessToken);

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: Types.Login,
      payload: {
        user: {}
      }
    });
  };
  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: Types.Register,
      payload: {
        user
      }
    });
  };

  const logout = async () => {
    setSession(null,null);

    dispatch({ type: Types.Logout });
  };

  const resetPassword = (email: string) => console.log(email);

  const updateProfile = () => { };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        loginGoogle,
        loginFacebook,
        loginGitHub,
        logout,
        register,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
