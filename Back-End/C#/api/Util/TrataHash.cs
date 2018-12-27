using System;
using System.Security.Cryptography;
using System.Text;
   public class TrataHash
    {
        public static string GeraMD5Hash(string texto)
        {
            //cria instância da classe MD5CryptoServiceProvider
            MD5CryptoServiceProvider MD5provider = new MD5CryptoServiceProvider();
            //gera o hash do texto
            byte[] valorHash = MD5provider.ComputeHash(Encoding.Default.GetBytes(texto));
            StringBuilder str = new StringBuilder();
            //retorna o hash
            for (int contador = 0; contador < valorHash.Length; contador++)
            {
                str.Append(valorHash[contador].ToString("x2"));
            }
            return str.ToString();
        }
        public static bool VerificaMD5Hash(string texto, string valorHashArmazenado)
        {
            //gera o hash para o texto
            string valorHash2 = GeraMD5Hash(texto);
            // Cria um StringComparer e compara o hash gerado com o armazenado
            StringComparer strcomparer = StringComparer.OrdinalIgnoreCase;
            //se o valor dos hash forem iguais então retorna true
            if (strcomparer.Compare(valorHash2, valorHashArmazenado).Equals(0))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }