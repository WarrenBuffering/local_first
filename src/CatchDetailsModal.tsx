import { StyleSheet, View } from 'react-native';
import { Button, Modal, Text } from './components';

import type { FishCatch } from './types';

type CatchDetailsModal = {
  isVisible: boolean;
  onDeletePress(): any;
  onHidePress(): void;
  details: FishCatch | null;
};

export function CatchDetailsModal(props: CatchDetailsModal) {
  return (
    <Modal
      isVisible={props.isVisible}
      title="Catch Details"
      onHidePress={props.onHidePress}>
      <View style={styles.content}>
        <View>
          <Text style={styles.title}>{props.details?.species_name}</Text>
          <Text>{props.details?.length} inches</Text>
          <Text>{props.details?.weight} lbs</Text>
        </View>

        <Button title="Delete Catch" onPress={props.onDeletePress} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'space-between',
    flex: 1,
  },
  title: {
    fontSize: 20,
  },
});
