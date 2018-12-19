using System.Collections.Generic;
using api.Models;

namespace api.Controllers
{
    public class RetornoView <T> where T : class {

        public bool sucesso { get; set; }

        public IEnumerable<T> data { get; set; }

    }
}