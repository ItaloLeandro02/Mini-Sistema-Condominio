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
            var transaction = _context.Database.BeginTransaction();

                try{
                    condomino.pessoa.Criacao        = DateTime.Now;
                    condomino.pessoa.Digital        = Util.Util.geraDigital();

                    condomino.usuario.Criacao       = DateTime.Now;
                    condomino.usuario.Tipo          = 2;
                    condomino.usuario.Desativado    = 0;
                    condomino.usuario.Senha         = TrataHash.GeraMD5Hash(condomino.usuario.Senha);
                    


                        if ((_context.Usuario.Where(x => x.Email == condomino.usuario.Email).DefaultIfEmpty().First() == null) && 
                            (_context.Pessoa.Where(x => x.Cpf == condomino.pessoa.Cpf).DefaultIfEmpty().First() == null)) {
                                 
                                _context.Usuario.Add(condomino.usuario);
                                _context.Pessoa.Add(condomino.pessoa);
                                _context.Condomino.Add(condomino);
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

        public Condomino Find(int id)
        {
            return _context.Condomino.Include(p => p.pessoa).Include(u => u.usuario).FirstOrDefault(u =>u.Id == id);
        }

        public IEnumerable<Condomino> GetAll()
        {
            return _context.Condomino.Include(p => p.pessoa).Include(u => u.usuario).AsNoTracking().ToList() ?? Enumerable.Empty<Condomino>();
        }

        public void Remove(int id)
        {

           var transaction = _context.Database.BeginTransaction();

                try {
                    var condomino = _context.Condomino
                    .Where(c => c.Id == id)
                    .First();

                    var pessoa = _context.Pessoa
                    .Where(p => p.Id == condomino.Pessoa_Id)
                    .First();

                    var endereco = _context.Endereco
                    .Where(e => e.Id == pessoa.Endereco_Id)
                    .First();

                    var usuario = _context.Usuario
                    .Where(u => u.Id == condomino.Usuario_Id)
                    .First();


                        _context.Condomino.Remove(condomino);
                        _context.Pessoa.Remove(pessoa);
                        _context.Endereco.Remove(endereco);
                        _context.Usuario.Remove(usuario);
                            _context.SaveChanges();
                                transaction.Commit();
                }
                catch (Exception e) {
                    Console.WriteLine("Erro:");
                        Console.WriteLine(e);
                            transaction.Rollback();
                }
        }

        public void Update(Condomino form, Condomino banco)
        {
            var transaction = _context.Database.BeginTransaction();
                try{

                    banco.pessoa.Nome          = form.pessoa.Nome;
                    banco.pessoa.Nascimento    = form.pessoa.Nascimento;

                    banco.usuario.Email        = form.usuario.Email;
                    banco.Endereco             = form.Endereco;
            
                    _context.Pessoa.Update(banco.pessoa);
                    _context.Usuario.Update(banco.usuario);
                    _context.Condomino.Update(banco);
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