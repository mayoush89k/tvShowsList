import React, { useState } from "react";
import { useShowList } from "../context/ShowListContext";

export default function EditShow({ item, setIsOpenEditModel }) {
  //   const [editError, setEditError] = useState("");
  const [editedItem, setEditedItem] = useState(item);
  const { error, setError, editShowData } = useShowList();

  const saveHandle = (e) => {
    e.preventDefault();
    console.log("editedItem: ", editedItem);
    editShowData(editedItem);
    !error && setIsOpenEditModel(true);
    if (!error) {
        setIsOpenEditModel(false);
    }
  };
  return (
    <form className="editContainer">
      <button className="close" onClick={() => setIsOpenEditModel(false)}>
        X
      </button>
      <div className="title">Edit {editedItem.name}</div>
      <label>Name</label>
      <input
        id="editName"
        type="text"
        placeholder={editedItem.name}
        onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
      />
      <div className="ratingContainer">
        <label>Rating:</label>
        <select
          id="editRating"
          value={editedItem.rating}
          onChange={(e) =>
            setEditedItem({ ...editedItem, rating: Number(e.target.value) })
          }
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div className="yearContainer">
        <label>Year</label>
        <input
          id="editYear"
          type="text"
          placeholder={editedItem.year}
          onChange={(e) =>
            setEditedItem({ ...editedItem, name: e.target.value })
          }
        />
      </div>
      <div className="editSeasonContainer">
        <label>Season:</label>
        <input
          id="editSeason"
          type="number"
          placeholder={editedItem.season}
          onChange={(e) => {
            if (Number(e.target.value) < 0) {
              setError("Season must be Positive");
            } else {
              setError("");
              setEditedItem({ ...editedItem, season: Number(e.target.value) });
            }
          }}
        />
      </div>
      <div className="editEpisodeContainer">
        <label>Episode:</label>
        <input
          id="editEpisode"
          type="number"
          placeholder={editedItem.episode}
          onChange={(e) => {
            if (Number(e.target.value) < 0) {
              setError("Episode Must be Positive");
            } else {
              setError("");
              setEditedItem({ ...editedItem, episode: Number(e.target.value) });
            }
          }}
        />
      </div>
      {error && <label>{error}</label>}
      <button className="submit" onClick={saveHandle}>
        Save
      </button>{" "}
    </form>
  );
}
