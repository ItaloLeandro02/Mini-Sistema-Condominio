using System.Collections.Generic;
using api.Models;

namespace api.Controllers
{
    public class RetornoView <T> where T : class {

        public bool sucesso { get; set; }

        public T data { get; set; }

    }
}