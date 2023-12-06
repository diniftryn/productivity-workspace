import React, { useState } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";
import "../css/TaskForm.css";

const TaskForm = () => {
  const { dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const [task, setTask] = useState({ description: "", isEdit: false, isDone: false });
  const [error, setError] = useState("");
  const [emptyFields, setEmptyFields] = useState([]);

  function handleChange(inputIdentifier, value) {
    setTask({ ...task, [inputIdentifier]: value });
  }

  const handleSubmit = async e => {
    e.preventDefault();

    if (!user) {
      setError("Log in to add tasks :)");
      return;
    }

    const response = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      console.log("New task added successfully: ", json);
      setTask({ description: "", isEdit: false, isDone: false });
      dispatch({ type: "CREATE_TASK", payload: json });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={task.description} onChange={e => handleChange("description", e.target.value)} className={emptyFields.includes("description") ? "error" : ""} />
      <button>Add Task</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default TaskForm;
