// TODO: Complete the Task interface
// Hint: What properties should a task have?

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
}

export type Priority = 'high' | 'medium' | 'low';

export type TaskFormData = {
  // Add form data interface here
  title: string;
  description: string;
  priority: Priority;
  dueDate: Date;
};