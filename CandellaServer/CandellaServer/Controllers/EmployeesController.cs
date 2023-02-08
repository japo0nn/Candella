using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CandellaServer.Context;
using CandellaServer.Data;
using CandellaServer.Views;
using CandellaServer.Helpers;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using WebAppServer.Helpers;
using CandellaServer.Dto;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using System.Data;

namespace CandellaServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly AppDBContext _context;

        public EmployeesController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, SignInManager<IdentityUser> signInManager, AppDBContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _context = context;
        }

        [HttpPost]
        [Route("Register")]
        public async Task Register([FromBody] RegisterViewModel model)
        {
            await _roleManager.CreateAsync(new IdentityRole("Employee"));

            var existingEmail = await _userManager.FindByEmailAsync(model.Email);
            if (existingEmail != null)
            {
                Response.ContentType = "application/json";
                Response.StatusCode = 409;
                await Response.WriteAsync("Email existing");
                return;
            }

            var user = new IdentityUser
            {
                Email = model.Email,
                UserName = model.Username
            };
            await _userManager.CreateAsync(user, model.Password);
            await _userManager.AddToRoleAsync(user, "Employee");
            var person = new Employee
            {
                IdentityUser = user,

            };
            await _context.Employees.AddAsync(person);
            await _context.SaveChangesAsync(default);
            await Token(model.Username);
        }

        [HttpPost]
        [Route("Login")]
        public async Task Login([FromBody] LoginViewModel model)
        {
            var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, false, false);
            var user = await _userManager.FindByNameAsync(model.Username);
            var isInRole = await _userManager.IsInRoleAsync(user, "Employee");
            if (!result.Succeeded)
            {
                Response.StatusCode = 401;
                Response.ContentType = "application/json";
                await Response.WriteAsync("Invalid Username or Password");
                return;
            }
            else if (!isInRole)
            {
                Response.StatusCode = 400;
                Response.ContentType = "application/json";
                await Response.WriteAsync("No User in this Role");
                return;
            }
            await Token(model.Username);
        }

        [Authorize(Roles = "Employee")]
        [HttpGet]
        [Route("Current")]
        public async Task<EmployeeDto> CurrentUser()
        {
            var employee = await _context.Employees
                .Include(x => x.IdentityUser)
                .SingleOrDefaultAsync(x => x.IdentityUser.Email == User.ToUserInfo().Username ||
                    x.IdentityUser.UserName == User.ToUserInfo().Username);
            return Mapper.Map<Employee, EmployeeDto>(employee);
        }

        [Authorize]
        [HttpPut]
        [Route("setUserData")]
        public async Task setUserData([FromBody] EmployeeDto employeeDto)
        {
            var employee = await _context.Employees
                .Include(x => x.IdentityUser)
                .SingleOrDefaultAsync(x => x.IdentityUser.Email == User.ToUserInfo().Username ||
                    x.IdentityUser.UserName == User.ToUserInfo().Username);

            employee.FirstName = employeeDto.FirstName;
            employee.LastName = employeeDto.LastName;
            await _context.SaveChangesAsync();
        }

        [Authorize]
        [HttpPut]
        [Route("setDepartment")]
        public async Task setDepartment([FromBody] EmployeeDto employeeDto)
        {
            var employee = await _context.Employees
                .Include(x => x.IdentityUser)
                .SingleOrDefaultAsync(x => x.IdentityUser.Email == User.ToUserInfo().Username ||
                    x.IdentityUser.UserName == User.ToUserInfo().Username);

            employee.DepartmentId = employeeDto.DepartmentId;
            await _context.SaveChangesAsync();
        }

        [Authorize]
        [HttpPut]
        [Route("setLocation")]
        public async Task setLocation([FromBody] EmployeeDto employeeDto)
        {
            var employee = await _context.Employees
                .Include(x => x.IdentityUser)
                .SingleOrDefaultAsync(x => x.IdentityUser.Email == User.ToUserInfo().Username ||
                    x.IdentityUser.UserName == User.ToUserInfo().Username);

            employee.latitude = employeeDto.latitude;
            employee.longitude = employeeDto.longitude;
            await _context.SaveChangesAsync();
        }


        private async Task Token(string email)
        {
            var identity = GetIdentity(email);
            var now = DateTime.UtcNow;
            var jwt = new JwtSecurityToken(
            issuer: AuthOptions.ISSUER,
                audience: AuthOptions.AUDIENCE,
            notBefore: now,
            claims: identity.Claims,
                expires: now.Add(TimeSpan.FromMinutes(AuthOptions.LIFETIME)),
                signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

            var jwt_2 = new JwtSecurityTokenHandler().WriteToken(jwt);


            var response = new
            {
                access_token = jwt_2,
                email = identity.Name,
            };

            Response.ContentType = "application/json";
            await Response.WriteAsync(JsonConvert.SerializeObject(response, new JsonSerializerSettings { Formatting = Newtonsoft.Json.Formatting.Indented }));
        }


        private ClaimsIdentity GetIdentity(string login)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, login),
                new Claim(ClaimTypes.Role, "Employee"),
            };

            ClaimsIdentity claimIdentity = new ClaimsIdentity(claims, "Token", ClaimsIdentity.DefaultNameClaimType,
                    ClaimsIdentity.DefaultRoleClaimType);

            return claimIdentity;
        }
    }
}
