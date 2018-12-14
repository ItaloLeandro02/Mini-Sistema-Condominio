using System.Collections.Generic;
using System.Linq;
using api.Models;

namespace api.Repository
{
    public class PessoaRepository : IPessoaRepository
    {
        private readonly DataDbContext _context;
        public PessoaRepository(DataDbContext ctx) {
            _context = ctx;
        }
        public void Add(Pessoa pessoa)
        {
            _context.Pessoas.Add(pessoa);
            _context.SaveChanges();
        }

        public Pessoa Find(int id)
        {
            return _context.Pessoas.FirstOrDefault(u => u.Id == id);
        }

        public IEnumerable<Pessoa> GetAll()
        {
            return _context.Pessoas.ToList();
        }

        public void Remove(int id)
        {
            var entity = _context.Pessoas.First(u => u.Id == id);
                _context.Pessoas.Remove(entity);
                _context.SaveChanges();
        }

        public void Update(Pessoa pessoa)
        {
            _context.Pessoas.Update(pessoa);
            _context.SaveChanges();
        }
    }
}