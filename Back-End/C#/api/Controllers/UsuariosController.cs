using System.Collections.Generic;
using api.Models;
using api.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[Controller]")]
    [Authorize()]
    public class UsuarioController : Controller
    {
        private readonly IUsuarioRepository _usuarioRepository;
        
        public UsuarioController(IUsuarioRepository usuarioRepository) {
            _usuarioRepository = usuarioRepository;
        }

            [HttpGet]
            public ActionResult<RetornoView<Usuario>> GetAll() {
                return Ok( 
                    new {
                        data = _usuarioRepository.GetAll(),
                        sucesso = true});
            }

            [HttpGet("{id}", Name = "GetUsuario")]
            public ActionResult<Usuario> GetById(int id) {
                var usuario =  _usuarioRepository.Find(id);

                    if (usuario == null) {
                        return NotFound();
                    }

                        return Ok( new {
                            data    = usuario,
                            sucesso = true
                        });
            }

            [HttpPost]
            public ActionResult<RetornoView<Usuario>> Create([FromBody] Usuario usuario) {
                if (usuario == null) {
                    return BadRequest();
                }

                    _usuarioRepository.Add(usuario);

                        var resultado  = new RetornoView<Usuario>() {data = usuario, sucesso = true};

                            return CreatedAtRoute("GetCondomino", new {id = usuario.Id}, resultado);
            }

            [HttpPut("{id}")]
            public ActionResult<RetornoView<Usuario>> Update(int id, [FromBody] Usuario usuario) {
                if (usuario == null || usuario.Id != id) {
                    return BadRequest();
                }

                    var _usuario = _usuarioRepository.Find(id);

                        if (_usuario == null) {
                            return NotFound();
                        }

                            _usuario.Email              = usuario.Email;
                            _usuario.Senha              = usuario.Senha;
                 
                                _usuarioRepository.Update(_usuario);

                                    var resultado = new RetornoView<Usuario>() {data = _usuario, sucesso = true};

                                        return resultado;            }

            [HttpDelete("{id}")]
            public ActionResult<RetornoView<Usuario>> Delete(int id) {
                var usuario  = _usuarioRepository.Find(id);

                    if (usuario == null) {
                        return NotFound();
                    }

                        _usuarioRepository.Remove(id);

                            var resultado = new RetornoView<Usuario>() {data = {}, sucesso = true};

                                    return resultado;
            }
    }
}