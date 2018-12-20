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

            visita.Portaria_Data_Hora_Chegada   = null;
            visita.Portaria_Observacao          = null;
            visita.Situacao                     = 1;

                _context.Visita.Add(visita);
            
                    _context.SaveChanges();
        }

        public Visita Find(int id)
        {
            return _context.Visita.FirstOrDefault(u => u.Id == id);
        }

        public IEnumerable<Visita> GetAll()
        {
            return _context.Visita.ToList();
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