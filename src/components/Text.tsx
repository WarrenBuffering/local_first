import {Text as RNText, StyleSheet} from 'react-native';

import type {TextStyle} from 'react-native';

type TextProps = {
  children: string | string[];
  numberOfLines?: number;
  onPress?(): void;
  style?: TextStyle;
};

export function Text(props: TextProps) {
  return (
    <RNText
      numberOfLines={props.numberOfLines}
      onPress={props.onPress}
      style={[styles.text, props.style]}>
      {props.children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#17138',
    fontSize: 14,
  },
});
