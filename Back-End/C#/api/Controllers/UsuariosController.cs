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
                var resultado = new RetornoView<Usuario>() {dadosUsuario = _usuarioRepository.GetAll()};
                    return Ok(resultado);
            }

            [HttpGet("{id}", Name = "GetUsuario")]
            public ActionResult<Usuario> GetById(int id) {
                var usuario =  _usuarioRepository.Find(id);

                    if (usuario == null) {
                        return NotFound();
                    }

                    return Ok(usuario);
            }

            [HttpPost]
            public IActionResult Create([FromBody] Usuario usuario) {
                if (usuario == null) {
                    return BadRequest();
                }

                _usuarioRepository.Add(usuario);

                    return CreatedAtRoute("GetUsuario", new {id = usuario.Id}, usuario);
            }

            [HttpPut("{id}")]
            public IActionResult Update(int id, [FromBody] Usuario usuario) {
                if (usuario == null /* || usuario.Id != id*/) {
                    return BadRequest();
                }

                var _usuario = _usuarioRepository.Find(id);

                    if (_usuario == null) {
                        return NotFound();
                    }

                    _usuario.Email              = usuario.Email;
                    _usuario.Senha              = usuario.Senha;
                 
                        _usuarioRepository.Update(_usuario);

                            return new NoContentResult();
            }

            [HttpDelete("{id}")]
            public IActionResult Delete(int id) {
                var usuario  = _usuarioRepository.Find(id);

                    if (usuario == null) {
                        return NotFound();
                    }

                    _usuarioRepository.Remove(id);

                        return new NoContentResult();
            }
    }
}