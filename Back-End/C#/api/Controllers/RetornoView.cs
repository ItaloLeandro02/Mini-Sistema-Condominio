using System.Collections.Generic;
using api.Models;

namespace api.Controllers
{
    public class RetornoView <T> where T : class {
        public T dado { get; set;}

        public bool sucesso { get; set;}

        public IEnumerable<Condomino> dadosCondomino { get; set; }
        public IEnumerable<Endereco> dadosEndereco { get; set; }
        public IEnumerable<Pessoa> dadosPessoa { get; set; }
        public IEnumerable<Porteiro> dadosPorteiro { get; set; }
        public IEnumerable<Usuario> dadosUsuario { get; set; }
        public IEnumerable<Visita> dadosVisita { get; set; }
        public IEnumerable<Condomino_Convidado> dadosConvidado { get; set; }

    }
}