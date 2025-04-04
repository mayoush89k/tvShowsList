import React, { useEffect, useState } from "react";
import { useShowList } from "../context/ShowListContext";
import ShowItemCard from "./ShowItemCard";
import "./Menu.css";
import AddShow from "./AddShow";

export default function ShowsList() {
  const {
    showList,
    error,
    loading,
    listLoading,
    setToView,
    loadItems,
    yearsList,
    year,
    setYear,
    saveMyData,
  } = useShowList();

  const [toViewSelect, setToViewSelect] = useState(
    localStorage.getItem("toView")
  );
  const [compSelect, setCompSelect] = useState("");
  const [inCompSelect, setInCompSelect] = useState("");

  useEffect(() => {
    localStorage.setItem("toView", toViewSelect);
    setToView(toViewSelect);
    setInCompSelect(toViewSelect);
    setCompSelect(
      toViewSelect == "ToWatch" || toViewSelect == "InProgress"
        ? "InComplete"
        : toViewSelect
    );
    loadItems();
  }, [toViewSelect, localStorage.getItem("toView")]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error.. </p>
      ) : (
        <section>
          <section className="menu-container">
            <AddShow />
            <input
              className="search"
              type="text"
              placeholder="Search"
              // onChange={searchForShow}
            />
            <select
              className="filters"
              onChange={(e) => {
                setToViewSelect(e.target.value);
              }}
              value={compSelect}
            >
              <option value="" disabled hidden>
                Choose an option
              </option>
              <option value="All">All</option>
              <option value="Completed">Completed</option>
              <option value="InComplete">InComplete</option>
            </select>

            {compSelect == "InComplete" && (
              <select
                onChange={(e) => setToViewSelect(e.target.value)}
                className="filters"
                value={inCompSelect}
              >
                <option value="" disabled hidden>
                  Choose an option
                </option>
                <option value="InComplete">All</option>
                <option value="InProgress">in Progress</option>
                <option value="ToWatch">To Watch</option>
              </select>
            )}
            <select
              className="filters"
              onChange={(e) => {
                setYear(Number(e.target.value));
              }}
              value={year}
            >
              <option value="0">All Years</option>
              {yearsList.map((currYear, key) => (
                <option value={currYear} key={key}>
                  {currYear}
                </option>
              ))}
            </select>
            <section className="quantity">
              {listLoading ? <p>Loading... </p> : showList?.length}
            </section>
          </section>
          <button onClick={saveMyData}>save all Data</button>
          <section className="showList">
            {listLoading ? (
              <p>Loading... </p>
            ) : showList?.length == 0 ? (
              <h1 className="">No shows found</h1>
            ) : (
              showList.map((item) => (
                <ShowItemCard item={item} key={item.id || item._id} />
              ))
            )}
          </section>
        </section>
      )}
    </div>
  );
}
