using System;
using System.Collections.Generic;
using System.Linq;
using api.Models;
using Microsoft.EntityFrameworkCore;
using api.Util;

namespace api.Repository
{
    public class CondominoRepository : ICondominoRepository
    {
        private readonly DataDbContext _context;

        public CondominoRepository(DataDbContext ctx) {
            _context = ctx;
        }
        public void Add(Condomino condomino)
        {

            _context.Condomino.Add(condomino);
            _context.SaveChanges();
        }

        public Condomino Find(int id)
        {
            return _context.Condomino.Include(p => p.pessoa).Include(u => u.usuario).FirstOrDefault(u =>u.Id == id);
        }   

        public IEnumerable<Condomino> GetAll()
        {
            return _context.Condomino.Include(p => p.pessoa).Include(u => u.usuario).ToList() ?? Enumerable.Empty<Condomino>();
        }

        public void Remove(int id)
        {
           var condomino = _context.Condomino
           .Where(c => c.Id == id)
           .First();

           var pessoa = _context.Pessoa
           .Where(p => p.Id == condomino.Pessoa_Id)
           .First();

           var usuario = _context.Usuario
           .Where(u => u.Id == condomino.Usuario_Id)
           .First();


                _context.Remove(condomino);
                _context.Remove(pessoa);
                _context.Remove(usuario);

                _context.SaveChanges();
        }

        public void Update(Condomino condomino)
        {
            _context.Condomino.Update(condomino);
            _context.SaveChanges();
        }
    }
}