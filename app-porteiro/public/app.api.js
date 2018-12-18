(function ()
{
    'use strict';

    angular
        .module('materialApp')
        .factory('api', apiService);
    
    function apiService($resource)
    {

      var api = {}      

      // Base Url
      api.baseUrl = 'https://localhost:5001/api/';

      
      /* Recursos da API */ 
      api.condomino   = $resource(api.baseUrl + 'condomino/:id', {id : '@id'},
        {update: {
          method: 'PUT'
        }
      })

      api.visita   = $resource(api.baseUrl + 'visita/:id', {id : '@id'},
        {update: {
          method: 'PUT'
        }
      })

      api.atualizaVisitaPessoa   = $resource(api.baseUrl + 'visita/:id/pessoa', {id : '@id'},
        {update: {
          method: 'PUT'
        }
      })

      api.atualizaVisitaPortaria   = $resource(api.baseUrl + 'visita/:id/portaria', {id : '@id'},
        {update: {
          method: 'PUT'
        }
      })

      api.atualizaVisitaSituacao   = $resource(api.baseUrl + 'visita/:id/situacao', {id : '@id'},
        {update: {
          method: 'PUT'
        }
      })

      api.porteiro  =$resource(api.baseUrl + 'porteiro/:id', {id : '@id'},
        {update: {
          method: 'PUT'
        }
      })

      api.convidado = $resource(api.baseUrl + 'convidado/:id', {id : '@id'},
        {update: {
          method: 'PUT'
        }
      })

      api.pessoa = $resource(api.baseUrl + 'pessoa/:id', {id : '@id'},
        {update: {
          method: 'PUT'
        }
      })

      api.usuario = $resource(api.baseUrl + 'usuario/:id', {id : '@id'},
        {update: {
          method: 'PUT'
        }
      })

      api.autenticacao = $resource(api.baseUrl + 'autenticacao');

      return api;
    }

})();
