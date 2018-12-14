using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class Pessoa
    {
        [Key]
        public int Id { get; set; }
        public string Nome { get; set; }
        public Int64 Cpf { get; set; }
        public DateTime Nascimento { get; set; }
        public string Digital { get; set; }

        [ForeignKey("endereco")]
        public int EnderecoId { get; set; }
        public virtual Endereco endereco { get; set; }
    }
}