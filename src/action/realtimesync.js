const ORDER_UPDATE = "ORDER_UPDATE";
const QUEUE_UPDATE = "QUEUE_UPDATE";
const MENU_UPDATE = "MENU_UPDATE";
const SETMENU_UPDATE = "SETMENU_UPDATE";

function orderUpdate(date) {
  return {"type": ORDER_UPDATE, "date": date};
}

function queueUpdate(date) {
  return {"type": QUEUE_UPDATE, "date": date};
}

function menuUpdate(date) {
  return {"type": MENU_UPDATE, "date": date};
}

function setmenuUpdate(date) {
  return {"type": SETMENU_UPDATE, "date": date};
}

export {
  ORDER_UPDATE,
  QUEUE_UPDATE,
  MENU_UPDATE,
  SETMENU_UPDATE,
  orderUpdate,
  queueUpdate,
  menuUpdate,
  setmenuUpdate
}