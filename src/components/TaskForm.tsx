// TODO: Create the TaskForm component
// Requirements:
// - Form fields: title (required), description (optional), priority dropdown, due date
// - Form validation with error messages
// - Handle form submission
// - Clear form after successful submission
// - Use controlled components

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Task, TaskFormData } from "@/types/Task";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar } from "./ui/calendar";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Label } from "./ui/label";

export const taskValidationSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  priority: z.enum(["high", "medium", "low"]),
  dueDate: z.date().min(new Date(), "Due date must be in the future"),
});

interface TaskFormProps {
  // Define your props here
  setShowForm: Dispatch<SetStateAction<boolean>>;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  mode?: "add" | "edit";
  task?: Task;
}

export const TaskForm = ({
  setShowForm,
  setTasks,
  mode = "add",
  task,
}: TaskFormProps) => {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(taskValidationSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      priority: task?.priority || "high",
      dueDate: task?.dueDate || "",
    },
    mode: "onChange",
  });

  const onSubmit = useCallback(
    (values: TaskFormData) => {
      if (mode === "add") {
        const newTask = {
          ...values,
          id: crypto.randomUUID(),
          completed: false,
          createdAt: new Date(),
        };
        setTasks((prevTasks) => [...prevTasks, newTask]);
      } else {
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === task?.id ? { ...t, ...values } : t))
        );
      }
      form.reset();
      setShowForm(false);
    },
    [mode, task?.id, setTasks, form, setShowForm]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Task</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Title</Label>
                      <FormControl>
                        <Input placeholder="Task title..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Description</Label>
                      <FormControl>
                        <Textarea
                          placeholder="Task description..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Priority</Label>
                      <FormControl>
                        <Select
                          {...field}
                          value={field.value || "high"}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Task priority..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <Label>Due Date</Label>
                      <FormControl>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="date"
                              className="w-48 justify-between font-normal"
                            >
                              {field.value
                                ? new Date(field.value).toLocaleDateString()
                                : "Select date"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              captionLayout="dropdown"
                              onSelect={(date) => {
                                setOpen(false);
                                field.onChange(date);
                              }}
                              disabled={(date) =>
                                date <= new Date() ||
                                date < new Date("1900-01-01")
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-3"></div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {" "}
                  {mode === "add" ? "Add Task" : "Update Task"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setShowForm(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};
