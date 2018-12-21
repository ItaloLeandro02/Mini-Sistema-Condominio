using System.Collections.Generic;
using System.Linq;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class Condomino_ConvidadoRepository : ICondomino_ConvidadoRepository
    {
        private readonly DataDbContext _context;

        public Condomino_ConvidadoRepository(DataDbContext ctx) {
            _context = ctx;
        }
        public void Add(Condomino_Convidado convidado)
        {
            _context.Condomino_Convidado.Add(convidado);
                _context.SaveChanges();
        }

        public Condomino_Convidado Find(int id)
        {
            return _context.Condomino_Convidado
            .Include(c => c.condomino)
            .ThenInclude(f => f.pessoa)
            .Include(p => p.pessoa)
            .ThenInclude(e => e.endereco)
            .FirstOrDefault(u =>u.Id == id);
        }

        public IEnumerable<Condomino_Convidado> GetAll()
        {
            return _context.Condomino_Convidado
            .Include(c => c.condomino)
            .ThenInclude(f => f.pessoa)
            .Include(p => p.pessoa)
            .ThenInclude(e => e.endereco)
            .ToList() ?? Enumerable.Empty<Condomino_Convidado>();
        }

        public void Remove(int id)
        {
              var entity = _context.Condomino_Convidado.Include(p => p.pessoa).ThenInclude(e => e.endereco).First(c => c.Id == id);

                _context.Remove(entity);
                _context.SaveChanges();
        }

        public void Update(Condomino_Convidado convidado)
        {
            _context.Condomino_Convidado.Update(convidado);
            _context.SaveChanges();
        }
    }
}