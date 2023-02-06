import {BehaviorSubject} from 'rxjs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiUrl = 'http://10.0.2.2:8080';

const storeToken = async token => {
  try {
    await AsyncStorage.setItem('token', token);
  } catch (e) {
    console.error(e);
  }
};

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token;
  } catch (e) {
    console.error(e);
  }
};

const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('token');
  } catch (e) {
    console.error(e);
  }
};

const currentUserSubject = new BehaviorSubject(getToken());

// Set Authorization header with Bearer token
const authHeader = async () => {
  const currentUser = await getToken().then(token => {
    return token;
  });
  if (currentUser) {
    return {Authorization: `Bearer ${currentUser}`};
  } else {
    return {};
  }
};

// Response handler
const handleResponse = response => {
  return response.text().then(text => {
    if (text === 'Username already exists') {
      return Promise.reject('Username already exists');
    }
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if ([401, 403].indexOf(response.status) !== -1) {
        logout();
      }
      if (data?.apierror?.message === 'Bad credentials') {
        return Promise.reject('Incorrect username or password');
      }
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
};

// Authenticate user
const login = (username, password) => {
  const requestOptions = {
    method: 'POST',
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify({username, password}),
  };

  return fetch(`${apiUrl}/api/authenticate`, requestOptions)
    .then(handleResponse)
    .then(user => {
      storeToken(user.token);
      currentUserSubject.next(user);

      return user;
    });
};

const logout = async () => {
  await removeToken();
  currentUserSubject.next(null);
};

export const authenticationService = {
  login,
  logout,
  authHeader,
  handleResponse,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue() {
    return currentUserSubject.value;
  },
  apiUrl,
  getToken,
};
