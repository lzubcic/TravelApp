import {authenticationService} from './authentication.service';

let requestURL = 'http://10.0.2.2:8080/travel';

const filterTravels = (text, price, transportation) => {
  let requestURL = 'http://10.0.2.2:8080/travel';
  if (text) {
    requestURL += `?text=${text}&`;
  }
  if (price) {
    requestURL.slice(-1) === '&'
      ? (requestURL += `price=${price}&`)
      : (requestURL += `?price=${price}&`);
  }
  if (transportation) {
    requestURL.slice(-1) === '&'
      ? (requestURL += `transportation=${transportation}`)
      : (requestURL += `?transportation=${transportation}`);
  }
  return fetch(requestURL)
    .then(authenticationService.handleResponse)
    .then(travels => {
      requestURL = authenticationService.apiUrl;
      return travels;
    });
};

const createTravel = async (
  travelName,
  shortDescription,
  price,
  spaceLeft,
  transportation,
  description,
  imageURL,
) => {
  const token = await authenticationService.getToken();
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      travelName,
      shortDescription,
      price,
      spaceLeft,
      transportation,
      description,
      imageURL,
    }),
  };

  return fetch(`${requestURL}`, requestOptions)
    .then(authenticationService.handleResponse)
    .then(travels => {
      return travels;
    });
};

const editTravel = async (
  id,
  travelName,
  shortDescription,
  price,
  spaceLeft,
  transportation,
  description,
  imageURL,
) => {
  const token = await authenticationService.getToken();
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id,
      travelName,
      shortDescription,
      price,
      spaceLeft,
      transportation,
      description,
      imageURL,
    }),
  };

  return fetch(`${requestURL}/${id}`, requestOptions)
    .then(authenticationService.handleResponse)
    .then(travels => {
      return travels;
    });
};

const deleteTravel = async id => {
  const token = await authenticationService.getToken();
  const requestOptions = {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  return fetch(`${requestURL}/${id}`, requestOptions)
    .then(authenticationService.handleResponse)
    .then(travel => {
      return travel;
    });
};

export const travelService = {
  filterTravels,
  createTravel,
  editTravel,
  deleteTravel,
};
