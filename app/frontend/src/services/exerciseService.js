import { get, post } from "../utils/request";

export const getExercises = () => get("api/exercise");

export const createExercise = (data) => post("api/exercise", data);
