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
                var resultado = new RetornoView<Endereco>() {data = _enderecoRepository.GetAll(), sucesso = true};
                    return resultado;
            }

            [HttpGet("{id}", Name = "GetEndereco")]
            public  ActionResult<Endereco> GetById(int id) {
                var endereco =  _enderecoRepository.Find(id);

                    if (endereco == null) {
                        return NotFound();
                    }

                        return Ok( new {
                            data    = endereco,
                            sucesso = true
                        });
            }

            [HttpPost]
            public ActionResult<RetornoView<Endereco>> Create([FromBody] Endereco endereco) {
                if (endereco == null) {
                    return BadRequest();
                }

                    _enderecoRepository.Add(endereco);

                        IEnumerable<Endereco> data = new []{ endereco };

                            var resultado  = new RetornoView<Endereco>() {data = data, sucesso = true};

                                    return CreatedAtRoute("GetEndereco", new {id = endereco.Id}, resultado);
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

                        _endereco.Logradouro        = endereco.Logradouro;
                        _endereco.Numero            = endereco.Numero;
                        _endereco.Bairro            = endereco.Bairro;
                        _endereco.Cidade            = endereco.Cidade;
                        _endereco.Uf                = endereco.Uf;
                 
                            _enderecoRepository.Update(_endereco);

                                IEnumerable<Endereco> data = new []{ _endereco };

                                    var resultado = new RetornoView<Endereco>() {data = data, sucesso = true};

                                        return resultado;
            }

            [HttpDelete("{id}")]
            public ActionResult<RetornoView<Endereco>> Delete(int id) {
                var endereco  = _enderecoRepository.Find(id);

                    if (endereco == null) {
                        return NotFound();
                    }

                    _enderecoRepository.Remove(id);

                        var resultado = new RetornoView<Endereco>() {data = {}, sucesso = true};

                            _enderecoRepository.Remove(id);

                                return resultado;
            }
    }
}