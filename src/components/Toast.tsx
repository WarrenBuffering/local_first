import {useCallback, useEffect, useRef} from 'react';
import {Animated, Dimensions, Pressable, StyleSheet, View} from 'react-native';

import type {ReactElement} from 'react';

import {Status} from '../enums';
import {Text} from './Text';

/* ============================================================================
= Config ======================================================================
============================================================================ */

const ToastColor = {
  [Status.ERROR]: 'red',
  [Status.INFO]: 'blue',
  [Status.SUCCESS]: 'green',
  [Status.WARNING]: 'yellow',
};

/* ============================================================================
= Helper Methods ==============================================================
============================================================================ */

/* ============================================================================
= Helper Components ===========================================================
============================================================================ */

/* ============================================================================
= Component ===================================================================
============================================================================ */

type ToastProps = {
  actionText?: string;
  animationDuration?: number;
  animatedBottomOffset?: number;
  isVisible: boolean;
  onActionPress?(): void;
  onAnimateInBegin?(): void;
  // eslint-disable-next-line react/no-unused-prop-types
  onAnimateInEnd?(): void;
  onAnimateOutBegin?(): void;
  onAnimateOutEnd?(): void;
  // eslint-disable-next-line react/no-unused-prop-types
  onPress?(): void;
  pauseDuration?: number;
  status?: Status.SUCCESS | Status.ERROR;
  title: string;
};

function Component({
  actionText,
  animationDuration = 600,
  animatedBottomOffset = 100,
  isVisible,
  onActionPress,
  onAnimateInBegin,
  onAnimateOutBegin,
  onAnimateOutEnd,
  pauseDuration = 2000,
  status = Status.SUCCESS,
  title,
}: ToastProps): ReactElement | null {
  const screenHeight = Dimensions.get('window').height;
  const bottomOffset = useRef(new Animated.Value(screenHeight));

  const window = Dimensions.get('window');

  const animateIn = useCallback(() => {
    if (typeof onAnimateInBegin === 'function') {
      onAnimateInBegin();
    }

    Animated.timing(bottomOffset.current, {
      toValue: -animatedBottomOffset,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  }, [animationDuration, animatedBottomOffset, onAnimateInBegin]);

  const animateOut = useCallback(() => {
    if (typeof onAnimateOutBegin === 'function') {
      onAnimateOutBegin();
    }

    Animated.timing(bottomOffset.current, {
      toValue: window.height,
      duration: animationDuration,
      useNativeDriver: true,
    }).start(onAnimateOutEnd);
  }, [animationDuration, onAnimateOutBegin, onAnimateOutEnd, window.height]);

  useEffect(() => {
    if (isVisible) {
      animateIn();

      const animateOutTimer = setTimeout(() => {
        animateOut();
      }, pauseDuration);

      return () => clearTimeout(animateOutTimer);
    }
  }, [
    animateIn,
    animateOut,
    isVisible,
    onAnimateInBegin,
    onAnimateOutBegin,
    pauseDuration,
  ]);

  const handleActionPress = () => {
    if (typeof onActionPress === 'function') {
      animateOut();
      onActionPress();
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {transform: [{translateY: bottomOffset.current}]},
      ]}>
      <Pressable
        hitSlop={{bottom: 40, left: 40, right: 40, top: 40}}
        onPress={animateOut}
        style={[styles.toast, {backgroundColor: ToastColor[status]}]}>
        <View style={styles.textContent}>
          <Text numberOfLines={3} style={styles.title}>
            {title}
          </Text>
        </View>

        {!!actionText && !!onActionPress && (
          <Pressable
            hitSlop={{top: 20, bottom: 20, right: 20, left: 20}}
            onPress={handleActionPress}
            style={styles.actionButton}>
            <Text style={styles.actionText}>{actionText}</Text>
          </Pressable>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    marginLeft: 8,
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
  },
  container: {
    bottom: 0,
    paddingHorizontal: 40,
    right: 0,
    left: 0,
    position: 'absolute',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    zIndex: 999999,
  },
  textContent: {
    flex: 1,
  },
  toast: {
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    padding: 12,
    overflow: 'hidden',
    flex: 1,
    zIndex: 999999,
  },
  title: {
    fontSize: 16,
    color: '#fff',
  },
});

/* ============================================================================
= Exports =====================================================================
============================================================================ */

const Toast = Component;

export {Toast};
export type {ToastProps};
