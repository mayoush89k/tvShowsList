import React, { useState } from "react";
import { useShowList } from "../context/ShowListContext";
import Spinner from "./Spinner";

function EditingShow({ item, setIsOpenEditModel }) {
  const [editedItem, setEditedItem] = useState(item);

  const { editError, editLoading, editShowData } = useShowList();
  const saveHandle = (e) => {
    e.preventDefault();
    editShowData(editedItem);
    !editError && setIsOpenEditModel(true);
    if (!editError && !editLoading) {
      setIsOpenEditModel(false);
    }
  };
  return (
    <section className="editModal">
      {editLoading ? (
        <Spinner size="Big" title={`Updating ${item.name}`} />
      ) : (
        <section>
          <section className="modalHeader">
            <h2>Edit {item.name} </h2>
            <button
              style={{ padding: "10px" }}
              onClick={() => setIsOpenEditModel(false)}
            >
              X
            </button>
          </section>
          <form>
            <input
              onChange={(e) =>
                setEditedItem({ ...editedItem, name: e.target.value })
              }
              type="text"
              value={editedItem.name}
            />
            <label>Year:</label>
            <input
              onChange={(e) =>
                setEditedItem({ ...editedItem, year: Number(e.target.value) })
              }
              type="number"
              value={editedItem.year}
            />
            <section className="formES">
              <label>Season:</label>
              <input
                onChange={(e) =>
                  setEditedItem({
                    ...editedItem,
                    season: Number(e.target.value),
                  })
                }
                type="number"
                value={editedItem.season}
              />
              <label>Episode:</label>
              <input
                onChange={(e) =>
                  setEditedItem({
                    ...editedItem,
                    episode: Number(e.target.value),
                  })
                }
                type="number"
                value={editedItem.episode}
              />
            </section>
            <label>Rating:</label>
            <select
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
            {editError && <label>{editError}</label>}
            <button className="submit" onClick={saveHandle}>Save</button>
          </form>
        </section>
      )}
    </section>
  );
}

export default EditingShow;
