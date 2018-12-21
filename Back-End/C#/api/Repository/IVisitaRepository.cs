using System.Collections.Generic;
using api.Models;

namespace api.Repository
{
    public interface IVisitaRepository
    {
         void Add(Visita visita);
         IEnumerable<Visita> GetAll();
         Visita Find(int id);
         void Remove(int id);
         void Update(Visita visita);
         
    }
}