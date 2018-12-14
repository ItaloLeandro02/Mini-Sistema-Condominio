using System.Collections.Generic;
using System.Linq;
using api.Models;

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
            _context.Visitas.Add(visita);
            _context.SaveChanges();
        }

        public Visita Find(int id)
        {
            return _context.Visitas.FirstOrDefault(u => u.Id == id);
        }

        public IEnumerable<Visita> GetAll()
        {
            return _context.Visitas.ToList();
        }

        public void Remove(int id)
        {
            var entity = _context.Visitas.First(u => u.Id == id);
                _context.Visitas.Remove(entity);
                _context.SaveChanges();
        }

        public void Update(Visita visita)
        {
            _context.Visitas.Update(visita);
            _context.SaveChanges();
        }
    }
}