using System;
using System.Collections.Generic;
using System.Linq;
using api.Models;
using Microsoft.EntityFrameworkCore;

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
            var transaction = _context.Database.BeginTransaction();

                try{
                    _context.Endereco.Add(endereco);
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

        public Endereco Find(int id)
        {
            return _context.Endereco.FirstOrDefault(u => u.Id == id);
        }

        public IEnumerable<Endereco> GetAll()
        {
            return _context.Endereco.AsNoTracking().ToList();
        }

        public void Remove(int id)
        {
            var transaction = _context.Database.BeginTransaction();

                try {
                    var endereco = _context.Endereco
                    .Where(e => e.Id == id)
                    .First();

                        _context.Endereco.Remove(endereco);
                            _context.SaveChanges();
                                transaction.Commit();
                }

                catch (Exception e) {
                    Console.WriteLine("Erro:");
                        Console.WriteLine(e);
                            transaction.Rollback();
                }
        }

        public void Update(Endereco form, Endereco banco)
        {
            var transaction = _context.Database.BeginTransaction();
                try{
                    banco.Logradouro        = form.Logradouro;
                    banco.Numero            = form.Numero;
                    banco.Bairro            = form.Bairro;
                    banco.Cidade            = form.Cidade;
                    banco.Uf                = form.Uf;
    
                        _context.Endereco.Update(banco);
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