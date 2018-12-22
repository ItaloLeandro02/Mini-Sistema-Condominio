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
                   data = _pessoaRepository.GetAll()
                });
            }

            [HttpGet("{id}", Name = "GetPessoa")]
            public  ActionResult<Pessoa> GetById(int id) {
                var pessoa =  _pessoaRepository.Find(id);

                    if (pessoa == null) {
                        return NotFound();
                    }

                        return Ok( new {
                            data    = pessoa
                        });
            }

            [HttpPost]
            public ActionResult<RetornoView<Pessoa>> Create([FromBody] Pessoa pessoa) {
                if (pessoa == null) {
                    return BadRequest();
                }

                    _pessoaRepository.Add(pessoa);

                        if (pessoa.Id > 0) {

                            var resultado  = new RetornoView<Pessoa>() {data = pessoa, sucesso = true};
                                return CreatedAtRoute("GetCondomino", new {id = pessoa.Id}, resultado);
                        }
                        else {
                            var resultado = new RetornoView<Pessoa>() {sucesso = false};
                                return BadRequest(resultado);
                        }
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

                            _pessoaRepository.Update(pessoa, _pessoa);

                                if (_pessoaRepository.Find(id).Equals(_pessoa)) {
                                    var resultado = new RetornoView<Pessoa>() {data = _pessoa, sucesso = true};
                                        return resultado;
                                }
                                else {
                                    var resultado = new RetornoView<Pessoa>() {data = {}, sucesso = false};
                                        return BadRequest(resultado);
                                }
            }

            [HttpDelete("{id}")]
            public ActionResult<RetornoView<Pessoa>> Delete(int id) {
                var pessoa  = _pessoaRepository.Find(id);

                    if (pessoa == null) {
                        return NotFound();
                    }

                        _pessoaRepository.Remove(id);

                            if (_pessoaRepository.Find(id) == null) {
                                var resultado = new RetornoView<Pessoa>() {sucesso = true};
                                    return resultado;
                            }
                            else {
                                var resultado = new RetornoView<Pessoa>() {sucesso = false};
                                    return BadRequest(resultado);
                            }
            }
    }
}