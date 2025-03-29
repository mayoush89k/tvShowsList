import { createContext, useContext, useEffect, useState } from "react";
import {
  addItem,
  editItem,
  getAllItems,
  getItemByName,
  openDB,
  saveNewData,
} from "./IndexedDB";

export const ShowListContext = createContext();

export const useShowList = () => useContext(ShowListContext);

export const ShowListProvider = ({ children }) => {
  const [showList, setShowList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState("");
  const [yearsList, setYearsList] = useState([]);
  const [year, setYear] = useState(
    localStorage.getItem("filterYear")
      ? localStorage.getItem("filterYear")
      : "AllYears"
  );
  const [filterYear, setFilterYear] = useState(0);
  const [toView, setToView] = useState(
    localStorage.getItem("toView") ? localStorage.getItem("toView") : "All"
  );
  const [newShowLoading, setNewShowLoading] = useState(false);
  const [newShowError, setNewShowError] = useState("");

  useEffect(() => {
    setLoading(true);
    openDB().then(loadItems);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    filterYears();
    setFilterYear(localStorage.setItem("filterYear", year));
    loadItems();
  }, [toView, year]);

  const loadItems = () => {
    toViewList();
  };

  const toViewList = () => {
    switch (toView) {
      case "All":
        getAll();
        break;
      case "Completed":
        getCompleted();
        break;
      case "InComplete":
        getInComplete();
        break;
      case "ToWatch":
        getToWatch();
        break;
      case "InProgress":
        getInProgress();
        break;

      default:
        getAll();
        break;
    }
    setTimeout(() => {
      setListLoading(false);
    }, 1500);
  };

  // get all items and also check if the year has been selected
  const getAll = async () => {
    setListLoading(true);
    const storedItems = await getAllItems();
    setShowList(
      year > 0
        ? storedItems
            .filter((item) => item.year == year)
            .sort((a, b) => a.name.localeCompare(b.name))
        : storedItems.sort((a, b) => a.name.localeCompare(b.name))
    );
  };

  // get all Completed items and also check if the year = ""has been selected
  const getCompleted = async () => {
    setListLoading(true);
    const storedItems = await getAllItems();
    const completedItems = storedItems.filter((item) => item.isCompleted);
    setShowList(
      year > 0
        ? completedItems
            .filter((item) => item.year == year)
            .sort((a, b) => a.name.localeCompare(b.name))
        : completedItems.sort((a, b) => a.name.localeCompare(b.name))
    );
  };

  // get all inComplete items and also check if the year has been selected
  const getInComplete = async () => {
    setListLoading(true);
    const storedItems = await getAllItems();
    const inCompleteItems = storedItems.filter((item) => !item.isCompleted);
    setShowList(
      year > 0
        ? inCompleteItems
            .filter((item) => item.year == year)
            .sort((a, b) => a.name.localeCompare(b.name))
        : inCompleteItems.sort((a, b) => a.name.localeCompare(b.name))
    );
  };

  // get to-Watch items and also check if the year has been selected
  const getToWatch = async () => {
    setListLoading(true);
    const storedItems = await getAllItems();
    const toWatchItems = storedItems.filter(
      (item) => item.episode == 0 && !item.isCompleted
    );
    setShowList(
      year > 0
        ? toWatchItems
            .filter((item) => item.year == year)
            .sort((a, b) => a.name.localeCompare(b.name))
        : toWatchItems.sort((a, b) => a.name.localeCompare(b.name))
    );
  };

  // get inProgress items and also check if the year has been selected
  const getInProgress = async () => {
    setListLoading(true);
    const storedItems = await getAllItems();
    const inProgressItems = storedItems.filter(
      (item) => item.episode > 0 && !item.isCompleted
    );
    setShowList(
      year > 0
        ? inProgressItems
            .filter((item) => item.year == year)
            .sort((a, b) => a.name.localeCompare(b.name))
        : inProgressItems.sort((a, b) => a.name.localeCompare(b.name))
    );
  };

  // filter the years of all the items and sort them Asc
  const filterYears = async () => {
    const storedItems = await getAllItems();

    const years = storedItems.filter((item) => item.year > 0);
    const filteredYearsList = years.reduce((acc, item) => {
      if (!acc.includes(item.year)) acc.push(item.year);
      return acc;
    }, []);
    setYearsList(filteredYearsList.sort((a, b) => a - b));
  };

  // editing the show requests and response
  const editShowData = async (item) => {
    setEditLoading(true);
    await editItem(item);
    loadItems();
  };

  // changing Complete between true and false
  const updateIsComplete = async (item) => {
    setListLoading(true);
    await editItem({ ...item, isCompleted: !item.isCompleted });
    loadItems();
  };

  //  re-watch means that will start the episodes from the beginning and that will move the show to inProgress
  const reWatchShow = async (item) => {
    setListLoading(true);
    await editItem({ ...item, episode: 0, isCompleted: false });
    loadItems();
  };

  // get list by search
  const ListBySearch = async (text) => {
    setListLoading(true);
    const storedItems = await getAllItems();
    const filteredList = storedItems.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setShowList(filteredList);
    loadItems();
  };

  // Increasing Season
  const increaseSeason = async (item) => {
    setListLoading(true);
    await editItem({ ...item, season: item.season + 1 });
    loadItems();
  };
  // Decreasing Season
  const decreaseSeason = async (item) => {
    setListLoading(true);
    await editItem({ ...item, season: item.season - 1 });
    loadItems();
  };
  // Increasing Episode
  const increaseEpisode = async (item) => {
    setListLoading(true);
    await editItem({ ...item, episode: item.episode + 1 });
    loadItems();
  };
  // Decreasing Episode
  const decreaseEpisode = async (item) => {
    setListLoading(true);
    await editItem({ ...item, episode: item.episode - 1 });
    loadItems();
  };

  const saveMyData = async () => {
    try {
      setListLoading(true);
      const response = await fetch("https://tvtracker.onrender.com/shows/");
      const data = await response.json();
      await saveNewData(data);
      loadItems();
      setListLoading(false);
    } catch (error) {
      setError(error);
    }
  };

  const addNewShowList = async (item) => {
    // setNewShowLoading(true);
    const getItem = await getItemByName(item.name);
    if (getItem) {
      setNewShowError(item.name + " ia Already Exist");
    } else {
      setNewShowLoading(true);
      await addItem(item);
      loadItems();
      setNewShowLoading(false);
    }
  };

  return (
    <ShowListContext.Provider
      value={{
        showList,
        loading,
        error,
        setError,
        listLoading,
        newShowLoading,
        newShowError,
        setNewShowError,
        setToView,
        loadItems,
        filterYears,
        yearsList,
        year,
        setYear,
        editShowData,
        updateIsComplete,
        reWatchShow,
        ListBySearch,
        increaseSeason,
        decreaseSeason,
        increaseEpisode,
        decreaseEpisode,
        saveMyData,
        addNewShowList,
      }}
    >
      {children}
    </ShowListContext.Provider>
  );
};
