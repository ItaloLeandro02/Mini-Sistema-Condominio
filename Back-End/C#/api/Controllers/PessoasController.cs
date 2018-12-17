using System.Collections.Generic;
using api.Models;
using api.Repository;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[Controller]")]
    public class PessoaController : Controller
    {
        private readonly IPessoaRepository _pessoaRepository;
        
        public PessoaController(IPessoaRepository pessoaRepository) {
            _pessoaRepository = pessoaRepository;
        }

            [HttpGet]
            public ActionResult<RetornoView<Pessoa>> GetAll() {
                var resultado = new RetornoView<Pessoa>() {dadosPessoa = _pessoaRepository.GetAll()};
                    return resultado;
            }

            [HttpGet("{id}", Name = "GetPessoa")]
            public ActionResult<Pessoa> GetById(int id) {
                var pessoa =  _pessoaRepository.Find(id);

                    if (pessoa == null) {
                        return NotFound();
                    }

                    return pessoa;
            }

            [HttpPost]
            public IActionResult Create([FromBody] Pessoa pessoa) {
                if (pessoa == null) {
                    return BadRequest();
                }

                _pessoaRepository.Add(pessoa);

                    return CreatedAtRoute("GetPessoa", new {id = pessoa.Id}, pessoa);
            }

            [HttpPut("{id}")]
            public IActionResult Update(int id, [FromBody] Pessoa pessoa) {
                if (pessoa == null /* || pessoa.Id != id*/) {
                    return BadRequest();
                }

                var _pessoa = _pessoaRepository.Find(id);

                    if (_pessoa == null) {
                        return NotFound();
                    }

                    _pessoa.Nome                    = pessoa.Nome;
                    _pessoa.Nascimento              = pessoa.Nascimento;

                    _pessoa.endereco.Logradouro     = pessoa.endereco.Logradouro;
                    _pessoa.endereco.Numero         = pessoa.endereco.Numero;
                    _pessoa.endereco.Bairro         = pessoa.endereco.Bairro;
                    _pessoa.endereco.Cidade         = pessoa.endereco.Cidade;
                    _pessoa.endereco.Uf             = pessoa.endereco.Uf;
                 
                        _pessoaRepository.Update(_pessoa);

                            return new NoContentResult();
            }

            [HttpDelete("{id}")]
            public IActionResult Delete(int id) {
                var pessoa  = _pessoaRepository.Find(id);

                    if (pessoa == null) {
                        return NotFound();
                    }

                    _pessoaRepository.Remove(id);

                        return new NoContentResult();
            }
    }
}