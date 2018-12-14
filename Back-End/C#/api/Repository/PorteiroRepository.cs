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
            _context.Porteiros.Add(porteiro);
            _context.SaveChanges();
        }

        public Porteiro Find(int id)
        {
            return _context.Porteiros.FirstOrDefault(u => u.Id == id);
        }

        public IEnumerable<Porteiro> GetAll()
        {
            return _context.Porteiros.ToList();
        }

        public void Remove(int id)
        {
            var entity = _context.Porteiros.First(u => u.Id == id);
                _context.Porteiros.Remove(entity);
                _context.SaveChanges();
        }

        public void Update(Porteiro porteiro)
        {
            _context.Porteiros.Update(porteiro);
            _context.SaveChanges();
        }
    }
}