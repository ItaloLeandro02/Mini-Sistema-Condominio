using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc;

namespace api.Models
{
     [Table("usuario")]
    public class Usuario
    {
        [Key]
        public int Id { get; set; }
        public string Email { get; set; }
        public int Tipo { get; set; }
        public string Senha { get; set; }
        public byte  Desativado { get; set; }
        public DateTime Criacao { get; set; }
        public string Token { get; set; }
    }
}