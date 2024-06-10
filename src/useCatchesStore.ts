import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {v4} from 'uuid';

import {FetchStatus} from './enums';
import {useNetworkStore} from './useNetworkStore';
import {request} from './utils/request';

import type {
  BulkCreateError,
  BulkCreateResponse,
  BulkDeleteResponse,
  BulkDeleteError,
  FishCatch,
  RequestResponse,
} from './types';

/* ============================================================================
= Constants 
=============================================================================*/

const BASE_URL = 'http://localhost:4000/api/fish_catches';
const STORAGE_KEY = 'fish_catches';

/* ============================================================================
= Types
=============================================================================*/

type FishCatchID = FishCatch['id'];
type FishCatchMeta = Omit<FishCatch, 'id'>;

type State = {
  catches: FishCatch[];
  createdIDs: FishCatchID[];
  createSyncFailures: BulkCreateError[];
  deletedIDs: FishCatchID[];
  deleteSyncFailures: BulkDeleteError[];
  fetchStatus: FetchStatus;
};

type PersistedStore = Omit<State, 'fetchStatus'>;

type Actions = {
  create(data: FishCatchMeta): Promise<RequestResponse<FishCatch>>;
  delete(id: FishCatchID): Promise<RequestResponse<FishCatchID>>;
  get(): Promise<RequestResponse<FishCatch[]>>;
  updateStorage(data: Partial<Omit<State, 'fetchStatus'>>): void;
  sync(): Promise<Array<RequestResponse<FishCatch>>>;
};

type CatchStore = State & Actions;

/* ============================================================================
= Initial State
=============================================================================*/

const initialState: State = {
  catches: [],
  createdIDs: [],
  createSyncFailures: [],
  deletedIDs: [],
  deleteSyncFailures: [],
  fetchStatus: FetchStatus.UNFETCHED,
};

/* ============================================================================
= Helpers 
=============================================================================*/

/* ============================================================================
= Store 
=============================================================================*/

