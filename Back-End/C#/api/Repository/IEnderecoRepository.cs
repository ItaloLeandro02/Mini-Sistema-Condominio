using System.Collections.Generic;
using api.Models;

namespace api.Repository
{
    public interface IEnderecoRepository
    {
        void Add(Endereco endereco);
        IEnumerable<Endereco> GetAll();
        Endereco Find(int id);
        void Remove(int id);
        void Update(Endereco form, Endereco banco);
    }
}