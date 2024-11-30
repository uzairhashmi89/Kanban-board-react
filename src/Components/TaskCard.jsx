import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

function TaskCard(props) {
  const { task, deleteTask } = props;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

    if (isDragging) {
      return (
        <div
          className="role_wrapper is_dragging"
          ref={setNodeRef}
          style={style}
        />
      );
    }
  return (
    <div
    ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="role_wrapper"
    >
      {task?.title} <button onClick={() => deleteTask(task.id)}>Delete</button>
    </div>
  );
}

export default TaskCard;
