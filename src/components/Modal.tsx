import {Pressable, StyleSheet, View} from 'react-native';
import RNModal from 'react-native-modal';

import {Text} from './Text';

type ModalProps = {
  children: JSX.Element | JSX.Element[];
  isVisible: boolean;
  onHidePress(): void;
  title: string;
};

export function Modal(props: ModalProps) {
  return (
    <RNModal isVisible={props.isVisible} style={styles.modal}>
      <View style={styles.modalHeader}>
        <Text style={styles.title}>{props.title}</Text>

        <Pressable
          hitSlop={{
            top: 20,
            bottom: 20,
            left: 20,
            right: 20,
          }}
          onPress={props.onHidePress}>
          <Text onPress={props.onHidePress} style={styles.hideButton}>
            Hide Modal
          </Text>
        </Pressable>
      </View>

      {props.children}
    </RNModal>
  );
}

const styles = StyleSheet.create({
  hideButton: {
    height: 20,
    textDecorationLine: 'underline',
  },
  modal: {
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    flex: 1,
    paddingTop: 70,
    margin: 0,
    padding: 40,
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 48,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
  },
});
