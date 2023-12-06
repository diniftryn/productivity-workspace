import React, { useState } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";
import "../css/TaskList.css";
import { TfiCheck, TfiPencil, TfiPencilAlt, TfiTrash } from "react-icons/tfi";

const TaskListItem = ({ dragged, dragging, task, ...rest }) => {
  const { dispatch } = useTasksContext();
  const [editTask, setTask] = useState(task);
  const { user } = useAuthContext();

  let taskContent;

  if (task.isEdit) {
    taskContent = (
      <>
        <input value={editTask.description} onChange={e => handleChange("description", e.target.value)} />
      </>
    );
  } else {
    taskContent = <>{task.description}</>;
  }

  function handleChange(inputIdentifier, value) {
    setTask({ ...editTask, [inputIdentifier]: value });
    console.log(value);
  }

  const handleDelete = async () => {
    if (!user) return;

    const response = await fetch("https://productivity-workspace-backend/api/tasks/" + task._id, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` }
    });
    const json = await response.json();

    if (!response.ok) {
      console.log(json.error);
    }
    if (response.ok) {
      dispatch({ type: "DELETE_TASK", payload: json });
      console.log("New task deleted successfully: ", json);
    }
  };

  const handleUpdate = async type => {
    if (!user) return;

    let updatedTask;
    if (type === "toggleDone") {
      updatedTask = { ...task, isDone: !task.isDone };
    } else if (type === "toggleEdit") {
      updatedTask = { ...task, isEdit: !task.isEdit };
    } else if (type === "save") {
      updatedTask = { ...task, isEdit: !task.isEdit, description: editTask.description };
    }

    const response = await fetch("http://localhost:4000/api/tasks/" + task._id, {
      method: "PATCH",
      body: JSON.stringify(updatedTask),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (!response.ok) {
      console.log(json.error);
    }
    if (response.ok) {
      dispatch({ type: "UPDATE_TASK", payload: updatedTask });
      console.log("New task updated successfully: ", json);
    }
  };

  return (
    <div {...rest} className={`list__item ${dragged ? "list__item--dragged" : ""}`}>
      <div className="list__item-content">
        <div className="list__item-title">
          <span className="list-checkbox">
            <button className={`list__item-btn ${task.isDone ? "task-done" : ""}`} onClick={() => handleUpdate("toggleDone")}>
              <TfiCheck />
            </button>
          </span>
          <span className="list-input">
            <span className={`task-item ${task.isDone ? "task-done" : ""}`}>{taskContent}</span>
          </span>
          <span className="list-edit-delete">
            <button className="list__item-btn" onClick={task.isEdit ? () => handleUpdate("save") : () => handleUpdate("toggleEdit")}>
              {task.isEdit ? <TfiPencilAlt /> : <TfiPencil />}
            </button>
            <button className="list__item-btn" onClick={handleDelete}>
              <TfiTrash />
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskListItem;
