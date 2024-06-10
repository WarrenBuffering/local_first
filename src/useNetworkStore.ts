import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'network';

type State = {
  isNetwork: boolean;
};

type Actions = {
  update(isNetwork: boolean): void;
  hydrateFromStorage(): void;
};

type NetworkStore = State & Actions;

const initialState: State = {
  isNetwork: false,
};

export const useNetworkStore = create<NetworkStore>(set => ({
  ...initialState,
  update: async isNetwork => {
    set({isNetwork});
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({isNetwork}));
  },
  hydrateFromStorage: async () => {
    const responseStr = await AsyncStorage.getItem(STORAGE_KEY);
    if (responseStr) {
      const response = JSON.parse(responseStr);
      set({...response});
    }
  },
}));
