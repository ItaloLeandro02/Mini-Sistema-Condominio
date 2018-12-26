using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using api.Models;
using api.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.Swagger;


namespace C_
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataDbContext>(options =>
            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
            services.AddTransient<ICondominoRepository, CondominoRepository>();
            services.AddTransient<IPessoaRepository, PessoaRepository>();
            services.AddTransient<IPorteiroRepository, PorteiroRepository>();
            services.AddTransient<IUsuarioRepository, UsuarioRepository>();
            services.AddTransient<IVisitaRepository, VisitaRepository>();
            services.AddTransient<ICondomino_ConvidadoRepository, Condomino_ConvidadoRepository>();
            services.AddTransient<IEnderecoRepository, EnderecoRepository>();

            //Especifica o esquema usado para autenticar o tipo Baerer
            //e
            //define configurações como chave, algoritmo, validade, data expiração...
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options => {
                options.TokenValidationParameters = new TokenValidationParameters {
                    ValidateIssuer              = true,
                    ValidateAudience            = true,
                    ValidateLifetime            = true,
                    ValidateIssuerSigningKey    = true,
                    ValidIssuer                 = "http://localhost:5000",
                    ValidAudience               = "http://localhost:5001/",
                    IssuerSigningKey            = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["SecurityKey"]))
                };

                options.Events = new JwtBearerEvents {
                    OnAuthenticationFailed = context => {
                        //Console.WriteLine("Token Inválido..." + context.Exception.Message);
                        if (context.Exception.GetType() == typeof(SecurityTokenExpiredException)) {
                            context.Response.Headers.Add("Token-Expirado", "true");
                            Console.WriteLine("Token Expirado..." + context.Exception.Message);
                        }
                        return Task.CompletedTask;
                    },

                    OnTokenValidated = context => {
                        Console.WriteLine("Token válido..." + context.SecurityToken);
                        return Task.CompletedTask;
                    },
                };
            });

            // Use the routing logic of ASP.NET Core 2.1 or earlier:
            services.AddMvc(options => options.EnableEndpointRouting = false)
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.AddResponseCompression();

            services.AddCors(o => o.AddPolicy("CorsApi", builder => {
                builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
            })); 

            services.AddSwaggerGen( x => {
                x.SwaggerDoc("api", new Info {
                    Version = "v1",
                    Title = "Mini Sistema Condomino",
                    Description = "Mini sistema desenvolvido para suprir as necessidades mais primitivas em um condominio.",
                    TermsOfService = "None",
                    Contact = new Contact() { Name = "Italo Leandro", Email = "italo_leandro@outlook.com", Url = "https://127.0.0.1:5001/api" }
                });
            }); 
        }
        

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            
            app.UseAuthentication();
            app.UseCors("CorsApi");
            app.UseHttpsRedirection();
            app.UseMvc();
            app.UseResponseCompression();  
            app.UseSwagger();
            app.UseSwaggerUI(c => {
                c.SwaggerEndpoint("/swagger/api/swagger.json", "Mini Sistema Condomino");
            });
        }
    }
}
