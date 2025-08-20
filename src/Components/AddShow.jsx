import React, { useEffect, useState } from "react";
import { useShowList } from "../context/ShowListContext";
import Spinner from "./Spinner";

function AddShow() {
  const [newShowItem, setNewShowItem] = useState({ episode: 1, season: 1 });
  const { newShowError, setNewShowError, newShowLoading, addNewShowList } =
    useShowList();
  const [isModalOpen, setIsModalOpen] = useState("");
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // make the tooltip buttons index behind the modal i have to save them here
  const tooltipButtons = document.querySelectorAll(".tooltip-btn");

  const cards = document.querySelectorAll(".cardContainer");

  const saveHandle = (e) => {
    e.preventDefault();
    if (newShowItem.name == "") {
      setNewShowError("Insert Show Name");
    } else {
      addNewShowList(newShowItem);
      setNewShowError(newShowItem.name + " has been added Successfully");
    }

    setTimeout(() => {
      closeModal();
    }, 3000);
  };

  useEffect(() => {
    setNewShowError("");
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      tooltipButtons.forEach((tooltipB) => (tooltipB.style.zIndex = -1));
      cards.forEach((card) => (card.style.zIndex = -1));
    } else {
      tooltipButtons.forEach((tooltipB) => (tooltipB.style.zIndex = 1));
      cards.forEach((card) => (card.style.zIndex = 1));
    }
  }, [isModalOpen]);

  return (
    <section className="">
      <button
        className="addNew"
        onClick={() => {
          setNewShowError("");
          isModalOpen ? closeModal() : openModal();
        }}
      >
        +
      </button>
      {isModalOpen && (
        <section className="addNewModal">
          {newShowLoading ? (
            <Spinner size="Big" title="Adding New Show" />
          ) : newShowError ? (
            <h4>{newShowError}</h4>
          ) : (
            <section className="addModel-container">
              <section className="modalHeader">
                <h2>Add New TV Show </h2>
                <button
                  className="close"
                  style={{ padding: "10px" }}
                  onClick={closeModal}
                >
                  X
                </button>
              </section>
              <form>
                <input
                  onChange={(e) =>
                    setNewShowItem({ ...newShowItem, name: e.target.value })
                  }
                  type="text"
                  placeholder="Enter Show Name"
                />
                <label>Year:</label>
                <input
                  onChange={(e) =>
                    setNewShowItem({
                      ...newShowItem,
                      year: Number(e.target.value),
                    })
                  }
                  type="number"
                  placeholder="Enter Year"
                />
                <section className="formES">
                  <label>Season:</label>
                  <input
                    onChange={(e) =>
                      setNewShowItem({
                        ...newShowItem,
                        season: Number(e.target.value),
                      })
                    }
                    type="number"
                    placeholder="Enter Season"
                    defaultValue="1"
                  />
                  <label>Episode:</label>
                  <input
                    onChange={(e) =>
                      setNewShowItem({
                        ...newShowItem,
                        episode: Number(e.target.value),
                      })
                    }
                    type="number"
                    placeholder="Enter Episode"
                    defaultValue="1"
                  />
                </section>
                <label>Rating:</label>
                <select
                  onChange={(e) =>
                    setNewShowItem({ ...newShowItem, rating: e.target.value })
                  }
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <div className="addNewError">
                  {newShowError && <label className="addNewError">{newShowError}</label>}
                </div>
                <button className="submit" onClick={saveHandle}>
                  Save
                </button>
              </form>
            </section>
          )}
        </section>
      )}
    </section>
  );
}

export default AddShow;
