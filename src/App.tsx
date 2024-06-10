import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {Toast} from './components/Toast';
import {usePrevious} from './hooks';
import {CatchesScreen} from './CatchesScreen';
import {useCatchesStore} from './useCatchesStore';
import {useNetworkStore} from './useNetworkStore';
import {useToast} from './useToast';

function App(): JSX.Element {
  const [isInitialBoot, setIsInitialBoot] = useState(true);

  const syncCatches = useCatchesStore(state => state.sync);
  const hydrateCatches = useCatchesStore(state => state.hydrateFromStorage);

  const isNetwork = useNetworkStore(state => state.isNetwork);
  const toast = useToast();

  const hydrateNetwork = useNetworkStore(state => state.hydrateFromStorage);

  const prevIsNetwork = usePrevious(isNetwork);

  useEffect(() => {
    if (!prevIsNetwork && isNetwork) {
      syncCatches();
    }
  }, [isNetwork, prevIsNetwork]);

  useEffect(() => {
    if (isInitialBoot) {
      hydrateCatches();
      hydrateNetwork();
      setIsInitialBoot(false);
    }
  }, [isInitialBoot]);

  return (
    <View style={styles.screen}>
      <CatchesScreen />
      <Toast {...toast} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    width: '100%',
  },
});

export default App;
