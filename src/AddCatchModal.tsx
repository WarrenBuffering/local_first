import {StyleSheet, View} from 'react-native';
import {Button, Modal, TextInput} from './components';

type AddCatchModalProps = {
  isVisible: boolean;
  title: string;
  onAddCatchPress(): unknown;
  onHidePress(): unknown;
  onSpeciesChange(): unknown;
  onLengthChange(): unknown;
  onWeightChange(): unknown;
  species: string;
  length: string;
  weight: string;
};

export function AddCatchModal(props: AddCatchModalProps) {
  return (
    <Modal
      isVisible={props.isVisible}
      title={props.title}
      onHidePress={props.onHidePress}>
      <View style={styles.content}>
        <View>
          <TextInput
            label="Fish Species"
            placeholder="Specify fish species..."
            value={props.species}
            onChangeText={props.onSpeciesChange}
          />

          <TextInput
            label="Fish Length"
            placeholder="16..."
            value={props.length}
            onChangeText={props.onLengthChange}
          />

          <TextInput
            label="Fish Weight"
            placeholder="2.4..."
            value={props.weight}
            onChangeText={props.onWeightChange}
          />
        </View>

        <Button title="Add Catch" onPress={props.onAddCatchPress} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'space-between',
    flex: 1,
  },
});
