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
    public class VisitaController : Controller
    {
        private readonly IVisitaRepository _visitaRepository;
        
        public VisitaController(IVisitaRepository visitaRepository) {
            _visitaRepository = visitaRepository;
        }

            [HttpGet]
            public ActionResult<RetornoView<Visita>> GetAll() {
                
                string condominoId = HttpContext.Request.Query["condomino"];
                int id = Convert.ToInt32(condominoId);

                    if (!string.IsNullOrWhiteSpace(condominoId)) {
                       return Ok(
                           new { 
                               data = _visitaRepository
                               .GetAll()
                               .Where(x => x.Condomino_Id == id)
                               .ToList(),
                               sucesso = true
                            });
                    }
                    else {
                        return Ok(
                            new {
                                data = _visitaRepository.GetAll(),
                                sucesso = true
                            });
                    }
            }

            [HttpGet("{id}", Name = "GetVisita")]
            public ActionResult<Visita> GetById(int id) {
                var visita =  _visitaRepository.Find(id);

                    if (visita == null) {
                        return NotFound();
                    }

                        return Ok( new {
                            data    = visita,
                            sucesso = true
                        });
            }

            [HttpPost("nova-visita")]
            public ActionResult<RetornoView<Visita>> Create([FromBody] Visita visita) {
                if (visita == null) {
                    return BadRequest();
                }

                    visita.Portaria_Data_Hora_Chegada   = null;
                    visita.Portaria_Observacao          = null;
                    visita.Situacao                     = 1;

                    _visitaRepository.Add(visita);

                        var resultado  = new RetornoView<Visita>() {data = visita, sucesso = true};

                            return CreatedAtRoute("GetVisita", new {id = visita.Id}, resultado);
            }

            [HttpPut("{id}")]
            public ActionResult<RetornoView<Visita>> Update(int id, [FromBody] Visita visita) {
                if (visita == null  || visita.Id != id) {
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
                 
                            _visitaRepository.Update(_visita);

                                var resultado = new RetornoView<Visita>() {data = _visita, sucesso = true};

                                    return resultado;
            }

            [HttpPut("{id}/pessoa")]
            public ActionResult<RetornoView<Visita>> UpdatePessoa(int id, [FromBody] Visita visita) {
                
                    if (visita == null  || visita.Id != id) {
                        return BadRequest();
                    }
                    
                        var _visita = _visitaRepository.Find(id);
                          
                            if (_visita == null) {
                                return NotFound();
                            }

                                _visita.Pessoa_Id                               = visita.Pessoa_Id;
                                _visita.Nome_Convidado                          = visita.Nome_Convidado;
                        
                                    _visitaRepository.Update(_visita);

                                        var resultado = new RetornoView<Visita>() {data = _visita, sucesso = true};

                                            return resultado;
            }

            [HttpPut("{id}/portaria")]
            public ActionResult<RetornoView<Visita>> UpdatePortaria(int id, [FromBody] Visita visita) {
                
                    if (visita == null  || visita.Id != id) {
                        return BadRequest();
                    }
                    
                        var _visita = _visitaRepository.Find(id);
                          
                            if (_visita == null) {
                                return NotFound();
                            }

                                _visita.Portaria_Data_Hora_Chegada        = visita.Portaria_Data_Hora_Chegada;
                                _visita.Portaria_Observacao               = visita.Portaria_Observacao;
                                _visita.Porteiro_Id                       = visita.Porteiro_Id;
                                _visita.Situacao                          = visita.Situacao;
                        
                                    _visitaRepository.Update(_visita);

                                        var resultado = new RetornoView<Visita>() {data = _visita, sucesso = true};

                                            return resultado;
            }

            [HttpPut("{id}/situacao")]
            public ActionResult<RetornoView<Visita>> UpdateSituacao(int id, [FromBody] Visita visita) {
                
                    if (visita == null  || visita.Id != id) {
                        return BadRequest();
                    }
                    
                        var _visita = _visitaRepository.Find(id);
                          
                            if (_visita == null) {
                                return NotFound();
                            }
                                _visita.Situacao                          = visita.Situacao;
                        
                                    _visitaRepository.Update(_visita);

                                        var resultado = new RetornoView<Visita>() {data = _visita, sucesso = true};

                                            return resultado;
            }

            [HttpDelete("{id}")]
            public ActionResult<RetornoView<Visita>> Delete(int id) {
                var visita  = _visitaRepository.Find(id);

                    if (visita == null) {
                        return NotFound();
                    }

                        _visitaRepository.Remove(id);

                            var resultado = new RetornoView<Visita>() {data = {}, sucesso = true};

                                _visitaRepository.Remove(id);

                                    return resultado;
            }
    }
}