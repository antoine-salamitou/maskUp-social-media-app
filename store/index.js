import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducers from '../reducers';

/*const persistConfig = {
  key: 'root',
  storage,
};*/

//const persistedReducer = persistReducer(persistConfig, reducers);

const store = createStore(
  //persistedReducer,
  reducers,
  {},
  compose(
    applyMiddleware(thunk)
  )
);
//const persistor = persistStore(store);

//export default { store, persistor };
export default store;
