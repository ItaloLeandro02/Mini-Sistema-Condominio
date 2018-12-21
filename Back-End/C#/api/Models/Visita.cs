using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class Visita
    {
        public int Id { get; set; }

        [ForeignKey("condomino")]
        public int Condomino_Id { get; set; }
        public virtual Condomino condomino { get; set; }

        [ForeignKey("pessoa")]
        public int? Pessoa_Id { get; set; }
        public virtual Pessoa pessoa { get; set; }
        public DateTimeOffset? Data_Hora_Reserva { get; set; }
        public string Nome_Convidado { get; set; }
        public string Condomino_Observacao { get; set; }
        public DateTimeOffset? Data_Hora_Expiracao { get; set; }
        public int Situacao { get; set; }
        public DateTimeOffset? Portaria_Data_Hora_Chegada { get; set; }

        [ForeignKey("porteiro")]
        public int Porteiro_Id { get; set; }
        public virtual Porteiro porteiro { get; set; }
        public string Portaria_Observacao { get; set; }
    }
}