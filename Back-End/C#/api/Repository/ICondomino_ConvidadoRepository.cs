using System.Collections.Generic;
using api.Models;

namespace api.Repository
{
    public interface ICondomino_ConvidadoRepository
    {
         void Add (Condomino_Convidado convidado);
         IEnumerable<Condomino_Convidado> GetAll();
        Condomino_Convidado Find(int id);
        void Remove(int id);
        void Update(Condomino_Convidado form, Condomino_Convidado banco);
    }
}