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
    public class ConvidadoController : Controller
    {
        private readonly ICondomino_ConvidadoRepository _convidadoRepository;
        
        public ConvidadoController(ICondomino_ConvidadoRepository convidadoRepository) {
            _convidadoRepository = convidadoRepository;
        }

            [HttpGet]
            public ActionResult<RetornoView<Condomino_Convidado>> GetAll() {
               string condominoId   = HttpContext.Request.Query["condomino"];
               string nomeConvidado = HttpContext.Request.Query["convidado"];

                    if (!string.IsNullOrWhiteSpace(condominoId) && !string.IsNullOrWhiteSpace(nomeConvidado)) {
                        var resultado = new RetornoView<Condomino_Convidado>() {data = _convidadoRepository.GetAll().Where(x => x.pessoa.Nome.Contains(nomeConvidado, StringComparison.OrdinalIgnoreCase)).ToList(), sucesso = true};
                        return resultado;
                    }

                        else if (!string.IsNullOrWhiteSpace(condominoId)) {
                            var resultado = new RetornoView<Condomino_Convidado>() {data = _convidadoRepository.GetAll().Where(x => x.pessoa.Nome.Contains(nomeConvidado, StringComparison.OrdinalIgnoreCase)).ToList(), sucesso = true};
                            return resultado;
                        }
                            else {
                                var resultado = new RetornoView<Condomino_Convidado>() {data = _convidadoRepository.GetAll(), sucesso = true};
                                return resultado;
                            }
            }

            [HttpGet("{id}", Name = "GetConvidado")]
            public  ActionResult<Condomino_Convidado> GetById(int id) {
                var convidado =  _convidadoRepository.Find(id);

                    if (convidado == null) {
                        return NotFound();
                    }

                        return Ok( new {
                            data    = convidado,
                            sucesso = true
                        });
            }

            [HttpPost]
            public ActionResult<RetornoView<Condomino_Convidado>> Create([FromBody] Condomino_Convidado convidado) {
                if (convidado == null) {
                    return BadRequest();
                }

                    _convidadoRepository.Add(convidado);

                        IEnumerable<Condomino_Convidado> data = new []{ convidado };

                            var resultado  = new RetornoView<Condomino_Convidado>() {data = data, sucesso = true};

                                return CreatedAtRoute("GetCondomino", new {id = convidado.Id}, resultado);
            }

            [HttpPut("{id}")]
            public ActionResult<RetornoView<Condomino_Convidado>> Update(int id, [FromBody] Condomino_Convidado convidado) {
                if (convidado == null || convidado.Id != id) {
                    return BadRequest();
                }

                var _convidado = _convidadoRepository.Find(id);

                    if (_convidado == null) {
                        return NotFound();
                    }

                    _convidado.pessoa.Nome  = convidado.pessoa.Nome;

                    _convidado.Favorito     = convidado.Favorito;

                        _convidadoRepository.Update(_convidado);

                             IEnumerable<Condomino_Convidado> data = new []{ _convidado };

                                        var resultado = new RetornoView<Condomino_Convidado>() {data = data, sucesso = true};

                                            return resultado;
            }

            [HttpDelete("{id}")]
            public ActionResult<RetornoView<Condomino_Convidado>> Delete(int id) {
                var condomino  = _convidadoRepository.Find(id);

                    if (condomino == null) {
                        return NotFound();
                    }

                     var resultado = new RetornoView<Condomino_Convidado>() {data = {}, sucesso = true};

                            _convidadoRepository.Remove(id);

                                return resultado;
            }
    }
}