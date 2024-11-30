import React, { Fragment, useEffect, useMemo, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

function KanbanBoard() {
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  useEffect(() => {
    const taskArray = [
      {
        id: 1245,
        columnId: 4521,
        title: 'Hi I am task'
      },
      {
        id: 1246,
        columnId: 4521,
        title: 'Hi I am task'
      },
      {
        id: 1247,
        columnId: 4521,
        title: 'Hi I am task'
      },
    ]
    const columnArray = [
      {
        id: 4521,
        title: 'Column 1'
      }
    ]
    setColumns(columnArray)
    setTasks(taskArray)
  }, [setTasks, setColumns])

  console.log('tasks', tasks)

  const createNewCOlumn = () => {
    const columnToAdd = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  };

  const columnsId = useMemo(() => columns?.map((col) => col?.id), [columns]);

  const deleteColumn = (id) => {
    const filteredColumns = columns?.filter((e) => e?.id !== id);
    const newTasks = tasks.filter((task) => task.columnId !== id);
    setColumns(filteredColumns);
    setTasks(newTasks)
  };

  const onDragStart = (event) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const onDragEnd = (event) => {
    setActiveColumn(null)
    setActiveTask(null)
    const { over, active } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    if (active.id !== over.id) {
      setColumns((column) => {
        const oldIndex = column.findIndex((col) => col?.id === activeColumnId);
        const newIndex = column.findIndex((col) => col?.id === overColumnId);

        return arrayMove(column, oldIndex, newIndex);
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const createTask = (columnId) => {
    const newTask = {
      id: generateId(),
      columnId,
      title: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    const filteredRoles = tasks?.filter((e) => e?.id !== id);
    setTasks(filteredRoles);
  };

  const onDragOver = (event) => {
    const { over, active } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'Task'
    const isOverATask = over.data.current?.type === 'Task'

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t?.id === activeId);
        const overIndex = tasks.findIndex((t) => t?.id === overId);
        
        tasks[activeIndex].columnId = tasks[overIndex].columnId
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === 'Column'

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t?.id === activeId);
        
        tasks[activeIndex].columnId = overId
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  const generateId = () => {
    return Math.floor(Math.random() * 10001)
  }
  return (
    <div className="kanban_board">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <button onClick={createNewCOlumn}>Add Column</button>
        <div className="column_row">
          <SortableContext items={columnsId}>
            {columns?.map((col) => (
              <Fragment key={col.id}>
                <ColumnContainer
                  column={col}
                  deleteColumn={deleteColumn}
                  createTask={createTask}
                  tasks={tasks.filter((e) => e.columnId === col.id)}
                  deleteTask={deleteTask}
                />
              </Fragment>
            ))}
          </SortableContext>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                createTask={createTask}
                tasks={tasks.filter((e) => e.columnId === activeColumn)}
                deleteTask={deleteTask}
              />
            )}
            {activeTask && (
              <TaskCard task={activeTask} deleteTask={deleteTask} />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