export const useCatchesStore = create<CatchStore>((set, get) => ({
  ...initialState,
  create: async data => {
    const tempID: string = v4();

    // optimistically create catch
    const optimisticCatch = {...data, id: tempID};
    const optimisticCatches = [...get().catches, optimisticCatch];

    set({catches: optimisticCatches});

    // if no network, add tempID to createdIDs and update storage
    if (!useNetworkStore.getState().isNetwork) {
      const updatedCreatedIDs = [...get().createdIDs, tempID];
      set({createdIDs: updatedCreatedIDs});
      get().updateStorage({
        catches: optimisticCatches,
        createdIDs: updatedCreatedIDs,
      });
      return {data: optimisticCatch, error: null};
    }

    // if network, make create request
    const response = await request<FishCatch>({
      body: JSON.stringify({fish_catch: data}),
      method: 'POST',
      url: BASE_URL,
    });

    // on create request success, replace catch temp id with server generated id
    if (response.data) {
      const catchesWithServerID = optimisticCatches.map(c => {
        if (c.id === tempID) {
          return {...c, id: response.data?.id};
        } else {
          return c;
        }
      });

      set({catches: catchesWithServerID});
      get().updateStorage({catches: catchesWithServerID});

      return response;
    } else {
      // on create request failure revert optimistic creation and return
      const catchesRevert = optimisticCatches.filter(c => c.id !== tempID);

      set({catches: catchesRevert});
      get().updateStorage({catches: catchesRevert});
      return {...response, data};
    }
  },

  delete: async id => {
    // optimistic updates
    const currCatches = [...get().catches];
    const optimisticCatches: FishCatch[] = [];
    let deletedCatch: FishCatch | null = null;

    // filter out the deleted catch
    currCatches.forEach(c => {
      if (c.id === id) {
        deletedCatch = c;
      } else {
        optimisticCatches.push(c);
      }
    });

    // if catch to delete isn't found
    if (!deletedCatch) {
      return {
        data: null,
        error: {code: 3, message: 'No catch found with provided id'},
      };
    }

    // make optimistic updates
    set({catches: optimisticCatches});

    // if there is no network
    if (!useNetworkStore.getState().isNetwork) {
      // if catch is in createdIDs (was created offline)
      // remove id from createdIDs (avoid sync later)
      if (get().createdIDs.includes(id)) {
        console.log('here');
        const updatedCreatedIDs = get().createdIDs.filter(
          createID => createID !== id,
        );
        set({createdIDs: updatedCreatedIDs});
        get().updateStorage({
          catches: optimisticCatches,
          createdIDs: updatedCreatedIDs,
        });
        // if catch wasn't created offline
        // add id to deleted queue and return success
      } else {
        const deleteIDAdded = [...get().deletedIDs, id];
        set({deletedIDs: deleteIDAdded});
        console.log('deletedIDs', deleteIDAdded);
        get().updateStorage({
          catches: optimisticCatches,
          deletedIDs: deleteIDAdded,
        });
      }

      return {data: deletedCatch, error: null};
    }

    // if network, try to make the delete request
    const response = await request({
      url: `${BASE_URL}/${id}`,
      method: 'DELETE',
    });

    // on deletion request fail, add the deleted catch back to store catches
    if (response.error) {
      set({catches: currCatches});
      get().updateStorage({catches: currCatches});
      return {data: {id}, error: response.error};
    }

    // on delete request succeed, update persisted storage
    get().updateStorage({catches: optimisticCatches});
    return {
      data: deletedCatch,
      error: null,
    };
  },

  get: async () => {
    const response = await request<FishCatch[]>({url: BASE_URL});

    if (response.data) {
      set({catches: response.data});
    }

    return response;
  },

  hydrateFromStorage: async () => {
    const persistedDataStr = await AsyncStorage.getItem(STORAGE_KEY);

    if (typeof persistedDataStr === 'string') {
      const persistedData: PersistedStore = JSON.parse(persistedDataStr);
      set({...persistedData});
    } else {
      // TODO: handle hydration error
    }
  },

  updateStorage: async data => {
    const persistedData: PersistedStore = {
      catches: data?.catches || get().catches,
      createdIDs: data?.createdIDs || get().createdIDs,
      createSyncFailures: data?.createSyncFailures || get().createSyncFailures,
      deletedIDs: data?.deletedIDs || get().deletedIDs,
      deleteSyncFailures: data?.deleteSyncFailures || get().deleteSyncFailures,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(persistedData));
  },

  sync: async () => {
    const catchesToCreate: FishCatch[] = [];
    const updatedCatches: FishCatch[] = [...get().catches];
    const idsToDelete = get().deletedIDs;
    let createSyncFailures: BulkCreateError[] = [];
    let deleteSyncFailures: BulkDeleteError[] = [];

    // create all catches needing creation from persisted createdIDs
    get().catches.forEach(c => {
      if (get().createdIDs.includes(c.id)) {
        catchesToCreate.push(c);
      }
    });

    // if there's been new catches, go ahead and try to update them
    if (catchesToCreate.length) {
      const syncCreateResponse = await request<BulkCreateResponse>({
        url: `${BASE_URL}/bulk_create`,
        method: 'POST',
        body: JSON.stringify({fish_catches: catchesToCreate}),
      });

      if (syncCreateResponse.error) {
        const failedCreateIDs: FishCatchID[] = [];

        catchesToCreate.forEach(c => {
          createSyncFailures.push({...c, errors: {}});
        });
        updatedCatches.filter(c => !failedCreateIDs.includes(c.id));
      } else if (syncCreateResponse.data?.errors?.length) {
        createSyncFailures = syncCreateResponse.data.errors;
      }
    }

    if (idsToDelete?.length) {
      const syncDeleteResponse = await request<BulkDeleteResponse>({
        url: `${BASE_URL}/bulk_delete`,
        method: 'DELETE',
        body: JSON.stringify({ids: idsToDelete}),
      });

      if (syncDeleteResponse.error) {
        deleteSyncFailures = idsToDelete.map(id => ({
          id,
          error: syncDeleteResponse.error,
        }));
      } else if (syncDeleteResponse.data?.errors?.length) {
        deleteSyncFailures = syncDeleteResponse.data.errors;
      }
    }

    const syncUpdate = {
      catches: updatedCatches,
      createSyncFailures,
      deleteSyncFailures,
      createdIDs: [],
      deletedIDs: [],
    };

    set({...syncUpdate});
    get().updateStorage(syncUpdate);
  },
}));
