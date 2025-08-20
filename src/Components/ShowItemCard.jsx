import React, { useEffect, useState } from "react";
import EditingShow from "./EditingShow";
import { useShowList } from "../context/ShowListContext";
import EditShow from "./EditShow";

function ShowItemCard({ item }) {
  const [error, setError] = useState("");
  const [isOpenEditModel, setIsOpenEditModel] = useState(false);
  const {
    updateIsComplete,
    increaseSeason,
    decreaseSeason,
    increaseEpisode,
    decreaseEpisode,
    reWatchShow,
    deleteAShow,
  } = useShowList();

  // make the tooltip buttons index behind the modal i have to save them here
  const tooltipButtons = document.querySelectorAll(".tooltip-btn");

  useEffect(() => {
    const cards = document.querySelector(".cardFull");
    isOpenEditModel
      ? tooltipButtons.forEach((tooltipB) => (tooltipB.style.zIndex = -1))
      : tooltipButtons.forEach((tooltipB) => (tooltipB.style.zIndex = 1));
      isOpenEditModel ? cards.style.display = "none" : cards.style.display = "block";
      // console.log(cards)
    // isOpenEditModel
    //   ? cards.forEach((card) => (card.style.zIndex = -12))
    //   : cards.forEach((card) => (card.style.zIndex = 0));
  }, [isOpenEditModel]);

  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 1500);
  }, [error]);

  return (
    <section
      className="cardContainer "
      id={
        item.episode == 0
          ? "toWatch"
          : item.isCompleted
          ? "watched"
          : "inProgress"
      }
    >
      {isOpenEditModel && (
        // <EditingShow item={item} setIsOpenEditModel={setIsOpenEditModel} />
        <EditShow item={item} setIsOpenEditModel={setIsOpenEditModel} />
      )}
      {/* flex dir col */}
      <div className="cardSplit cardFull">
        <div className="title">{item.name}</div>
        <div className="card">
          {/* flex dir row */}
          <div className="cardHeader">
            {/* header */}
            {/* flex d col */}
            {typeof(item.year)}
            {item.year > 0 ? (
              <div className="title">{item.year}</div>
            ) : (
              <div>-</div>
            )}
            <div className="completedIcon">
              <span
                style={{
                  cursor: "pointer",
                  color: item.isCompleted ? "green" : "red",
                  marginRight: "10px",
                }}
                onClick={() => updateIsComplete(item)}
              >
                {item.isCompleted ? "✔" : "✖"}
              </span>
            </div>
          </div>
          {/* Rating */}
          {/* 
        <div>
          <StarRating rating={item.rating} />
        </div> */}
          {/* Inc/Dec Season */}
          <div className="SeasonContainer">
            <label>Season: {item.season}</label>
            <span className="seasonButtons">
              <input
                type="button"
                className="bMinus"
                value="-"
                onClick={() => {
                  item.season - 1 < 1
                    ? setError("Season Must be greater than 0")
                    : decreaseSeason(item);
                }}
              />

              <input
                type="button"
                value="+"
                className="bPlus"
                onClick={() => {
                  increaseSeason(item);
                }}
              />
            </span>
          </div>
          {/* Inc/Dec Episode */}
          <div className="EpisodeContainer">
            <label>Episode: {item.episode}</label>
            <span className="episodeButtons">
              <input
                type="button"
                className="bMinus"
                value="-"
                onClick={() => {
                  item.episode - 1 < 1
                    ? setError("Episode Must be Positive")
                    : decreaseEpisode(item);
                }}
              />
              <input
                type="button"
                value="+"
                className="bPlus"
                onClick={() => {
                  increaseEpisode(item);
                }}
              />
            </span>
          </div>
          {/* buttons */}
          <div className="buttons-container">
            {/* Re-Watch */}
            <button
              className="tooltip-btn"
              onClick={() => {
                reWatchShow(item);
              }}
            >
              ↩️
              <span className="tooltip-text">Re-Watch</span>
            </button>
            {/* Delete */}
            <button
              className="tooltip-btn"
              onClick={() => {
                deleteAShow(item);
              }}
            >
              🗑️
              <span className="tooltip-text">Delete</span>
            </button>
            {/* Edit */}
            <button
              className="tooltip-btn"
              title="Edit"
              onClick={() => {
                setIsOpenEditModel(true);
              }}
            >
              ✏️
              <span className="tooltip-text">Edit</span>
            </button>
          </div>
        </div>
      </div>
      {error && <h4>{error}</h4>}
    </section>
  );
}

export default ShowItemCard;
