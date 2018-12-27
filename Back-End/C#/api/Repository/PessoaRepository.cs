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
            var transaction = _context.Database.BeginTransaction();

                try{
                    pessoa.Criacao        = DateTime.Now;
                    pessoa.Digital        = Util.Util.geraDigital();
                    
                        if ((_context.Pessoa.Where(x => x.Cpf == pessoa.Cpf).DefaultIfEmpty().First() == null)) {
                             
                                _context.Pessoa.Add(pessoa);
                                    _context.SaveChanges();
                                        transaction.Commit();     
                        }
                        else {
                            transaction.Rollback();
                        }     
                 }
                 catch (Exception e) {
                     Console.WriteLine("Erro Salvar");
                         Console.WriteLine(e);
                            transaction.Rollback();
                                return;
                 }
        }

        public Pessoa Find(int id)
        {
            return _context.Pessoa.Include(p => p.endereco).AsNoTracking().FirstOrDefault(u => u.Id == id);
        }

        public IEnumerable<Pessoa> GetAll()
        {
            return _context.Pessoa.Include(p => p.endereco).ToList() ?? Enumerable.Empty<Pessoa>();
        }

        public void Remove(int id)
        {
            var transaction = _context.Database.BeginTransaction();

                try {
                    var pessoa = _context.Pessoa
                    .Where(p => p.Id == id)
                    .First();

                    var endereco = _context.Endereco
                    .Where(e => e.Id == pessoa.Endereco_Id)
                    .First();


                        _context.Pessoa.Remove(pessoa);
                        _context.Endereco.Remove(endereco);
                            _context.SaveChanges();
                                transaction.Commit();
                }
                catch (Exception e) {
                    Console.WriteLine("Erro Remover");
                        Console.WriteLine(e);
                            transaction.Rollback();
                }
        }

        public void Update(Pessoa form, Pessoa banco)
        {
            var transaction = _context.Database.BeginTransaction();
                try{

                    banco.Nome                    = form.Nome;
                    banco.Nascimento              = form.Nascimento;

                    banco.endereco.Logradouro     = form.endereco.Logradouro;
                    banco.endereco.Numero         = form.endereco.Numero;
                    banco.endereco.Bairro         = form.endereco.Bairro;
                    banco.endereco.Cidade         = form.endereco.Cidade;
                    banco.endereco.Uf             = form.endereco.Uf;
            
                        _context.Endereco.Update(banco.endereco);
                        _context.Pessoa.Update(banco);
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