using System;
using System.Collections.Generic;
using System.Linq;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class Condomino_ConvidadoRepository : ICondomino_ConvidadoRepository
    {
        private readonly DataDbContext _context;

        public Condomino_ConvidadoRepository(DataDbContext ctx) {
            _context = ctx;
        }
        public void Add(Condomino_Convidado convidado)
        {
            var transaction = _context.Database.BeginTransaction();

                try{

                    convidado.Favorito = 0;
                        // _context.Pessoa.Add(convidado.pessoa);
                        //     _context.Condomino.Add(convidado.condomino);
                                _context.Condomino_Convidado.Add(convidado);
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

        public Condomino_Convidado Find(int id)
        {
            return _context.Condomino_Convidado
            .Include(c => c.condomino)
            .ThenInclude(f => f.pessoa)
            .Include(p => p.pessoa)
            .ThenInclude(e => e.endereco)
            .FirstOrDefault(u =>u.Id == id);
        }

        public IEnumerable<Condomino_Convidado> GetAll()
        {
            return _context.Condomino_Convidado
            .Include(c => c.condomino)
            .ThenInclude(f => f.pessoa)
            .Include(p => p.pessoa)
            .ThenInclude(e => e.endereco)
            .AsNoTracking()
            .ToList() ?? Enumerable.Empty<Condomino_Convidado>();
        }

        public void Remove(int id)
        {
             var transaction = _context.Database.BeginTransaction();

                try {

                    var convidado = _context.Condomino_Convidado
                    .Where(c => c.Id == id)
                    .First();

                    var pessoa = _context.Pessoa
                    .Where(p => p.Id == convidado.Pessoa_Id)
                    .Include(e => e.endereco)
                    .First();

                        _context.Pessoa.Remove(pessoa);
                            _context.SaveChanges();
                                transaction.Commit();
                }

                catch (Exception e) {
                    Console.WriteLine("Erro:");
                    Console.WriteLine(e);
                        transaction.Rollback();
                }
        }

        public void Update(Condomino_Convidado form, Condomino_Convidado banco)
        {
            var transaction = _context.Database.BeginTransaction();

                try{

                    banco.Favorito = form.Favorito;
                    
                        _context.Condomino_Convidado.Update(banco);
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