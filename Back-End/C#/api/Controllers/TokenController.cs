using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace api.Controllers
{
    [Route("api/[controller]")]
    public class AutenticacaoController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly DataDbContext _context;
    
        public AutenticacaoController(IConfiguration configuration, DataDbContext ctx)
        {
            _configuration  = configuration;
            _context        = ctx;
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult RequestToken([FromBody] Usuario request) {

            var data = _context.Usuario
                    .Where(e => e.Email == request.Email)
                    .Where(s => s.Senha == request.Senha)
                    .Where(t => t.Tipo  == request.Tipo)
                    .First();

            var condomino = _context.Condomino
                   .Where(p => p.Usuario_Id == data.Id);

            if (data.Email.Length > 0 && data.Senha.Length > 0 && data.Id > 0) {
                var claims = new[] {
                    new Claim(ClaimTypes.Email, request.Email)
                };

                //Recebe uma instância da classe SymmetricSecurityKey
                //Armazena a chave de criptografia usada na criação do token
                var key = new SymmetricSecurityKey (
                            Encoding.UTF8.GetBytes(_configuration["SecurityKey"]));

                //Recebe um objeto do tipo SigninCredentials contendo a chave de
                //criptografia e o algoritmo de segurança empregados na geração
                //de assinaturas digitais para o tokens
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);          

                var token = new JwtSecurityToken (
                    issuer              : "macoratti.net",
                    audience            : "macoratti.net",
                    claims              : claims,
                    expires             : DateTime.Now.AddMilliseconds(10000),
                    signingCredentials  : creds);

                return Ok( new {
                    token       = new JwtSecurityTokenHandler().WriteToken(token),
                    mensagem    = "Bem vindo",
                    data        = data
                });
                  
            }
            return BadRequest("Credenciais Inválidas..");
        }
    }
}