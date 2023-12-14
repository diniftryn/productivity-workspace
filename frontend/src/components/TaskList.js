import React, { useEffect } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";
import TaskListItem from "./TaskListItem";
import SortableTaskList from "./SortableTaskList";

const TaskList = () => {
  const { tasks, dispatch } = useTasksContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch("https://productivity-workspace-backend.onrender.com/api/tasks", {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const json = await response.json();

      if (!response.ok) {
        console.log(json.error);
      }
      if (response.ok) {
        dispatch({ type: "SET_TASKS", payload: json });
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [dispatch, user]);
  function setTasks() {
    dispatch({ type: "SET_TASKS", payload: tasks });
  }

  // return <div>{tasks && tasks.map(task => <TaskListItem key={task._id} task={task} />)}</div>;
  return <>{tasks && <SortableTaskList className="list" value={tasks} taskListItem={TaskListItem} onChange={setTasks} />}</>;
};

export default TaskList;
