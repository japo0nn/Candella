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
    public class ClientsController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly AppDBContext _context;

        public ClientsController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, SignInManager<IdentityUser> signInManager, AppDBContext context)
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
            await _roleManager.CreateAsync(new IdentityRole("Client"));

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
            await _userManager.AddToRoleAsync(user, "Client");
            var person = new Client();
            person.IdentityUser = user;
            await _context.Clients.AddAsync(person);
            await _context.SaveChangesAsync(default);
            await Token(model.Username);
        }

        [HttpPost]
        [Route("Login")]
        public async Task Login([FromBody] LoginViewModel model)
        {
            var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, false, false);
            var user = await _userManager.FindByNameAsync(model.Username);
            var isInRole = await _userManager.IsInRoleAsync(user, "Client");
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

        [Authorize(Roles = "Client")]
        [HttpGet]
        [Route("Current")]
        public async Task<ClientDto> CurrentUser()
        {
            var client = await _context.Clients
                .Include(x => x.IdentityUser)
                .SingleOrDefaultAsync(x => x.IdentityUser.Email == User.ToUserInfo().Username ||
                    x.IdentityUser.UserName == User.ToUserInfo().Username);
            return Mapper.Map<Client, ClientDto>(client);
        }

        [Authorize]
        [HttpPut]
        [Route("setUserData")]
        public async Task setUserData([FromBody] ClientDto clientDto)
        {
            var client = await _context.Clients
                .Include(x => x.IdentityUser)
                .SingleOrDefaultAsync(x => x.IdentityUser.Email == User.ToUserInfo().Username ||
                    x.IdentityUser.UserName == User.ToUserInfo().Username);

            client.FirstName = clientDto.FirstName;
            client.LastName = clientDto.LastName;
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
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            var response = new
            {
                access_token = encodedJwt,
                username = identity.Name,
            };

            Response.ContentType = "application/json";
            await Response.WriteAsync(JsonConvert.SerializeObject(response, new JsonSerializerSettings { Formatting = Formatting.Indented }));
        }


        private ClaimsIdentity GetIdentity(string login)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, login),
                new Claim(ClaimTypes.Role, "Client"),
            };

            ClaimsIdentity claimIdentity = new ClaimsIdentity(claims, "Token", ClaimsIdentity.DefaultNameClaimType,
                    ClaimsIdentity.DefaultRoleClaimType);

            return claimIdentity;
        }
    }
}
