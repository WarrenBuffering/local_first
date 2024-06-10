import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

type ButtonProps = {
  onPress(): void;
  title: string;
};

export function Button(props: ButtonProps): JSX.Element {
  return (
    <Pressable onPress={props.onPress} style={styles.button}>
      <Text style={styles.title}>{props.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#171738',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 50,
  },
  title: {
    color: '#fff',
  },
});
