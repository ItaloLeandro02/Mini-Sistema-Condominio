using System.Collections.Generic;
using api.Models;
using api.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[Controller]")]
    [Authorize()]
    public class VisitaController : Controller
    {
        private readonly IVisitaRepository _visitaRepository;
        
        public VisitaController(IVisitaRepository visitaRepository) {
            _visitaRepository = visitaRepository;
        }

            [HttpGet]
            public ActionResult<RetornoView<Visita>> GetAll() {
                var resultado = new RetornoView<Visita>() {dadosVisita = _visitaRepository.GetAll()};
                    return resultado;
            }

            [HttpGet("{id}", Name = "GetVisita")]
            public ActionResult<Visita> GetById(int id) {
                var visita =  _visitaRepository.Find(id);

                    if (visita == null) {
                        return NotFound();
                    }

                    return visita;
            }

            [HttpPost]
            public IActionResult Create([FromBody] Visita visita) {
                if (visita == null) {
                    return BadRequest();
                }

                _visitaRepository.Add(visita);

                    return CreatedAtRoute("GetVisita", new {id = visita.Id}, visita);
            }

            [HttpPut("{id}")]
            public IActionResult Update(int id, [FromBody] Visita visita) {
                if (visita == null /* || visita.Id != id*/) {
                    return BadRequest();
                }

                var _visita = _visitaRepository.Find(id);

                    if (_visita == null) {
                        return NotFound();
                    }

                    _visita.Pessoa_Id                               = visita.Pessoa_Id;
                    _visita.Data_Hora_Reserva                       = visita.Data_Hora_Reserva;
                    _visita.Condomino_Observacao                    = visita.Condomino_Observacao;
                    _visita.Data_Hora_Expiracao                     = visita.Data_Hora_Expiracao;
                    _visita.Nome_Convidado                          = visita.Nome_Convidado;

                    _visita.Situacao                                = visita.Situacao;

                    _visita.Portaria_Data_Hora_Chegada              = visita.Portaria_Data_Hora_Chegada;
                    _visita.Porteiro_Id                             = visita.Porteiro_Id;
                    _visita.Portaria_Observacao                     = visita.Portaria_Observacao;

                 
                        _visitaRepository.Update(_visita);

                            return new NoContentResult();
            }

            [HttpDelete("{id}")]
            public IActionResult Delete(int id) {
                var visita  = _visitaRepository.Find(id);

                    if (visita == null) {
                        return NotFound();
                    }

                    _visitaRepository.Remove(id);

                        return new NoContentResult();
            }
    }
}