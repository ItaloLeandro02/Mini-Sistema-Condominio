using System.Collections.Generic;
using System.Linq;
using api.Models;

namespace api.Repository
{
    public class EnderecoRepository : IEnderecoRepository
    {
        private readonly DataDbContext _context;
        public EnderecoRepository(DataDbContext ctx) {
            _context = ctx;
        } 
        public void Add(Endereco endereco)
        {
            _context.Endereco.Add(endereco);
            _context.SaveChanges();
        }

        public Endereco Find(int id)
        {
            return _context.Endereco.FirstOrDefault(u => u.Id == id);
        }

        public IEnumerable<Endereco> GetAll()
        {
            return _context.Endereco.ToList();
        }

        public void Remove(int id)
        {
            var entity = _context.Endereco.First(u => u.Id == id);
                _context.Endereco.Remove(entity);
                _context.SaveChanges();
        }

        public void Update(Endereco endereco)
        {
            _context.Endereco.Update(endereco);
            _context.SaveChanges();
        }
    }
}