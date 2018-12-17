using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class Condomino_Convidado
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("condomino")]
        public int Condomino_Id { get; set; }
        public virtual Condomino condomino { get; set; }

        [ForeignKey("pessoa")]
        public int Pessoa_Id { get; set; }
        public virtual Pessoa pessoa { get; set; }
        public byte Favorito { get; set; }
    }
}