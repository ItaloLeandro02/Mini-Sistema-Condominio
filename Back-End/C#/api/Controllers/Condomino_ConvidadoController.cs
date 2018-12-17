using System.Collections.Generic;
using api.Models;
using api.Repository;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[Controller]")]
    public class ConvidadoController : Controller
    {
        private readonly ICondomino_ConvidadoRepository _convidadoRepository;
        
        public ConvidadoController(ICondomino_ConvidadoRepository convidadoRepository) {
            _convidadoRepository = convidadoRepository;
        }

            [HttpGet]
            public ActionResult<RetornoView<Condomino_Convidado>> GetAll() {
                var resultado = new RetornoView<Condomino_Convidado>() {dadosConvidado = _convidadoRepository.GetAll()};
                    return resultado;
            }

            [HttpGet("{id}", Name = "GetConvidado")]
            public ActionResult<Condomino_Convidado> GetById(int id) {
                var convidado =  _convidadoRepository.Find(id);

                    if (convidado == null) {
                        return NotFound();
                    }

                    return convidado;
            }

            [HttpPost]
            public IActionResult Create([FromBody] Condomino_Convidado convidado) {
                if (convidado == null) {
                    return BadRequest();
                }

                _convidadoRepository.Add(convidado);

                    return CreatedAtRoute("GetConvidado", new {id = convidado.Id}, convidado);
            }

            [HttpPut("{id}")]
            public IActionResult Update(int id, [FromBody] Condomino_Convidado convidado) {
                if (convidado == null /* || condomino.Id != id*/) {
                    return BadRequest();
                }

                var _convidado = _convidadoRepository.Find(id);

                    if (_convidado == null) {
                        return NotFound();
                    }

                    _convidado.pessoa.Nome  = convidado.pessoa.Nome;

                    _convidado.Favorito     = convidado.Favorito;

                        _convidadoRepository.Update(_convidado);

                            return new NoContentResult();
            }

            [HttpDelete("{id}")]
            public IActionResult Delete(int id) {
                var condomino  = _convidadoRepository.Find(id);

                    if (condomino == null) {
                        return NotFound();
                    }

                    _convidadoRepository.Remove(id);

                        return new NoContentResult();
            }
    }
}