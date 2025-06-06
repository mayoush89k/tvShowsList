const DB_NAME = "ShowList";
const STORE_NAME = "data";

export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(STORE_NAME, { keyPath: "id" });
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};
export const getItemByName = async (name) => {
  const db = await openDB();
  return new Promise((resolve) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () =>
      resolve(request.result.find((item) => name == item.name));
    request.onerror = () => reject("Error fetching name");
  });
};
export const addItem = async (item) => {
  if (!item.id) {
    item.id = item._id || Date.now().toString();
  }
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  store.add(item);
};

export const deleteItem = async (item) => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  store.delete(item.id);
};

export const editItem = async (item) => {
  console.log(item);

  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  const request = store.get(item.id || item._id);
  request.onsuccess = (event) => {
    let existingItem = event.target.result;
    existingItem = { ...existingItem, ...item };
    store.put(existingItem);
  };
};

export const getAllItems = async () => {
  const db = await openDB();
  return new Promise((resolve) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
  });
};

export const clearStore = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve("Store cleared.");
    request.onerror = () => reject("Error clearing store.");
  });
};

export const saveNewData = async (data) => {
  await clearStore();
  await data.forEach(async (item) => await addItem({ ...item, id: item._id }));
  //   getAllItems();
};

export const uploadingData = async (data) => {
  const currAllData = await getAllItems();
  currAllData.forEach(async(item) =>
    data.find((d) => d.name == item.name) ? await fetchUpdate(item) : await fetchAdd(item)
  );
};

const fetchUpdate = async (item) => {
  try {
    const response = await fetch(`https://tvtracker.onrender.com/shows/${item._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating item:", error);
  }
};

const fetchAdd = async (item) => {
  try {
    const response = await fetch(`http://localhost:27017/shows/${item._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding item:", error);
  }
};


export const fetchingLoadMyData = async (username, list) => {
  try {
    const response = await fetch(`http://localhost:3434/:${username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(list),
    });
    return await response.json();
  } catch (error) {
    console.error("Error loading items:", error);
    
  }
}