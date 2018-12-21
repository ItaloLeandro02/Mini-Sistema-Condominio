using System.Collections.Generic;
using System.Linq;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class VisitaRepository : IVisitaRepository
    {
        private readonly DataDbContext _context;
        public VisitaRepository(DataDbContext ctx) {
            _context = ctx;
        }
        public void Add(Visita visita)
        {

            _context.Visita.Add(visita);
        
                _context.SaveChanges();
        }

        public Visita Find(int id)
        {
            return _context.Visita
            .Include(p => p.pessoa)
            .Include(c => c.condomino)
            .ThenInclude(p => p.pessoa)
            .FirstOrDefault(u => u.Id == id);
        }

        public IEnumerable<Visita> GetAll()
        {
            return _context.Visita
            .Include(p => p.pessoa)
            .Include(c => c.condomino)
            .ThenInclude(p => p.pessoa)
            .ToList();
        }

        public void Remove(int id)
        {
            var entity = _context.Visita.First(u => u.Id == id);
                _context.Visita.Remove(entity);
                _context.SaveChanges();
        }

        public void Update(Visita visita)
        {
            _context.Visita.Update(visita);
            _context.SaveChanges();
        }
    }
}