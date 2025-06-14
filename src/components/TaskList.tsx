import { Task } from "@/types/Task";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo } from "react";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  priority: string;
  setPriority: (priority: string) => void;
  setTasks: (tasks: Task[]) => void;
}

export const TaskList = ({
  tasks,
  priority,
  setPriority,
  setTasks,
}: TaskListProps) => {

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (priority === "all") return true;
      return task.priority === priority;
    });
  }, [tasks, priority]);
  
  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              Get started by creating your first task. Click the "Add Task"
              button above.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 w-full">
          <Command>
            <div className="flex items-center gap-2 mx-1">
              <CommandInput placeholder="Search task by title..." />
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value)}
              >
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder="Task priority..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CommandList className="!max-h-full">
              <CommandEmpty>No tasks found</CommandEmpty>
              <CommandGroup>
                {filteredTasks.map((task: Task, index: number) => (
                  <CommandItem key={index} value={task.title}>
                    <TaskCard key={index} task={task} setTasks={setTasks} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};
