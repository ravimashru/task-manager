import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid_v1 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {

  private tasks: Task[] = [];

  public getAllTasks(): Task[] {
    return this.tasks.slice();
  }

  public getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {

    let tasks = this.getAllTasks();

    if (filterDto.status) {
      tasks = tasks.filter(e => e.status === filterDto.status)
    }

    if (filterDto.searchTerm) {
      tasks = tasks.filter(
        e => 
          e.title.includes(filterDto.searchTerm) ||
          e.description.includes(filterDto.searchTerm)
      )
    }

    return tasks;

  }

  public createTask(createTaskDto: CreateTaskDto): Task {

    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid_v1(),
      title,
      description,
      status: TaskStatus.OPEN
    };
    this.tasks.push(task);
    return task;
  }

  public getTaskById(id: string): Task {
    const task = this.tasks.find(e => e.id === id);
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  public deleteTask(id: string): void {
    this.tasks = this.tasks.filter(e => e.id !== id);
  }

  public updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
