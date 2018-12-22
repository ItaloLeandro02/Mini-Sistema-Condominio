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
    public class PorteiroController : Controller
    {
        private readonly IPorteiroRepository _porteiroRepository;
        
        public PorteiroController(IPorteiroRepository porteiroRepository) {
            _porteiroRepository = porteiroRepository;
        }

            [HttpGet]
            public ActionResult<RetornoView<Porteiro>> GetAll() {
               string nome = HttpContext.Request.Query["nomePorteiro"];

                    if (!string.IsNullOrWhiteSpace(nome)) {
                        return Ok(
                            new {
                                data = _porteiroRepository
                                .GetAll()
                                .Where(x => x.pessoa.Nome.Contains(nome, StringComparison.OrdinalIgnoreCase))
                                .ToList()
                            });
                    }
                    else {
                        return Ok(
                            new {
                                data = _porteiroRepository.GetAll()
                            });
                    }
            }

            [HttpGet("{id}", Name = "GetPorteiro")]
            public  ActionResult<Porteiro> GetById(int id) {
                var porteiro =  _porteiroRepository.Find(id);

                    if (porteiro == null) {
                        return NotFound();
                    }

                        return Ok( new {
                            data    = porteiro
                        });
            }

            [HttpPost]
            public ActionResult<RetornoView<Porteiro>> Create([FromBody] Porteiro porteiro) {
                if (porteiro == null) {
                    return BadRequest();
                }

                    _porteiroRepository.Add(porteiro);

                        if (porteiro.Id > 0) {

                            var resultado  = new RetornoView<Porteiro>() {data = porteiro, sucesso = true};
                                return CreatedAtRoute("GetPorteiro", new {id = porteiro.Id}, resultado);
                        }
                        else {
                            var resultado  = new RetornoView<Porteiro>() {sucesso = false};
                                return BadRequest(resultado);
                        }
            }

            [HttpPut("{id}")]
            public ActionResult<RetornoView<Porteiro>> Update(int id, [FromBody] Porteiro porteiro) {
                if (porteiro == null  || porteiro.Id != id) {
                    return BadRequest();
                }

                    var _porteiro = _porteiroRepository.Find(id);

                        if (_porteiro == null) {
                            return NotFound();
                        }
                            _porteiroRepository.Update(porteiro, _porteiro);

                                if (_porteiroRepository.Find(id).Equals(_porteiro)) {
                                    var resultado = new RetornoView<Porteiro>() {data = _porteiro, sucesso = true};
                                        return resultado;
                                }
                                else {
                                    var resultado = new RetornoView<Porteiro>() {sucesso = false};
                                        return resultado;
                                }
            }

            [HttpDelete("{id}")]
            public ActionResult<RetornoView<Porteiro>> Delete(int id) {
                var porteiro  = _porteiroRepository.Find(id);

                    if (porteiro == null) {
                        return NotFound();
                    }

                        _porteiroRepository.Remove(id);

                            if (_porteiroRepository.Find(id) == null) {
                                var resultado = new RetornoView<Porteiro>() {sucesso = true};
                                    return resultado;
                            }
                            else {
                                var resultado = new RetornoView<Porteiro>() {sucesso = false};
                                    return BadRequest(resultado);
                            }
            }
    }
}