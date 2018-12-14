using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class Visita
    {
        public int Id { get; set; }

        [ForeignKey("condomino")]
        public int CondominoId { get; set; }
        public virtual Condomino condomino { get; set; }

        [ForeignKey("pessoa")]
        public int PessoaId { get; set; }
        public virtual Pessoa pessoa { get; set; }
        public DateTime Data_Hora_Reserva { get; set; }
        public string NomeConvidado { get; set; }
        public string CondominoObservacao { get; set; }
        public DateTime Data_Hora_Expiracao { get; set; }
        public int Situacao { get; set; }
        public DateTime Data_Hora_Chegada { get; set; }

        [ForeignKey("porteiro")]
        public int PorteiroId { get; set; }
        public virtual Porteiro porteiro { get; set; }
    }
}