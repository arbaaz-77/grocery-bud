import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";
import { FaShoppingBasket } from "react-icons/fa";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(localStorage.getItem("list"));
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    type: "",
  });

  // submit button function
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      // Alert
      showAlert(true, "Please enter a value", "danger");
    } else if (name && isEditing) {
      // deal with edit
      setList(
        list.map((item) => {
          if (item.id === editId) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName("");
      setEditId(null);
      setIsEditing(false);
      showAlert(true, "Item edited", "success");
    } else {
      // Alert
      showAlert(true, "item added", "success");
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  };

  // show alerts
  const showAlert = (show = false, msg = "", type = "") => {
    setAlert({ show, msg, type });
  };

  // clear entire list
  const clearList = () => {
    showAlert(true, "all items removed", "danger");
    setList([]);
  };

  // remove item
  const removeItem = (id) => {
    showAlert(true, "item removed", "danger");
    setList(list.filter((item) => item.id !== id));
  };

  // edit item
  const editItem = (id) => {
    const currentItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditId(id);
    setName(currentItem.title);
  };

  // save to local storage
  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>
          Grocery Bud <FaShoppingBasket />
        </h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="eggs?"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "Edit" : "Submit"}
          </button>
        </div>
      </form>

      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            Clear Items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
