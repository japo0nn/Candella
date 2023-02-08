using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CandellaServer.Context;
using CandellaServer.Data;
using CandellaServer.Dto;
using CandellaServer.Helpers;
using Microsoft.AspNetCore.Authorization;
using System.Data;
using System.IO;
using AutoMapper;

namespace CandellaServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoesController : ControllerBase
    {
        private readonly AppDBContext _context;

        public ToDoesController(AppDBContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Client")]
        [HttpPost("Create")]
        public async Task<Guid> createTask(ToDoDto todo)
        {
            var client = await _context.Clients
                .SingleOrDefaultAsync(x => x.IdentityUser.Email == User.ToUserInfo().Username ||
                    x.IdentityUser.UserName == User.ToUserInfo().Username);
            var newTask = new ToDo
            {
                Name = todo.Name,
                Description = todo.Description,
                ClientId = client.Id,
                latitude = todo.latitude, longitude = todo.longitude,
            };

            await _context.ToDoes.AddAsync(newTask);
            await _context.SaveChangesAsync();
            return newTask.Id;
        }


        [Authorize(Roles = "Director")]
        [HttpPut("setEmployee")]
        public async Task<Guid> setEmployee(ToDoDto todo)
        {
            var task = await _context.ToDoes.SingleAsync(x => x.Id == todo.Id);

            task.DepartmentId = todo.DepartmentId;
            task.EmployeeId = todo.EmployeeId;
            await _context.SaveChangesAsync();
            return task.Id;
        }


        [Authorize(Roles = "Employee")]
        [HttpPut("updateCompleteStatus")]
        public async Task<Guid> updateStatus(ToDoDto todo)
        {
            var task = await _context.ToDoes.SingleAsync(x => x.Id == todo.Id);

            task.isComplete = true;
            await _context.SaveChangesAsync();
            return task.Id;
        }

        [Authorize(Roles = "Employee")]
        [HttpPut("updateStartStatus")]
        public async Task<Guid> updateStartStatus(ToDoDto todo)
        {
            var task = await _context.ToDoes.SingleAsync(x => x.Id == todo.Id);

            task.isStarted = true;
            await _context.SaveChangesAsync();
            return task.Id;
        }

        [Authorize(Roles = "Director")]
        [HttpGet("getTasksByDepartmentId")]
        public async Task<List<ToDoDto>> getTasksByDepartmentId()
        {
            var director = await _context.Directors
                .Include(x => x.IdentityUser)
                .SingleOrDefaultAsync(x => x.IdentityUser.Email == User.ToUserInfo().Username ||
                    x.IdentityUser.UserName == User.ToUserInfo().Username);
            var department = await _context.Departments
                .Include(x => x.Director)
                .SingleOrDefaultAsync(d => d.DirectorId == director.Id);
            var todoes = await _context.ToDoes
                .Include(e => e.Client)
                .Include(e => e.Employee)
                .Where(x => x.DepartmentId == department.Id)
                .Where(s => s.isComplete == false)
                .ToListAsync();
            return Mapper.Map<List<ToDo>, List<ToDoDto>>(todoes);
        }

        [Authorize(Roles = "Client")]
        [HttpGet("getTasksByClientId")]
        public async Task<List<ToDoDto>> getTasksByClientId()
        {
            var client = await _context.Clients
                .SingleOrDefaultAsync(x => x.IdentityUser.Email == User.ToUserInfo().Username ||
                    x.IdentityUser.UserName == User.ToUserInfo().Username);
            var todoes = await _context.ToDoes
                .Include(x => x.Department)
                .Include(e => e.Employee)
                .Where(t => t.ClientId == client.Id)
                .Where(s => s.isComplete == false)
                .ToListAsync();
            return Mapper.Map<List<ToDo>, List<ToDoDto>>(todoes);
        }

        [Authorize(Roles = "Employee")]
        [HttpGet("getTasksByEmployeeId")]
        public async Task<List<ToDoDto>> getTasksByEmployeeId()
        {
            var employee = await _context.Employees
                .SingleOrDefaultAsync(x => x.IdentityUser.Email == User.ToUserInfo().Username ||
                    x.IdentityUser.UserName == User.ToUserInfo().Username);
            var todoes = await _context.ToDoes
                .Include(x => x.Client)
                .Include(e => e.Department)
                .Where(t => t.EmployeeId == employee.Id)
                .Where(s => s.isComplete == false)
                .ToListAsync();
            return Mapper.Map<List<ToDo>, List<ToDoDto>>(todoes);
        }

        [Authorize]
        [HttpGet("getTaskById")]
        public async Task<ToDoDto> getTaskById(Guid TaskId)
        {
            var task = await _context.ToDoes
                .Include(c => c.Client)
                .Include(d => d.Department)
                .Include(e => e.Employee)
                .SingleAsync(a => a.Id == TaskId);
            return Mapper.Map<ToDo, ToDoDto>(task);
        }

        [Authorize(Roles = "Director")]
        [HttpGet("getFreeTasks")]
        public async Task<List<ToDoDto>> getFreeTasks()
        {
            var todoes = await _context.ToDoes
                .Include(x => x.Client)
                .Where(t => t.DepartmentId == null)
                .ToListAsync();
            return Mapper.Map<List<ToDo>, List<ToDoDto>>(todoes);
        }

        [Authorize(Roles = "Client")]
        [HttpDelete("deleteTask")]
        public async Task deleteTask(Guid TaskId)
        {
            var task = new ToDo
            {
                Id = TaskId,
            };

            _context.ToDoes.Remove(task);
            await _context.SaveChangesAsync();
        }
    }
}
