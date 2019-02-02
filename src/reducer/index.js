import { combineReducers } from 'redux';
import auth from './auth';
import realtimesync from './realtimesync';

const HYU_OMS_APP = combineReducers({
  auth,
  realtimesync
});

export default HYU_OMS_APP;