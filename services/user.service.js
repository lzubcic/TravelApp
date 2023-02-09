import {authenticationService} from './authentication.service';

const getUser = async () => {
  const requestOptions = {
    method: 'GET',
    headers: await authenticationService.authHeader(),
  };
  return fetch(
    `${authenticationService.apiUrl}/api/user/current-user`,
    requestOptions,
  )
    .then(authenticationService.handleResponse)
    .catch(err => console.log('No user', err));
};

const addUser = (username, password, firstName, lastName) => {
  const requestOptions = {
    method: 'POST',
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify({username, password, firstName, lastName}),
  };

  return fetch(`${authenticationService.apiUrl}/api/user`, requestOptions)
    .then(authenticationService.handleResponse)
    .then(user => {
      return user;
    });
};

const updateUser = async (id, username, password, firstName, lastName) => {
  const currentUser = await authenticationService.getToken();
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${currentUser}`,
    },
    body: JSON.stringify({id, username, password, firstName, lastName}),
  };

  return fetch(`${authenticationService.apiUrl}/api/user/${id}`, requestOptions)
    .then(authenticationService.handleResponse)
    .then(user => {
      return user;
    });
};

const bookTravel = (id, travelId, token) => {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  return fetch(
    `${authenticationService.apiUrl}/api/user/book/${id}?travelId=${travelId}`,
    requestOptions,
  )
    .then(authenticationService.handleResponse)
    .then(user => {
      return user;
    });
};

const cancelTravel = (id, token) => {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  return fetch(
    `${authenticationService.apiUrl}/api/user/cancel/${id}`,
    requestOptions,
  )
    .then(authenticationService.handleResponse)
    .then(user => {
      return user;
    });
};

export const userService = {
  getUser,
  addUser,
  updateUser,
  bookTravel,
  cancelTravel,
};
