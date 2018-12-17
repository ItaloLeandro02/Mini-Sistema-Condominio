using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
     [Table("pessoa")]
    public class Pessoa
    {
        [Key]
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Cpf { get; set; }
        public DateTime Nascimento { get; set; }
        public string Digital { get; set; }
        public DateTime Criacao { get; set; }

        [ForeignKey("endereco")]
        public int Endereco_Id { get; set; }
        public virtual Endereco endereco { get; set; }
    }
}