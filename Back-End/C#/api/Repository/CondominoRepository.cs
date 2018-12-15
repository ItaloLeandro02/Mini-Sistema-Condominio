using System.Collections.Generic;
using System.Linq;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class CondominoRepository : ICondominoRepository
    {
        private readonly DataDbContext _context;

        public CondominoRepository(DataDbContext ctx) {
            _context = ctx;
        }
        public void Add(Condomino condomino)
        {
            _context.Condomino.Add(condomino);
            _context.SaveChanges();
        }

        public Condomino Find(int id)
        {
            return _context.Condomino.Include(p => p.pessoa).ThenInclude(e => e.endereco).Include(u => u.usuario).FirstOrDefault(u =>u.Id == id);
        }

        public IEnumerable<Condomino> GetAll()
        {
            return _context.Condomino.Include(p => p.pessoa).ThenInclude(e => e.endereco).Include(u => u.usuario).ToList();
        }

        public void Remove(int id)
        {
            var entity = _context.Condomino.First(u => u.Id == id);
                _context.Condomino.Remove(entity);
                _context.SaveChanges();
        }

        public void Update(Condomino condomino)
        {
            _context.Condomino.Update(condomino);
            _context.SaveChanges();
        }
    }
}