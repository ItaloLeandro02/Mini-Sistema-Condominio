using System.Collections.Generic;
using api.Models;

namespace api.Repository
{
    public interface IPorteiroRepository
    {
         void Add(Porteiro porteiro);
         IEnumerable<Porteiro> GetAll();
         Porteiro Find(int id);
         void Remove(int id);
         void Update (Porteiro form, Porteiro banco);
    }
}