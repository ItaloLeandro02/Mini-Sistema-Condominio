using System.Collections.Generic;
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
                var resultado = new RetornoView<Porteiro>() {dadosPorteiro = _porteiroRepository.GetAll()};
                    return resultado;
            }

            [HttpGet("{id}", Name = "GetPorteiro")]
            public ActionResult<Porteiro> GetById(int id) {
                var porteiro =  _porteiroRepository.Find(id);

                    if (porteiro == null) {
                        return NotFound();
                    }

                    return porteiro;
            }

            [HttpPost]
            public IActionResult Create([FromBody] Porteiro porteiro) {
                if (porteiro == null) {
                    return BadRequest();
                }

                _porteiroRepository.Add(porteiro);

                    return CreatedAtRoute("GetPorteiro", new {id = porteiro.Id}, porteiro);
            }

            [HttpPut("{id}")]
            public IActionResult Update(int id, [FromBody] Porteiro porteiro) {
                if (porteiro == null /* || porteiro.Id != id*/) {
                    return BadRequest();
                }

                var _porteiro = _porteiroRepository.Find(id);

                    if (_porteiro == null) {
                        return NotFound();
                    }

                    _porteiro.pessoa.Nome          = porteiro.pessoa.Nome;
                    _porteiro.pessoa.Nascimento    = porteiro.pessoa.Nascimento;

                    _porteiro.usuario.Email        = porteiro.usuario.Email;

                        _porteiroRepository.Update(_porteiro);

                            return new NoContentResult();
            }

            [HttpDelete("{id}")]
            public IActionResult Delete(int id) {
                var porteiro  = _porteiroRepository.Find(id);

                    if (porteiro == null) {
                        return NotFound();
                    }

                    _porteiroRepository.Remove(id);

                        return new NoContentResult();
            }
    }
}