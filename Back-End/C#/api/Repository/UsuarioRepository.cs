using System.Collections.Generic;
using System.Linq;
using api.Models;
using System;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly DataDbContext _context;
        public UsuarioRepository(DataDbContext ctx) {
            _context = ctx;
        }
        public void Add(Usuario usuario)
        {
            var transaction = _context.Database.BeginTransaction();
                try{
                    usuario.Criacao       = DateTime.Now;
                    usuario.Desativado    = 0;
                    usuario.Senha         = TrataHash.GeraMD5Hash(usuario.Senha);
            
                       if ((_context.Usuario.Where(x => x.Email == usuario.Email).DefaultIfEmpty().First() == null)) {
                             
                                _context.Usuario.Add(usuario);
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

        public Usuario Find(int id)
        {
            return _context.Usuario.FirstOrDefault(u => u.Id == id);
        }

        public IEnumerable<Usuario> GetAll()
        {
            return _context.Usuario.AsNoTracking().ToList();
        }

        public void Remove(int id)
        {
            var transaction = _context.Database.BeginTransaction();
                try{
                    var entity = _context.Usuario.First(u => u.Id == id);
                        _context.Usuario.Remove(entity);
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

        public void Update(Usuario form, Usuario banco)
        {
            var transaction = _context.Database.BeginTransaction();
                try{
                    banco.Email        = form.Email;
                    banco.Senha         = form.Senha;
            
                        _context.Usuario.Update(banco);
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