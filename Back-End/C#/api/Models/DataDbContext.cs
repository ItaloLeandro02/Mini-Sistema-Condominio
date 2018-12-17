using Microsoft.EntityFrameworkCore;

namespace api.Models
{
    public class DataDbContext : DbContext
    {
        public DataDbContext(DbContextOptions<DataDbContext> options) : base(options) {

        } 

        public DbSet<Condomino> Condomino { get; set; }
        public DbSet<Endereco> Endereco { get; set; }
        public DbSet<Pessoa> Pessoa { get; set; }
        public DbSet<Porteiro> Porteiro { get; set; }  
        public DbSet<Usuario> Usuario { get; set; }       
        public DbSet<Visita> Visita { get; set; }
        public DbSet<Condomino_Convidado> Condomino_Convidado { get; set; }
    }
}