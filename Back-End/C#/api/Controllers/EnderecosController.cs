using System.Collections.Generic;
using api.Models;
using api.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[Controller]")]
    [Authorize()]
    public class EnderecoController : Controller
    {
        private readonly IEnderecoRepository _enderecoRepository;
        
        public EnderecoController(IEnderecoRepository enderecoRepository) {
            _enderecoRepository = enderecoRepository;
        }

            [HttpGet]
            public ActionResult<RetornoView<Endereco>> GetAll() {
                return Ok(
                    new {
                        data = _enderecoRepository.GetAll()
                    });
            }

            [HttpGet("{id}", Name = "GetEndereco")]
            public  ActionResult<Endereco> GetById(int id) {
                var endereco =  _enderecoRepository.Find(id);

                    if (endereco == null) {
                        return NotFound();
                    }

                        return Ok( new {
                            data    = endereco,
                        });
            }

            [HttpPost]
            public ActionResult<RetornoView<Endereco>> Create([FromBody] Endereco endereco) {
                if (endereco == null) {
                    return BadRequest();
                }
                    _enderecoRepository.Add(endereco);
                        
                        if (endereco.Id > 0) {
                            var resultado  = new RetornoView<Endereco>() {data = endereco, sucesso = true};
                                return CreatedAtRoute("GetEndereco", new {id = endereco.Id}, resultado);
                        }
                        else {
                            var resultado  = new RetornoView<Condomino>() {sucesso = false};
                                return BadRequest(resultado);
                        }
            }

            [HttpPut("{id}")]
            public ActionResult<RetornoView<Endereco>> Update(int id, [FromBody] Endereco endereco) {
                if (endereco == null || endereco.Id != id) {
                    return BadRequest();
                }

                var _endereco = _enderecoRepository.Find(id);

                    if (_endereco == null) {
                        return NotFound();
                    }

                        _enderecoRepository.Update(endereco, _endereco);
                            
                            if (_enderecoRepository.Find(id).Equals(_endereco)) {
                                var resultado = new RetornoView<Endereco>() {data = _endereco, sucesso = true};
                                    return resultado;
                            }
                            else {
                                var resultado = new RetornoView<Endereco>() {sucesso = false};
                                    return BadRequest(resultado);
                            }
            }

            [HttpDelete("{id}")]
            public ActionResult<RetornoView<Endereco>> Delete(int id) {
                var endereco  = _enderecoRepository.Find(id);

                    if (endereco == null) {
                        return NotFound();
                    }

                        _enderecoRepository.Remove(id);

                            if (_enderecoRepository.Find(id) == null) {
                                var resultado = new RetornoView<Endereco>() {sucesso = true};
                                    return resultado;
                            }
                            else {
                                var resultado = new RetornoView<Endereco>() {sucesso = false};
                                    return resultado;
                            }
            }
    }
}