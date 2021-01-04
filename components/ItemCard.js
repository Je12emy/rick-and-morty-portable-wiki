import React from 'react';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  IconButton,
} from 'react-native-paper';
import {Image, Pressable} from 'react-native';

const getIcon = (props) => {
  if (props.image) {
    return imageIcon(props);
  } else {
    return <IconButton icon={props.icon} />;
  }
};

export const imageIcon = (props) => {
  return (
    <Avatar.Image
      source={{uri: props.image}}
      size={48}
    />
  );
};

export const ItemCard = (props) => {
  return (
    <Pressable
      onPress={() => {
        props.onPress(props.id);
      }}>
      <Card elevation={1} style={{marginBottom: 1}}>
        <Card.Title
          title={props.title}
          subtitle={props.subtitle}
          left={() => getIcon(props)}
        />
      </Card>
    </Pressable>
  );
};
