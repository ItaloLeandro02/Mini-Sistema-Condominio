using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        public bool  Desativado { get; set; }
        public DateTime Criacao { get; set; }
    }
}