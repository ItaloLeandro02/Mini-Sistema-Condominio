using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    [Table("condomino")]
    public class Condomino
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("pessoa")]
        public int Pessoa_Id {get; set;}
        public virtual Pessoa pessoa { get; set; }

        [ForeignKey("usuario")]
        public int Usuario_Id { get; set; }
        public virtual Usuario usuario { get; set; }
        public string Endereco { get; set; }
    }
}