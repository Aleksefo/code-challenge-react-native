import AsyncStorage from "@react-native-async-storage/async-storage";
import { initialState } from "@/state/initialState";
import { Dispatch } from "react";
import { Action } from "@/types/state";
const appStateKey = "appStateKey";

export const loadStoredState = async (dispatch: Dispatch<Action>) => {
  try {
    const savedState = await AsyncStorage.getItem(appStateKey);
    if (savedState === null) {
      dispatch({
        type: "loadStoredState",
        payload: { state: {} },
      });
      await AsyncStorage.setItem(appStateKey, JSON.stringify(initialState));
    } else {
      dispatch({
        type: "loadStoredState",
        payload: { state: JSON.parse(savedState) },
      });
    }
  } catch (error) {
    if (__DEV__) console.log("retrieveData error " + error);
  }
};

export const mergeAppState = async (value: object) => {
  try {
    await AsyncStorage.mergeItem(appStateKey, JSON.stringify(value));

    const state = await AsyncStorage.getItem(appStateKey);
    if (__DEV__)
      console.log("storageService, mergeAppState", state && JSON.parse(state));
  } catch (e: any) {
    if (__DEV__)
      console.log("storageService, mergeAppState ERROR", JSON.parse(e));
  }
};
