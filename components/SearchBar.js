import {Searchbar} from 'react-native-paper';
import React from 'react';

export const SearchBar = (props) => {
  return (
    <Searchbar
      placeholder="Search"
      onChangeText={(query) => {
        props.onChangeTextHandler(query);
      }}
      value={props.value}
      onIconPress={() => {
        props.onIconPressHandler();
      }}
    />
  );
};
