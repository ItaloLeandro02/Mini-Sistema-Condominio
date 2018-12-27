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

            var usuario = _context.Usuario
                    .Where(e => e.Email == request.Email)
                    .Where(t => t.Tipo  == request.Tipo)
                    .FirstOrDefault();

                if ((usuario != null) && (TrataHash.VerificaMD5Hash(request.Senha, usuario.Senha))) {
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
                        issuer              : "http://localhost:5000",
                        audience            : "http://localhost:5001/",
                        claims              : claims,
                        expires             : DateTime.Now.AddHours(1),
                        signingCredentials  : creds);

                        //Atualiza o Token do usuário
                        usuario.Token = new JwtSecurityTokenHandler().WriteToken(token);
                            _context.Usuario.Update(usuario);
                                _context.SaveChanges();

                        var resposta = new Object();

                         //Verifica o tipo de usuario para retonar o objeto compativel
                         switch (request.Tipo)
                         {
                              //Trocar Baerer por Bearer no front
                            case 1: 
                            
                                var porteiro = _context.Porteiro
                                    .Where(c => c.Usuario_Id == usuario.Id)
                                    .Include(p => p.pessoa)
                                    .First();
                                
                                    resposta = new {usuario = usuario, porteiro = porteiro, token = new JwtSecurityTokenHandler().WriteToken(token)};
                                
                                break;

                            case 2: 
                                var condomino = _context.Condomino
                                    .Where(c => c.Usuario_Id == usuario.Id)
                                    .Include(p => p.pessoa)
                                    .First();

                                     resposta = new {usuario = usuario, condomino = condomino, token = new JwtSecurityTokenHandler().WriteToken(token)};
                                
                                break;

                            case 3: 
                               
                                   resposta = new {usuario = usuario, token = new JwtSecurityTokenHandler().WriteToken(token)};
                                break;        
                                
                                default:
                                    return BadRequest();
                         }


                    return Ok( new {
                        sucesso     = true,
                        mensagem    = "Bem vindo",
                        data        = resposta
                    });
                    
                }
                
            return Unauthorized("Credenciais Inválidas..");
        }
    }
}