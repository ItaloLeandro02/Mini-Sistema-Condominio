using System;
using System.Collections.Generic;
using System.Linq;
using api.Models;
using Microsoft.EntityFrameworkCore;

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

            porteiro.pessoa.Criacao        = DateTime.Now;
            porteiro.pessoa.Digital        = Util.Util.geraDigital();

            porteiro.usuario.Criacao       = DateTime.Now;
            porteiro.usuario.Tipo          = 1;
            porteiro.usuario.Desativado    = 0;

                _context.Porteiro.Add(porteiro);
            
                    _context.SaveChanges();
        }

        public Porteiro Find(int id)
        {
            return _context.Porteiro.Include(p => p.pessoa).ThenInclude(e => e.endereco).Include(u => u.usuario).FirstOrDefault(u => u.Id == id);
        }

        public IEnumerable<Porteiro> GetAll()
        {
            return _context.Porteiro.Include(p => p.pessoa).ThenInclude(e => e.endereco).Include(u => u.usuario).ToList();
        }

        public void Remove(int id)
        {
           var porteiro = _context.Porteiro
           .Where(p => p.Id == id)
           .First();

           var pessoa = _context.Pessoa
           .Where(pe => pe.Id == porteiro.Pessoa_Id)
           .First();

           var endereco = _context.Endereco
           .Where(e => e.Id == pessoa.Endereco_Id)
           .First();

           var usuario = _context.Usuario
           .Where(u => u.Id == porteiro.Usuario_Id)
           .First();


                _context.Remove(porteiro);
                _context.Remove(pessoa);
                _context.Remove(endereco);
                _context.Remove(usuario);

                _context.SaveChanges();
        }

        public void Update(Porteiro porteiro)
        {
            _context.Porteiro.Update(porteiro);
            _context.SaveChanges();
        }
    }
}