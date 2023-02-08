using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CandellaServer.Context;
using CandellaServer.Data;
using Microsoft.AspNetCore.Authorization;
using CandellaServer.Helpers;
using CandellaServer.Dto;
using AutoMapper;

namespace CandellaServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        private readonly AppDBContext _context;

        public DepartmentsController(AppDBContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Director")]
        [HttpPost("Create")]
        public async Task<Guid> createDepartment(DepartmentDto department)
        {
            var director = await _context.Directors
                .SingleOrDefaultAsync(x => x.IdentityUser.Email == User.ToUserInfo().Username ||
                    x.IdentityUser.UserName == User.ToUserInfo().Username);

            var newDepart = new Department
            {
                Name = department.Name,
                DirectorId = director.Id,
            };
            Console.WriteLine(director.Id);
            await _context.Departments.AddAsync(newDepart);
            await _context.SaveChangesAsync();
            return newDepart.Id;
        }

        [Authorize(Roles = "Director")]
        [HttpGet("GetDepartment")]
        public async Task<DepartmentDto> GetDepartment()
        {
            var director = await _context.Directors
                .Include(x => x.IdentityUser)
                .SingleOrDefaultAsync(x => x.IdentityUser.Email == User.ToUserInfo().Username ||
                    x.IdentityUser.UserName == User.ToUserInfo().Username);
            var department = await _context.Departments
                .Include(x => x.Director)
                .SingleOrDefaultAsync(d => d.DirectorId == director.Id);
            return Mapper.Map<Department, DepartmentDto>(department);
        }

        [HttpGet("GetDepartmentsList")]
        public async Task<List<DepartmentDto>> GetDepartmentsList()
        {
            var department = await _context.Departments.ToListAsync();
            return Mapper.Map<List<Department>, List<DepartmentDto>>(department);
        }


        [Authorize(Roles = "Director")]
        [HttpGet("GetEmployees")]
        public async Task<List<EmployeeDto>> GetEmployees()
        {
            var director = await _context.Directors
                .Include(x => x.IdentityUser)
                .SingleOrDefaultAsync(x => x.IdentityUser.Email == User.ToUserInfo().Username ||
                    x.IdentityUser.UserName == User.ToUserInfo().Username);
            var department = await _context.Departments
                .Include(x => x.Director)
                .SingleOrDefaultAsync(d => d.DirectorId == director.Id);
            var employees = await _context.Employees.Where(x => x.DepartmentId == department.Id).ToListAsync();
            return Mapper.Map<List<Employee>, List<EmployeeDto>>(employees);
        }

    }
}
