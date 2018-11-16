
//Cria uma digital no formato XX-55
function criaDigital()
{
    var letras = 'ABCDEFGHIJKLMNOPQRSTUVWXTZ';
    var numeros = '0123456789';
    var aleatorio = '';
    for (var i = 0; i < 5; i++) 
    {
        if (i < 2) 
        {
        var rnum = Math.floor(Math.random() * letras.length);
        aleatorio += letras.substring(rnum, rnum + 1);
        }
        else if (i > 2)
        {
        var rnum = Math.floor(Math.random() * numeros.length);
        aleatorio += numeros.substring(rnum, rnum + 1);
        }
        else {
            aleatorio += '-';
        }
    }
    return aleatorio;
}



module.exports = {
    criaDigital : criaDigital
}
