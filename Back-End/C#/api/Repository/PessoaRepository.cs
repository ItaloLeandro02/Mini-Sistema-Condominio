using System;
using System.Collections.Generic;
using System.Linq;
using api.Models;
using Microsoft.EntityFrameworkCore;


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
            _context.Pessoa.Add(pessoa);
            _context.SaveChanges();
        }

        public Pessoa Find(int id)
        {
            return _context.Pessoa.Include(p => p.endereco).FirstOrDefault(u => u.Id == id);
        }

        public IEnumerable<Pessoa> GetAll()
        {
            return _context.Pessoa.Include(p => p.endereco).ToList() ?? Enumerable.Empty<Pessoa>();
        }

        public void Remove(int id)
        {
            var entity = _context.Pessoa.First(u => u.Id == id);
                _context.Pessoa.Remove(entity);
                _context.SaveChanges();
        }

        public void Update(Pessoa pessoa)
        {
            _context.Pessoa.Update(pessoa);
            _context.SaveChanges();
        }
    }
}