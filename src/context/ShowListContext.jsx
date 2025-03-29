import { createContext, useContext, useEffect, useState } from "react";
import { editItem, getAllItems, openDB } from "./IndexedDB";

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
    localStorage.getItem("filterYear") ? localStorage.getItem("filterYear") : ""
  );

  const [toView, setToView] = useState(
    localStorage.getItem("toView") ? localStorage.getItem("toView") : "All"
  );

  useEffect(() => {
    setLoading(true);
    openDB().then(loadItems);
    filterYears();
    console.log(yearsList);

    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    localStorage.setItem("year", year);
    loadItems();
  }, [year]);

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
      year ? storedItems.filter((item) => item.year == year) : storedItems
    );
  };

  // get all Completed items and also check if the year has been selected
  const getCompleted = async () => {
    setListLoading(true);
    const storedItems = await getAllItems();
    const completedItems = storedItems.filter((item) => item.isCompleted);
    setShowList(
      year ? completedItems.filter((item) => item.year == year) : completedItems
    );
  };

  // get all inComplete items and also check if the year has been selected
  const getInComplete = async () => {
    setListLoading(true);
    const storedItems = await getAllItems();
    const inCompleteItems = storedItems.filter((item) => !item.isCompleted);
    setShowList(
      year
        ? inCompleteItems.filter((item) => item.year == year)
        : inCompleteItems
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
      year ? toWatchItems.filter((item) => item.year == year) : toWatchItems
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
      year
        ? inProgressItems.filter((item) => item.year == year)
        : inProgressItems
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
      const response = await fetch("http://10.0.0.12:3434/shows");
      const data = await response.json();
      console.log(data);
      setShowList(data);
      loadItems();
    } catch (error) {
      setError(error);
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
      }}
    >
      {children}
    </ShowListContext.Provider>
  );
};
