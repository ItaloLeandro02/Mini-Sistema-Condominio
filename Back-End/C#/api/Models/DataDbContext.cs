using Microsoft.EntityFrameworkCore;

namespace api.Models
{
    public class DataDbContext : DbContext
    {
        public DataDbContext(DbContextOptions<DataDbContext> options) : base(options) {

        } 

        public DbSet<Condomino> Condomino  { get; set; }
        public DbSet<Endereco>  Enderecos   { get; set; }
        public DbSet<Pessoa>    Pessoas     { get; set; }
        public DbSet<Porteiro>  Porteiros   { get; set; }  
        public DbSet<Usuario>   Usuarios    { get; set; }       
        public DbSet<Visita>    Visitas     { get; set; }
    }
}