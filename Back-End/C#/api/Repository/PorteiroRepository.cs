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
            var transaction = _context.Database.BeginTransaction();
                try{
                    porteiro.pessoa.Criacao        = DateTime.Now;
                    porteiro.pessoa.Digital        = Util.Util.geraDigital();

                    porteiro.usuario.Criacao       = DateTime.Now;
                    porteiro.usuario.Tipo          = 1;
                    porteiro.usuario.Desativado    = 0;
                    porteiro.usuario.Senha         = TrataHash.GeraMD5Hash(porteiro.usuario.Senha);

                        if ((_context.Usuario.Where(x => x.Email == porteiro.usuario.Email).DefaultIfEmpty().First() == null) && 
                            (_context.Pessoa.Where(x => x.Cpf == porteiro.pessoa.Cpf).DefaultIfEmpty().First() == null)) {
                                
                                _context.Usuario.Add(porteiro.usuario);
                                _context.Pessoa.Add(porteiro.pessoa);
                                _context.Porteiro.Add(porteiro);
                                    _context.SaveChanges();
                                        transaction.Commit();
                        }
                        else {
                            transaction.Rollback();
                        }
                }
                catch (Exception e) {
                     Console.WriteLine("Erro");
                         Console.WriteLine(e);
                            transaction.Rollback();
                                return;
                }
        }

        public Porteiro Find(int id)
        {
            return _context.Porteiro.Include(p => p.pessoa).ThenInclude(e => e.endereco).Include(u => u.usuario).FirstOrDefault(u => u.Id == id);
        }

        public IEnumerable<Porteiro> GetAll()
        {
            return _context.Porteiro.Include(p => p.pessoa).ThenInclude(e => e.endereco).Include(u => u.usuario).AsNoTracking().ToList();
        }

        public void Remove(int id)
        {
            var transaction = _context.Database.BeginTransaction();
                try{
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

                        _context.Porteiro.Remove(porteiro);
                        _context.Pessoa.Remove(pessoa);
                        _context.Endereco.Remove(endereco);
                        _context.Usuario.Remove(usuario);
                            _context.SaveChanges();
                                transaction.Commit();
                }
                catch (Exception e) {
                     Console.WriteLine("Erro");
                         Console.WriteLine(e);
                            transaction.Rollback();
                                return;
                }
        }

        public void Update(Porteiro form, Porteiro banco)
        {
           var transaction = _context.Database.BeginTransaction();
                try{

                    banco.pessoa.Nome          = form.pessoa.Nome;
                    banco.pessoa.Nascimento    = form.pessoa.Nascimento;

                    banco.usuario.Email        = form.usuario.Email;
            
                        _context.Pessoa.Update(banco.pessoa);
                        _context.Usuario.Update(banco.usuario);
                        _context.Porteiro.Update(banco);
                            _context.SaveChanges();
                                transaction.Commit();
                }
                catch (Exception e) {
                     Console.WriteLine("Erro");
                         Console.WriteLine(e);
                            transaction.Rollback();
                                return;
                }
        }
    }
}