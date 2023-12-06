import React from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import PomodoroTimer from "../components/PomodoroTimer";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import "../App.css";

const Home = () => {
  const { user } = useAuthContext();

  return (
    <div className="App-container">
      <PomodoroTimer />
      <TaskForm />
      {user && <TaskList />}
    </div>
  );
};

export default Home;
