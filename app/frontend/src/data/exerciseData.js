import benchhead from "../assets/images/benchhead.jpg";
import lung_blog from "../assets/images/lung_blog.webp";
import leg_day from "../assets/images/Leg-Day-Workout.webp";
import tay_blog from "../assets/images/tay_blog.jpg";
import vai_blog from "../assets/images/vai_blog.webp";
import bung_blog from "../assets/images/bung_blog.jpg";

export const exercisesData = [
    {
      id: 1,
      group: "Ngực",
      img: benchhead, // dùng biến import
      exercises: [
        { id: 101, name: "Hít đất", description: "Bài tập cơ bản cho nhóm cơ ngực." },
        { id: 102, name: "Đẩy ngực với tạ", description: "Tăng cường sức mạnh cơ ngực." },
        { id: 103, name: "Dumbbell Fly", description: "Tập trung vào cơ ngực giữa." },
      ],
    },
    {
      id: 2,
      group: "Lưng",
      img: lung_blog,
      exercises: [
        { id: 201, name: "Kéo xà", description: "Bài tập cơ bản cho cơ lưng xô." },
        { id: 202, name: "Deadlift", description: "Bài tập toàn thân, tập trung vào cơ lưng." },
        { id: 203, name: "Barbell Row", description: "Tăng cường sức mạnh cơ lưng giữa." },
      ],
    },
    {
      id: 3,
      group: "Chân",
      img: leg_day,
      exercises: [
        { id: 301, name: "Squat", description: "Bài tập cơ bản cho nhóm cơ chân." },
        { id: 302, name: "Lunges", description: "Tăng cường sức mạnh cơ đùi và mông." },
        { id: 303, name: "Leg Press", description: "Tập trung vào cơ đùi trước." },
      ],
    },
    {
      id: 4,
      group: "Tay",
      img: tay_blog,
      exercises: [
        { id: 401, name: "Bicep Curl", description: "Tập trung vào cơ tay trước." },
        { id: 402, name: "Tricep Dips", description: "Tập trung vào cơ tay sau." },
        { id: 403, name: "Hammer Curl", description: "Tăng cường sức mạnh cơ tay." },
      ],
    },
    {
      id: 5,
      group: "Vai",
      img: vai_blog,
      exercises: [
        { id: 501, name: "Shoulder Press", description: "Tăng cường sức mạnh cơ vai." },
        { id: 502, name: "Lateral Raise", description: "Tập trung vào cơ vai ngoài." },
        { id: 503, name: "Front Raise", description: "Tập trung vào cơ vai trước." },
      ],
    },
    {
      id: 6,
      group: "Bụng",
      img: bung_blog,
      exercises: [
        { id: 601, name: "Plank", description: "Bài tập cơ bản giúp tăng cường cơ bụng." },
        { id: 602, name: "Crunch", description: "Tập trung vào cơ bụng trên." },
        { id: 603, name: "Leg Raise", description: "Tăng cường cơ bụng dưới." },
      ],
    },
  ];