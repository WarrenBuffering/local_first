import {useEffect, useState} from 'react';
import {ScrollView, Switch, StyleSheet, View} from 'react-native';

import {Button, CatchCard, Text} from './components';
import {FetchStatus} from './enums';
import {AddCatchModal} from './AddCatchModal';
import {CatchDetailsModal} from './CatchDetailsModal';
import {useCatchesStore} from './useCatchesStore';
import {useNetworkStore} from './useNetworkStore';
import {useToast} from './useToast';

import type {FishCatch} from './types';

function CatchesScreen() {
  const catchesStore = useCatchesStore();
  const networkStore = useNetworkStore();
  const toast = useToast();

  const [catchLength, setCatchLength] = useState('20');
  const [catchSpecies, setCatchSpecies] = useState('Walleye');
  const [catchWeight, setCatchWeight] = useState('3.5');
  const [createSyncFail, setCreateSyncFail] = useState(null);

  const [catchDetails, setCatchDetails] = useState<FishCatch | null>(null);
  const [isAddCatchVisible, setIsAddCatchVisible] = useState(false);

  async function handleCreateCatch() {
    const response = await catchesStore.create({
      length: catchLength,
      species_name: catchSpecies,
      weight: catchWeight,
    });
    setIsAddCatchVisible(false);

    if (response.error) {
      toast.showError('Unable to create catch', {
        actionText: 'Retry',
        onActionPress: () => {
          setCatchLength(response.data?.length || '');
          setCatchSpecies(response.data?.species_name || '');
          setCatchWeight(response.data?.weight || '');
          setIsAddCatchVisible(true);
        },
      });
    } else {
      setCatchLength('');
      setCatchSpecies('');
      setCatchWeight('');
    }
  }

  async function handleDeleteCatch() {
    if (catchDetails?.id) {
      const response = await catchesStore.delete(catchDetails.id);
      setCatchDetails(null);

      if (response.error) {
        toast.showError('Unable to delete catch');
      } else {
        // toast.showSuccess('Catch deleted');
      }
    }
  }

  useEffect(() => {
    if (
      catchesStore.fetchStatus === FetchStatus.UNFETCHED &&
      networkStore.isNetwork
    ) {
      catchesStore.get();
    }
  }, [catchesStore.fetchStatus, networkStore.isNetwork]);

  return (
    <>
      <View style={styles.networkContainer}>
        <Text style={styles.labelText}>Network</Text>

        <Switch
          onValueChange={val => networkStore.update(val)}
          value={networkStore.isNetwork}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollviewContent}
        style={styles.scrollview}>
        {catchesStore.catches.map(c => (
          <CatchCard
            key={c.id}
            id={c.id}
            onPress={() => setCatchDetails(c)}
            species_name={c.species_name}
            length={c.length}
            weight={c.weight}
          />
        ))}

        {!!catchesStore.createSyncFailures?.length && (
          <>
            <Text>Unable To Create Catches</Text>

            {catchesStore.createSyncFailures.map(c => (
              <CatchCard
                key={c.data.id}
                id={c.data.id}
                onPress={() => setCreateSyncFail(c)}
                species_name={c.data.species_name}
                length={c.data.length}
                weight={c.data.weight}
              />
            ))}
          </>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button onPress={() => setIsAddCatchVisible(true)} title="Add Catch" />
      </View>

      <AddCatchModal
        isVisible={isAddCatchVisible}
        onAddCatchPress={handleCreateCatch}
        onHidePress={() => setIsAddCatchVisible(false)}
        onLengthChange={setCatchLength}
        onSpeciesChange={setCatchSpecies}
        onWeightChange={setCatchWeight}
        species={catchSpecies}
        length={catchLength}
        weight={catchWeight}
        title="Add your catch"
      />

      <CatchDetailsModal
        isVisible={!!catchDetails}
        onDeletePress={handleDeleteCatch}
        onHidePress={() => setCatchDetails(null)}
        details={catchDetails}
      />
    </>
  );
}

const styles = StyleSheet.create({
  addCatchButton: {
    height: 50,
    width: '100%',
  },
  buttonContainer: {
    marginHorizontal: 48,
    marginBottom: 40,
  },
  labelText: {
    paddingRight: 8,
    fontSize: 16,
  },
  networkContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginTop: 60,
    paddingHorizontal: 20,
  },
  scrollview: {},
  scrollviewContent: {
    padding: 20,
  },
});

export {CatchesScreen};
