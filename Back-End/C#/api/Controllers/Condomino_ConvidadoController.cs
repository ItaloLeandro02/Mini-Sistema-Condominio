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
               int id               = Convert.ToInt32(condominoId); 
               string nomeConvidado = HttpContext.Request.Query["convidado"];

                    if (!string.IsNullOrWhiteSpace(condominoId) && !string.IsNullOrWhiteSpace(nomeConvidado)) {
                        return Ok( 
                            new {
                                data = _convidadoRepository
                                    .GetAll()
                                    .Where(x => x.pessoa.Nome
                                    .Contains(nomeConvidado, StringComparison.OrdinalIgnoreCase))
                                    .Where(c => c.Condomino_Id == id)
                                    .ToList()
                            });
                    }

                        else if (!string.IsNullOrWhiteSpace(condominoId)) {
                            return Ok( 
                                new {
                                    data = _convidadoRepository
                                        .GetAll()
                                        .Where(c => c.Condomino_Id == id)
                                        .ToList()
                                    });
                        }
                            else {
                                return Ok( 
                                    new {
                                        data = _convidadoRepository.GetAll()
                                    });
                            }
            }

            [HttpGet("{id}", Name = "GetConvidado")]
            public  ActionResult<Condomino_Convidado> GetById(int id) {
                var convidado =  _convidadoRepository.Find(id);

                    if (convidado == null) {
                        return NotFound();
                    }

                        return Ok( new {
                            data    = convidado
                        });
            }

            [HttpPost]
            public ActionResult<RetornoView<Condomino_Convidado>> Create([FromBody] Condomino_Convidado convidado) {
                if (convidado == null) {
                    return BadRequest();
                }

                    _convidadoRepository.Add(convidado);
                    

                        if (convidado.Id > 0) {

                            var resultado  = new RetornoView<Condomino_Convidado>() {data = convidado, sucesso = true};

                                return CreatedAtRoute("GetConvidado", new {id = convidado.Id}, resultado);
                        }
                        else {

                            var resultado  = new RetornoView<Condomino_Convidado>() {data = {}, sucesso = false};
                                return BadRequest(resultado);
                        }
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

                            _convidadoRepository.Update(convidado, _convidado);

                                if (_convidadoRepository.Find(id).Equals(_convidado)) {
                                    var resultado = new RetornoView<Condomino_Convidado>() {data = _convidado, sucesso = true};
                                        return resultado;
                                }
                                else {
                                    var resultado = new RetornoView<Condomino_Convidado>() {sucesso = false};
                                        return BadRequest(resultado);
                                }
            }

            [HttpDelete("{id}")]
            public ActionResult<RetornoView<Condomino_Convidado>> Delete(int id) {
                var condomino  = _convidadoRepository.Find(id);

                    if (condomino == null) {
                        return NotFound();
                    }
                        _convidadoRepository.Remove(id);
                        
                            if (_convidadoRepository.Find(id) == null) {
                                var resultado = new RetornoView<Condomino_Convidado>() {data = {}, sucesso = true};
                                    return resultado;
                            }
                            else {
                                var resultado = new RetornoView<Condomino_Convidado>() {data = {}, sucesso = false};
                                    return BadRequest(resultado);
                            }
            }
    }
}