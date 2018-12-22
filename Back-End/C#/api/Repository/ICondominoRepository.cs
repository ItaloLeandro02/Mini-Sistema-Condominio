using System.Collections.Generic;
using api.Models;

namespace api.Repository
{
    public interface ICondominoRepository
    {
        void Add(Condomino condomino);
        IEnumerable<Condomino> GetAll();
        Condomino Find(int id);
        void Remove(int id);
        void Update(Condomino form, Condomino banco);
    }
}