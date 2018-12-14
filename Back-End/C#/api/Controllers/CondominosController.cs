using System.Collections.Generic;
using api.Models;
using api.Repository;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[Controller]")]
    public class CondominosController : Controller
    {
        private readonly ICondominoRepository _condominoRepository;
        
        public CondominosController(ICondominoRepository condominoRepository) {
            _condominoRepository = condominoRepository;
        }

            [HttpGet]
            public ActionResult<RetornoView<Condomino>> GetAll() {
                var resultado = new RetornoView<Condomino>() {dadosCondomino = _condominoRepository.GetAll()};
                    return resultado;
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
            public IActionResult Create([FromBody] Condomino condomino) {
                if (condomino == null) {
                    return BadRequest();
                }

                _condominoRepository.Add(condomino);

                    return CreatedAtRoute("GetCondomino", new {id = condomino.Id}, condomino);
            }

            [HttpPut("{id}")]
            public IActionResult Update(int id, [FromBody] Condomino condomino) {
                if (condomino == null || condomino.Id != id) {
                    return BadRequest();
                }

                var _condomino = _condominoRepository.Find(id);

                    if (_condomino == null) {
                        return NotFound();
                    }

                    _condomino.Pessoa_Id     = condomino.Pessoa_Id;
                    _condomino.Usuario_Id    = condomino.Usuario_Id;
                    _condomino.Endereco     = condomino.Endereco;

                        _condominoRepository.Update(_condomino);

                            return new NoContentResult();
            }

            [HttpDelete("{id}")]
            public IActionResult Delete(int id) {
                var condomino  = _condominoRepository.Find(id);

                    if (condomino == null) {
                        return NotFound();
                    }

                    _condominoRepository.Remove(id);

                        return new NoContentResult();
            }
    }
}