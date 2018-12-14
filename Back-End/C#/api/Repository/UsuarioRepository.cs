using System.Collections.Generic;
using api.Models;

namespace api.Repository
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly UsuarioDbContext _context
        public void Add(Usuario user)
        {
            throw new System.NotImplementedException();
        }

        public Usuario Find(int id)
        {
            throw new System.NotImplementedException();
        }

        public IEnumerable<Usuario> GetAll()
        {
            throw new System.NotImplementedException();
        }

        public void Remove(int id)
        {
            throw new System.NotImplementedException();
        }

        public void Update(Usuario user)
        {
            throw new System.NotImplementedException();
        }
    }
}