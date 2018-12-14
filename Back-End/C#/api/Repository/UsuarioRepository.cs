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
            _context.Usuarios.Add(usuario);
            _context.SaveChanges();
        }

        public Usuario Find(int id)
        {
            return _context.Usuarios.FirstOrDefault(u => u.Id == id);
        }

        public IEnumerable<Usuario> GetAll()
        {
            return _context.Usuarios.ToList();
        }

        public void Remove(int id)
        {
            var entity = _context.Usuarios.First(u => u.Id == id);
                _context.Usuarios.Remove(entity);
                _context.SaveChanges();
        }

        public void Update(Usuario usuario)
        {
            _context.Usuarios.Update(usuario);
            _context.SaveChanges();
        }
    }
}