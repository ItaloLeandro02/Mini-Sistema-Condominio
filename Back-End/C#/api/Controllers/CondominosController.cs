using System;
using System.Collections.Generic;
using System.Linq;
using api.Models;
using api.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[Controller]")]
    [Authorize()]
    public class CondominoController : Controller
    {
        private readonly ICondominoRepository _condominoRepository;
        
        public CondominoController(ICondominoRepository condominoRepository) {
            _condominoRepository = condominoRepository;
        }

            [HttpGet]
            public ActionResult<RetornoView<Condomino>> GetAll() {

                string nome = HttpContext.Request.Query["search"];

                    if (!string.IsNullOrWhiteSpace(nome)) {
                        var resultado = new RetornoView<Condomino>() {data = _condominoRepository.GetAll().Where(x => x.pessoa.Nome.Contains(nome, StringComparison.OrdinalIgnoreCase)).ToList(), sucesso = true};
                        return resultado;
                    }
                    else {
                        var resultado = new RetornoView<Condomino>() {data = _condominoRepository.GetAll(), sucesso = true};
                        return resultado;
                    }
            }

            [HttpGet("{id}", Name = "GetCondomino")]
            public ActionResult<Condomino> GetById(int id) {
                var condomino =  _condominoRepository.Find(id);

                    if (condomino == null) {
                        return NotFound();
                    }

                        return Ok( new {
                            data    = condomino,
                            sucesso = true
                        });
            }

            [HttpPost]
            public ActionResult<RetornoView<Condomino>> Create([FromBody] Condomino condomino) {
                if (condomino == null) {
                    return BadRequest();
                }
                    _condominoRepository.Add(condomino);

                        IEnumerable<Condomino> data = new []{ condomino };

                            var resultado  = new RetornoView<Condomino>() {data = data, sucesso = true};

                                return CreatedAtRoute("GetCondomino", new {id = condomino.Id}, resultado);
            }

            [HttpPut("{id}")]
            public ActionResult<RetornoView<Condomino>> Update(int id, [FromBody] Condomino condomino) {
                if (condomino == null || condomino.Id != id) {
                    return BadRequest();
                }

                    var _condomino = _condominoRepository.Find(id);

                        if (_condomino == null) {
                            return NotFound();
                        }

                            _condomino.pessoa.Nome          = condomino.pessoa.Nome;
                            _condomino.pessoa.Nascimento    = condomino.pessoa.Nascimento;

                            _condomino.usuario.Email        = condomino.usuario.Email;
                            _condomino.Endereco             = condomino.Endereco;

                                _condominoRepository.Update(_condomino);

                                    IEnumerable<Condomino> data = new []{ _condomino };

                                        var resultado = new RetornoView<Condomino>() {data = data, sucesso = true};

                                            return resultado;
            }

            [HttpDelete("{id}")]
            public ActionResult<RetornoView<Condomino>> Delete(int id) {
                var condomino  = _condominoRepository.Find(id);

                    if (condomino == null) {
                        return NotFound();
                    }

                        var resultado = new RetornoView<Condomino>() {data = {}, sucesso = true};

                            _condominoRepository.Remove(id);

                                return resultado;
            }
    }
}