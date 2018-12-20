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
                        var resultado = new RetornoView<Porteiro>() {data = _porteiroRepository.GetAll().Where(x => x.pessoa.Nome.Contains(nome, StringComparison.OrdinalIgnoreCase)).ToList(), sucesso = true};
                        return resultado;
                    }
                    else {
                        var resultado = new RetornoView<Porteiro>() {data = _porteiroRepository.GetAll(), sucesso = true};
                            return resultado;
                    }
            }

            [HttpGet("{id}", Name = "GetPorteiro")]
            public  ActionResult<Porteiro> GetById(int id) {
                var porteiro =  _porteiroRepository.Find(id);

                    if (porteiro == null) {
                        return NotFound();
                    }

                        return Ok( new {
                            data    = porteiro,
                            sucesso = true
                        });
            }

            [HttpPost]
            public ActionResult<RetornoView<Porteiro>> Create([FromBody] Porteiro porteiro) {
                if (porteiro == null) {
                    return BadRequest();
                }

                _porteiroRepository.Add(porteiro);

                    IEnumerable<Porteiro> data = new []{ porteiro };

                        var resultado  = new RetornoView<Porteiro>() {data = data, sucesso = true};

                            return CreatedAtRoute("GetPorteiro", new {id = porteiro.Id}, resultado);
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

                            _porteiro.pessoa.Nome                   = porteiro.pessoa.Nome;
                            _porteiro.pessoa.Nascimento             = porteiro.pessoa.Nascimento;

                            _porteiro.pessoa.endereco.Logradouro    = porteiro.pessoa.endereco.Logradouro;
                            _porteiro.pessoa.endereco.Numero        = porteiro.pessoa.endereco.Numero;
                            _porteiro.pessoa.endereco.Bairro        = porteiro.pessoa.endereco.Bairro;
                            _porteiro.pessoa.endereco.Cidade        = porteiro.pessoa.endereco.Cidade;
                            _porteiro.pessoa.endereco.Uf            = porteiro.pessoa.endereco.Uf;

                            _porteiro.usuario.Email                 = porteiro.usuario.Email;

                                _porteiroRepository.Update(_porteiro);

                                    IEnumerable<Porteiro> data = new []{ _porteiro };

                                        var resultado = new RetornoView<Porteiro>() {data = data, sucesso = true};

                                            return resultado;
            }

            [HttpDelete("{id}")]
            public ActionResult<RetornoView<Porteiro>> Delete(int id) {
                var porteiro  = _porteiroRepository.Find(id);

                    if (porteiro == null) {
                        return NotFound();
                    }

                        _porteiroRepository.Remove(id);

                            var resultado = new RetornoView<Porteiro>() {data = {}, sucesso = true};

                                return resultado;
            }
    }
}