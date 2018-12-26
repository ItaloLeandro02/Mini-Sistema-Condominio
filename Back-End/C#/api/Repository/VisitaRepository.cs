using System;
using System.Collections.Generic;
using System.Linq;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class VisitaRepository : IVisitaRepository
    {
        private readonly DataDbContext _context;
        public VisitaRepository(DataDbContext ctx) {
            _context = ctx;
        }
        public void Add(Visita visita)
        {

            var transaction = _context.Database.BeginTransaction();
                try {
                    visita.Portaria_Data_Hora_Chegada   = null;
                    visita.Portaria_Observacao          = null;
                    visita.Situacao                     = 1;

                        _context.Visita.Add(visita);
                            _context.SaveChanges();
                                transaction.Commit();
                }
                catch (Exception e) {
                    Console.WriteLine("Erro Adicionar");
                        Console.WriteLine(e);
                            transaction.Rollback();
                                return;
                }
        }
    
        public Visita Find(int id)
        {
            return _context.Visita
            .Include(p => p.pessoa)
            .Include(c => c.condomino)
            .ThenInclude(p => p.pessoa)
            .FirstOrDefault(u => u.Id == id);
        }

        public IEnumerable<Visita> GetAll()
        {
            return _context.Visita
            .Include(p => p.pessoa)
            .Include(c => c.condomino)
            .ThenInclude(p => p.pessoa)
            .AsNoTracking()
            .ToList();
        }

        public void Remove(int id)
        {
            var transaction = _context.Database.BeginTransaction();
                try {
                    var entity = _context.Visita.First(u => u.Id == id);
                        _context.Visita.Remove(entity);
                            _context.SaveChanges();
                                transaction.Commit();
                }
                catch (Exception e) {
                    Console.WriteLine("Erro Remover");
                        Console.WriteLine(e);
                            transaction.Rollback();
                                return;
                }
        }

        public void Update(Visita visita)
        {
            var transaction = _context.Database.BeginTransaction();
                try {
                    _context.Visita.Update(visita);
                        _context.SaveChanges();
                            transaction.Commit();
                }
                catch (Exception e) {
                    Console.WriteLine("Erro Atualizar");
                        Console.WriteLine(e);
                            transaction.Rollback();
                                return;
                }
        }
    }
}