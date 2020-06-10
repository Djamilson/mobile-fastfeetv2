import React from 'react';

import PropTypes from 'prop-types';

import {Avatar} from './styles';

export default function Header({data, number}) {
  let url =
    data.person.avatar !== null
      ? `${data.person.avatar.url}-xs`
      : `https://api.adorable.io/avatar/50/${data.person.name}.png`;

  if (__DEV__) {
    url =
      data.person.avatar !== null
        ? `${data.person.avatar.url}-xs`
        : `https://api.adorable.io/avatar/50/${data.person.name}.png`;
  }

  return (
    <Avatar
      number={number}
      source={{
        uri: `${url}`,
      }}
    />
  );
}

Header.propTypes = {
  number: PropTypes.number.isRequired,
  data: PropTypes.shape({
    person: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.shape({
        url: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};
