﻿using System.ComponentModel.DataAnnotations;

namespace CandellaServer.Views
{
    public class RegisterViewModel
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
