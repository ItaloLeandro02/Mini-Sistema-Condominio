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
                       return Ok(
                           new {
                               data = _condominoRepository
                               .GetAll()
                               .Where(x => x.pessoa.Nome.Contains(nome, StringComparison.OrdinalIgnoreCase))
                               .ToList(),
                               sucesso = true
                            });
                    }
                    else {
                        return Ok(
                            new {
                                data = _condominoRepository.GetAll(), 
                                sucesso = true
                            });
                    }
            }

            [HttpGet("{id}", Name = "GetCondomino")]
            public ActionResult<Condomino> GetById(int id) {
                var condomino =  _condominoRepository.Find(id);

                    if (condomino == null) {
                        return NotFound();
                    }
                    
                        return condomino;
            }

            [HttpPost]
            public ActionResult<RetornoView<Condomino>> Create([FromBody] Condomino condomino) {
                if (condomino == null) {
                    return BadRequest();
                }            

                    condomino.pessoa.Criacao        = DateTime.Now;
                    condomino.pessoa.Digital        = Util.Util.geraDigital();

                    condomino.usuario.Criacao       = DateTime.Now;
                    condomino.usuario.Tipo          = 2;
                    condomino.usuario.Desativado    = 0;

                    _condominoRepository.Add(condomino);

                        if (condomino.Id > 0) {

                            var resultado  = new RetornoView<Condomino>() {data = condomino, sucesso = true};

                                return CreatedAtRoute("GetCondomino", new {id = condomino.Id}, resultado);
                        }

                        else {

                            var resultado  = new RetornoView<Condomino>() {data = {}, sucesso = false};
                                return BadRequest(resultado);
                        }
            }

            [HttpPut("{id}")]
            public ActionResult<RetornoView<Condomino>> Update(int id, [FromBody] Condomino condomino) {
                if (condomino == null) {
                    return BadRequest();
                }

                    var _condomino = _condominoRepository.Find(id);

                        if (_condomino == null) {
                            return NotFound();
                        }

                            _condomino.pessoa.Nome          = condomino.pessoa.Nome;
                            _condomino.pessoa.Nascimento    = condomino.pessoa.Nascimento;

                            // _condomino.usuario.Email        = condomino.usuario.Email;
                            // _condomino.Endereco             = condomino.Endereco;

                                _condominoRepository.Update(_condomino);

                                    var resultado = new RetornoView<Condomino>() { sucesso = true};

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