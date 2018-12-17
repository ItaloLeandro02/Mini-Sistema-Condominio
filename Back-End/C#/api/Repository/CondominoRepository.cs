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

            condomino.pessoa.Criacao        = DateTime.Now;
            condomino.pessoa.Digital        = Util.Util.geraDigital();

            condomino.usuario.Criacao       = DateTime.Now;
            condomino.usuario.Tipo          = 2;
            condomino.usuario.Desativado    = 0;

            _context.Condomino.Add(condomino);
            _context.SaveChanges();
        }

        public Condomino Find(int id)
        {
            return _context.Condomino.Include(p => p.pessoa).ThenInclude(e => e.endereco).Include(u => u.usuario).FirstOrDefault(u =>u.Id == id);
        }   

        public IEnumerable<Condomino> GetAll()
        {
            return _context.Condomino.Include(p => p.pessoa).ThenInclude(e => e.endereco).Include(u => u.usuario).ToList();
        }

        public void Remove(int id)
        {
            var entity = _context.Condomino.Include(p => p.pessoa).ThenInclude(e => e.endereco).Include(u => u.usuario).FirstOrDefault(c => c.Id == id);
                _context.Condomino.Remove(entity);
                _context.SaveChanges();
        }

        public void Update(Condomino condomino)
        {
            _context.Condomino.Update(condomino);
            _context.SaveChanges();
        }
    }
}