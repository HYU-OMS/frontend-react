import {
  ORDER_UPDATE,
  QUEUE_UPDATE,
  MENU_UPDATE,
  SETMENU_UPDATE
} from '../action/realtimesync';

const initialState = {
  "order_updated_date": new Date(),
  "queue_updated_date": new Date(),
  "menu_updated_date": new Date(),
  "setmenu_updated_date": new Date(),
};

const realtimesync = (state = initialState, action) => {
  switch (action.type) {
    case ORDER_UPDATE:
      return Object.assign({}, state, {
        "order_updated_date": action.date
      });

    case QUEUE_UPDATE:
      return Object.assign({}, state, {
        "queue_updated_date": action.date
      });

    case MENU_UPDATE:
      return Object.assign({}, state, {
        "menu_updated_date": action.date
      });

    case SETMENU_UPDATE:
      return Object.assign({}, state, {
        "setmenu_updated_date": action.date
      });

    default:
      return state;
  }
};

export default realtimesync;