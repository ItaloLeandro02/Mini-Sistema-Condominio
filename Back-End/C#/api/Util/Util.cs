using System;
using System.Linq;

namespace api.Util
{
    public class Util
    {
        public static string geraDigital() {
            var letras      = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var digital     = "";
            int indice      = 0;
            var random      = new Random();

                for (int i=0; i < 5; i++) {
                    if (i < 2) {
                        indice      = random.Next(1,5);
                        digital     += new string(
                                        Enumerable.Repeat(letras, 1)
                                            .Select(s => s[random.Next(s.Length)])
                                            .ToArray());
                    }
                    else if (i > 2) {
                        digital     += random.Next(0,9);
                    }
                    else {
                        digital += "-";
                    }
                }

                 return digital;
        }
    }
}