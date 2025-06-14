// TODO: Create the TaskCard component
// Requirements:
// - Display task title, description, priority, due date
// - Show completion status
// - Include edit and delete buttons
// - Use proper TypeScript types
// - Apply priority color coding
// - Make it responsive

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Priority, Task } from "@/types/Task";
import { Checkbox } from "./ui/checkbox";
import { Dispatch, SetStateAction, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { TaskForm } from "./TaskForm";
import { Label } from "./ui/label";

interface TaskCardProps {
  task: Task;
  setTasks: Dispatch<SetStateAction<Task[]>>;
}

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
  }
};

export const TaskCard = ({ task, setTasks }: TaskCardProps) => {
  const [showForm, setShowForm] = useState(false);

  const onDelete = useCallback(() => {
    setTasks((prevTasks) => prevTasks.filter((t: Task) => t.id !== task.id));
  }, [task.id, setTasks]);

  const onComplete = useCallback(
    (checked: boolean) => {
      setTasks((prevTasks) =>
        prevTasks.map((t: Task) =>
          t.id === task.id ? { ...t, completed: checked } : t
        )
      );
    },
    [task.id, setTasks]
  );

  return (
    <Card className="w-full">
      {showForm && (
        <TaskForm
          setShowForm={setShowForm}
          setTasks={setTasks}
          mode="edit"
          task={task}
        />
      )}
      {!showForm && (
        <div className="p-6 bg-white shadow-md rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">
              {task.title}
            </h3>
            <span
              className={cn(
                `px-2 py-1 rounded-full text-sm font-medium`,
                getPriorityColor(task.priority)
              )}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
          <p className="text-gray-600">{task.description}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Status: {task.completed ? "Completed" : "Pending"}</span>
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between mt-4">
            <div className="flex items-center w-full">
              <Label className="text-sm font-medium text-gray-500">Mark as {task.completed ? "Pending" : "Completed"}</Label>
              <Checkbox
                checked={task.completed}
                onCheckedChange={onComplete}
                className="ml-4"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={onDelete}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </Button>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                Edit
              </Button>
            </div>
            <div></div>
          </div>
        </div>
      )}
    </Card>
  );
};
