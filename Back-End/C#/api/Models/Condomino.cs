using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class Condomino
    {
        public int Id { get; set; }

        [ForeignKey("pessoa")]
        public int PessoaId {get; set;}
        public virtual Pessoa pessoa { get; set; }

        [ForeignKey("usuario")]
        public int UsuarioId { get; set; }
        public virtual Usuario usuario { get; set; }
        public string Endereco { get; set; }
    }
}