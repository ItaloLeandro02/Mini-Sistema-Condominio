using System.Collections.Generic;
using api.Models;
using api.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[Controller]")]
    [Authorize()]
    public class PessoaController : Controller
    {
        private readonly IPessoaRepository _pessoaRepository;
        
        public PessoaController(IPessoaRepository pessoaRepository) {
            _pessoaRepository = pessoaRepository;
        }

            [HttpGet]
            public ActionResult<RetornoView<Pessoa>> GetAll() {
                return Ok( new {
                   data = _pessoaRepository.GetAll(), 
                   sucesso = true
                });
            }

            [HttpGet("{id}", Name = "GetPessoa")]
            public  ActionResult<Pessoa> GetById(int id) {
                var pessoa =  _pessoaRepository.Find(id);

                    if (pessoa == null) {
                        return NotFound();
                    }

                    return Ok( new {
                        data    = pessoa,
                        sucesso = true
                    });
            }

            [HttpPost]
            public ActionResult<RetornoView<Pessoa>> Create([FromBody] Pessoa pessoa) {
                if (pessoa == null) {
                    return BadRequest();
                }

                    _pessoaRepository.Add(pessoa);

                            var resultado  = new RetornoView<Pessoa>() {data = pessoa, sucesso = true};

                                return CreatedAtRoute("GetCondomino", new {id = pessoa.Id}, resultado);
            }

            [HttpPut("{id}")]
            public ActionResult<RetornoView<Pessoa>> Update(int id, [FromBody] Pessoa pessoa) {
                if (pessoa == null  || pessoa.Id != id) {
                    return BadRequest();
                }

                var _pessoa = _pessoaRepository.Find(id);

                    if (_pessoa == null) {
                        return NotFound();
                    }

                    _pessoa.Nome                    = pessoa.Nome;
                    _pessoa.Nascimento              = pessoa.Nascimento;

                    _pessoa.endereco.Logradouro     = pessoa.endereco.Logradouro;
                    _pessoa.endereco.Numero         = pessoa.endereco.Numero;
                    _pessoa.endereco.Bairro         = pessoa.endereco.Bairro;
                    _pessoa.endereco.Cidade         = pessoa.endereco.Cidade;
                    _pessoa.endereco.Uf             = pessoa.endereco.Uf;
                 
                        _pessoaRepository.Update(_pessoa);

                            var resultado = new RetornoView<Pessoa>() {data = _pessoa, sucesso = true};

                                return resultado;
            }

            [HttpDelete("{id}")]
            public ActionResult<RetornoView<Pessoa>> Delete(int id) {
                var pessoa  = _pessoaRepository.Find(id);

                    if (pessoa == null) {
                        return NotFound();
                    }

                        _pessoaRepository.Remove(id);

                            var resultado = new RetornoView<Pessoa>() {data = {}, sucesso = true};

                                _pessoaRepository.Remove(id);

                                    return resultado;
            }
    }
}