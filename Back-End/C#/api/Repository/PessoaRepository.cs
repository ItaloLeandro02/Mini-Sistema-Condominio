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

           var pessoa = _context.Pessoa
           .Where(p => p.Id == id)
           .First();

           var endereco = _context.Endereco
           .Where(e => e.Id == pessoa.Endereco_Id)
           .First();


                _context.Remove(pessoa);
                _context.Remove(endereco);

                _context.SaveChanges();
        }

        public void Update(Pessoa pessoa)
        {
            _context.Pessoa.Update(pessoa);
            _context.SaveChanges();
        }
    }
}