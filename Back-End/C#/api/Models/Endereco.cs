using System;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class Endereco
    {
        [Key]
        public int Id { get; set; }
        public string Logradouro { get; set; }
        public int Numero { get; set; }
        public string Bairro { get; set; }
        public string Cidade { get; set; }
        public string Uf { get; set; }
    }
}