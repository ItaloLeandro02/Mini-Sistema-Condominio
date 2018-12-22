using System.Collections.Generic;
using api.Models;

namespace api.Repository
{
    public interface IPessoaRepository
    {
         void Add(Pessoa pessoa);
         IEnumerable<Pessoa> GetAll();
         Pessoa Find(int id);
         void Remove(int id);
         void Update(Pessoa form, Pessoa banco);
    }
}