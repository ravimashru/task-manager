import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';
import { Task } from './task.entity';
import { NotFoundException } from '@nestjs/common';

const mockUser = new User();
mockUser.id = 1234;
mockUser.username = 'Test User';

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository: TaskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TasksService, TaskRepository],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      const filters: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        searchTerm: 'query',
      };

      const mockTask = new Task();
      jest.spyOn(taskRepository, 'getTasks').mockResolvedValue([mockTask]);

      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const result = await tasksService.getTasks(filters, mockUser);

      expect(result).toEqual([mockTask]);
      expect(taskRepository.getTasks).toHaveBeenCalled();
    });
  });

  describe('getTasksById', () => {
    it('should return specified task from repository', async () => {
      const mockTask = new Task();
      mockTask.id = 1;
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
    });

    it('should return 404 when task does not exist', async () => {
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTask', () => {
    it('should successfully create a new task', async () => {
      const mockTask = new Task();
      mockTask.title = 'Test task';
      mockTask.description = 'Test Description';
      mockTask.status = TaskStatus.OPEN;
      mockTask.user = mockUser;

      jest.spyOn(taskRepository, 'createTask').mockResolvedValue(mockTask);

      const mockCreateTaskDto = {
        title: mockTask.title,
        description: mockTask.description,
      };

      const result = await tasksService.createTask(mockCreateTaskDto, mockUser);

      expect(taskRepository.createTask).toHaveBeenCalledWith(mockCreateTaskDto, mockUser);

      expect(result).toEqual(mockTask);
    });
  });

  describe('deleteTask', () => {
    it('deletes task successfully from repository', () => {
      jest.spyOn(taskRepository, 'delete').mockResolvedValue({ affected: 1, raw: '' });
      expect(taskRepository.delete).not.toHaveBeenCalled();
      tasksService.deleteTask(1, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id
      });
    });

    it('throws an error when the task does not exist', () => {
      jest.spyOn(taskRepository, 'delete').mockResolvedValue({ affected: 0, raw: '' });
      expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTaskStatus', () => {
    it('should successfully update the status of an existing task', async () => {
      const mockTask = new Task();
      mockTask.status = TaskStatus.OPEN;
      mockTask.save = jest.fn().mockResolvedValue(true);
      
      jest.spyOn(tasksService, 'getTaskById').mockResolvedValue(mockTask);
      
      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      expect(mockTask.save).not.toHaveBeenCalled();
      
      const result = await tasksService.updateTaskStatus(1, TaskStatus.IN_PROGRESS, mockUser);
      
      expect(tasksService.getTaskById).toHaveBeenCalledWith(1, mockUser);
      expect(mockTask.save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.IN_PROGRESS);
    });
  });
});
