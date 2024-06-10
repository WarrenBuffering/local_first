import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {Text} from './Text';
import type {FishCatch} from '../types';

type CatchCardProps = FishCatch & {
  onPress(): void;
};

function CatchCard(args: CatchCardProps): JSX.Element {
  return (
    <>
      <Pressable onPress={args.onPress} style={styles.card}>
        <Text style={styles.title}>{args.species_name}</Text>
        <View style={styles.titleUnderline} />

        <Text style={styles.subtitle}>Length: {args.length}</Text>

        <Text style={styles.subtitle}>Weight: {args.weight}</Text>
      </Pressable>
    </>
  );
}

export {CatchCard};

const styles = StyleSheet.create({
  card: {
    padding: 20,
  },
  title: {
    fontSize: 20,
  },
  titleUnderline: {
    backgroundColor: '#dff3e4',
    height: 1,
    marginVertical: 2,
  },
  subtitle: {
    fontSize: 14,
  },
});
