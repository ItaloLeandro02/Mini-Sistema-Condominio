using System.Collections.Generic;
using api.Models;

namespace api.Repository
{
    public interface IUsuarioRepository
    {
        void Add(Usuario user);
        IEnumerable<Usuario> GetAll();
        Usuario Find(int id);
        void Remove(int id);
        void Update(Usuario form, Usuario banco);
    }
}