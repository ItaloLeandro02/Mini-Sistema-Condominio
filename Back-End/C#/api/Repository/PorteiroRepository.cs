using System.Collections.Generic;
using System.Linq;
using api.Models;

namespace api.Repository
{
    public class PorteiroRepository : IPorteiroRepository
    {
        private readonly DataDbContext _context;
        public PorteiroRepository(DataDbContext ctx) {
            _context = ctx;
        }
        public void Add(Porteiro porteiro)
        {
            _context.Porteiro.Add(porteiro);
            _context.SaveChanges();
        }

        public Porteiro Find(int id)
        {
            return _context.Porteiro.FirstOrDefault(u => u.Id == id);
        }

        public IEnumerable<Porteiro> GetAll()
        {
            return _context.Porteiro.ToList();
        }

        public void Remove(int id)
        {
            var entity = _context.Porteiro.First(u => u.Id == id);
                _context.Porteiro.Remove(entity);
                _context.SaveChanges();
        }

        public void Update(Porteiro porteiro)
        {
            _context.Porteiro.Update(porteiro);
            _context.SaveChanges();
        }
    }
}