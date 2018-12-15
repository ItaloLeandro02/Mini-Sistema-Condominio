using System.Collections.Generic;
using System.Linq;
using api.Models;

namespace api.Repository
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly DataDbContext _context;
        public UsuarioRepository(DataDbContext ctx) {
            _context = ctx;
        }
        public void Add(Usuario usuario)
        {
            _context.Usuario.Add(usuario);
            _context.SaveChanges();
        }

        public Usuario Find(int id)
        {
            return _context.Usuario.FirstOrDefault(u => u.Id == id);
        }

        public IEnumerable<Usuario> GetAll()
        {
            return _context.Usuario.ToList();
        }

        public void Remove(int id)
        {
            var entity = _context.Usuario.First(u => u.Id == id);
                _context.Usuario.Remove(entity);
                _context.SaveChanges();
        }

        public void Update(Usuario usuario)
        {
            _context.Usuario.Update(usuario);
            _context.SaveChanges();
        }
    }
}