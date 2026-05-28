import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getExercises } from "../../services/exerciseService";
import "./ExerciseDetail.scss";


function ExerciseDetail() {
  const { id } = useParams(); 
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    getExercises().then((data) => {
      const exercisesByGroup = Array.isArray(data)
        ? data.filter((ex) => ex.muscle_group === id)
        : [];
      setExercises(exercisesByGroup);
    });
  }, [id]);

  if (!exercises.length) {
    return <p>Không có bài tập nào cho nhóm cơ này hoặc đang tải...</p>;
  }

  return (
    <div className="exercise-detail">
      <h1>Bài tập cho nhóm cơ: {id}</h1>
      {exercises.map((exercise) => (
        <div key={exercise._id} style={{ marginBottom: 32 }}>
          <div className="exercise-content">
            <h2>{exercise.name}</h2>
            <p><strong>Nhóm cơ:</strong> {exercise.muscle_group}</p>
            <p><strong>Mô tả:</strong> {exercise.description}</p>
            <p><strong>Dụng cụ:</strong> {exercise.equipment}</p>
            <p><strong>Các bước:</strong></p>
            <div className="steps">
              {Array.isArray(exercise.steps)
                ? exercise.steps.map((s, idx) => (
                    <div key={idx}>{s}</div>
                  ))
                : null}
            </div>
          </div>
          <div className="exercise-media">
            {exercise.img && (
              <img src={exercise.img} alt={exercise.name} />
            )}
            {exercise.video && (
              <a href={exercise.video} target="_blank" rel="noopener noreferrer">
                Xem video hướng dẫn
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExerciseDetail;