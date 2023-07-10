import axios from "axios";
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' 

import { rootReducer } from "./root-reducer";
import * as api from "../config";

const persisConfig = {
   storage,
   key: 'root',
   whitelist: ['theme'],
}

const persistedReducer = persistReducer(persisConfig, rootReducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(persistedReducer, composeEnhancers(
   applyMiddleware(
      thunk.withExtraArgument({
         api,
         client: axios,
      })
   )
));

export {store};
export const persistor = persistStore(store);